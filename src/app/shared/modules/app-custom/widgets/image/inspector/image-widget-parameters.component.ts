import { FilesService } from '@algotech-ce/business';
import { UUID } from 'angular2-uuid';
import { ListItem } from './../../../../inspector/dto/list-item.dto';
import { SnAppDto, SnPageDto, SnPageWidgetDto, TagListDto, TagDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../services';
import { DocumentsService, TranslateLangDtoService } from '@algotech-ce/angular';
import { TranslateService } from '@ngx-translate/core';
import { SessionsService } from '../../../../../services';
import { InputItem } from '../../../../inspector/dto/input-item.dto';
import { DataSelectorResult } from '../../../../inspector/dto/data-selector-result.dto';

@Component({
    selector: 'image-widget-parameters',
    templateUrl: './image-widget-parameters.component.html',
    styleUrls: ['./image-widget-parameters.component.scss'],
})
export class ImageWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    items: Observable<WidgetInput[]>;

    input: InputItem;
    isSmartModel: boolean;
    file: File;

    typesSrc: ListItem[];
    tagsList: ListItem[];
    tags: string[];

    constructor(
        private appCustomService: AppCustomService,
        private documentService: DocumentsService,
        private filesService: FilesService,
        private translateService: TranslateService,
        private translateLangService: TranslateLangDtoService,
        private sessionService: SessionsService,
    ) { }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
        this.items.subscribe(
            (data: WidgetInput[]) => {
                const wInput: WidgetInput = _.find(data, (wi: WidgetInput) => `{{${wi.category}.${wi.key}}}` === this.widget.custom.input);
                this.isSmartModel = wInput?.type.includes('so:');
        });

        this.typesSrc = [{
            key: 'file',
            value: this.translateService.instant('INSPECTOR.WIDGET.IMAGE-FILE'),
            icon: 'fa-solid fa-image',
        }, {
            key: 'uri',
            value: this.translateService.instant('INSPECTOR.WIDGET.IMAGE-URL'),
            icon: 'fa-solid fa-link',
        }, {
            key: 'datasource',
            value: this.translateService.instant('INSPECTOR.WIDGET.IMAGE-SOURCEDATA'),
            icon: 'fa-solid fa-file',
        }];

        this.input = {
            key: 'source',
            multiple: false,
            types: ['sk:atDocument', 'sys:file'],
            value: this.widget.custom.input,
        };

        if (this.widget?.custom?.imageUuid) {
              this.filesService.downloadFile(this.widget?.custom?.imageUuid).subscribe((myblob: Blob) => {
                this.file = new File([myblob], 'name', { type: myblob.type });
            });
        }
        this.tagsList = this._getTags();
    }

    onChangeUri(data) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.imageUri = data;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onChangeFile(data) {
        this.file = undefined;

        setTimeout(() => {
            this.file = data.addedFiles[0];
            this.uploadFile(this.file);
        });
    }

    uploadFile(f: File) {
        const uuid: string = UUID.UUID();
        this.documentService.uploadDocument(this.file, this.file.name, uuid).subscribe(() => {
            const custom = _.cloneDeep(this.widget.custom);
            custom.imageUuid = uuid;
            this.widget.custom = custom;
            this.changed.emit();
        });
    }

    onRemoveFile() {
        this.file = undefined;
        const custom = _.cloneDeep(this.widget.custom);
        custom.imageUuid = '';
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSelectType(type: string) {
        this.isSmartModel = false;
        const custom = _.cloneDeep(this.widget.custom);
        custom.typeSrc = type;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSourceChanged(data: DataSelectorResult) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.input = data.path;
        this.isSmartModel = (data.type.includes('so:'));
        if (!this.isSmartModel) {
            custom.tag = '';
        }
        this.widget.custom = custom;
        this.changed.emit();
    }

    updateTag(tag: string) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.tag = tag;
        this.widget.custom = custom;
        this.changed.emit();
    }

    _getTags(): ListItem[] {
        return _.reduce(this.sessionService.active.datas.read.tags, (result, tag: TagListDto) => {
            if (tag.applyToImages) {
                result.push(..._.map(tag.tags, (tg: TagDto) => (
                    {
                        key: tg.key,
                        value: this.translateLangService.transform(tg.displayName),
                        color: tg.color,
                        icon: 'fa-solid fa-circle'
                    }
                )));
            }
            return result;
        }, []);
    }
}
