import { DocumentsService } from '@algotech/angular';
import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { InputItem } from '../../../../inspector/dto/input-item.dto';
import { AppCustomService } from '../../../services';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { DataSelectorResult } from 'src/app/shared/modules/inspector/dto/data-selector-result.dto';

@Component({
    selector: 'board-widget-parameters',
    templateUrl: './board-widget-parameters.component.html',
    styleUrls: ['./board-widget-parameters.component.scss']
})

export class BoardWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();
    snApp: SnAppDto;
    page: SnPageDto;
    widget: SnPageWidgetDto;
    file: File;

    items: Observable<WidgetInput[]>;
    input: InputItem;

    constructor(
        private documentService: DocumentsService,
        private appCustomService: AppCustomService) { }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
        this.input = {
            key: 'instance',
            multiple: false,
            types: ['string'],
            value: this.widget.custom.instance ? this.widget.custom.instance : ''
        };
        if (this.widget?.custom?.imageUuid) {
            // this.filesService.downloadFile(this.widget?.custom?.imageUuid).subscribe((myblob: Blob) => {
            //     this.file = new File([myblob], 'name', { type: myblob.type });
            // });
        }
    }

    onInstanceChanged(event: DataSelectorResult) {
        this.widget.custom.instance = event.path;
        this.changed.emit();
    }

    onChangeFile(data) {
        setTimeout(() => {
            this.uploadFile(data.addedFiles[0]);
        });
    }

    onRemoveFile() {
        this.file = undefined;
        const custom = _.cloneDeep(this.widget.custom);
        custom.imageUuid = '';
        this.widget.custom = custom;
        this.changed.emit();
    }

    uploadFile(f: File) {
        const uuid: string = UUID.UUID();
        this.documentService.uploadDocument(f, f.name, uuid).
            subscribe(() => {
                const custom = _.cloneDeep(this.widget.custom);
                const box = _.cloneDeep(this.widget.box);
                custom.imageUuid = uuid;

                // resize page + widgets
                this.getSize(f).subscribe((res) => {
                    box.width = res[0];
                    box.height = res[1];

                    // TODO how to know in which page we are ? we need to take page size in account below
                    if (box.x + box.width > this.snApp.pageWidth) {
                        box.x = Math.max(0, (box.x - ((box.x + box.width) - this.snApp.pageWidth)));
                    }
                    if (box.y + box.height > this.snApp.pageHeight) {
                        box.y = Math.max(0, (box.y - ((box.y + box.height) - this.snApp.pageHeight)));
                    }

                    this.snApp.pageWidth = Math.max(this.snApp.pageWidth, (box.x + box.width));
                    this.snApp.pageHeight = Math.max(this.snApp.pageHeight, (box.y + box.height));

                    this.widget.custom = custom;
                    this.widget.box = box;
                    this.changed.emit();
                });
            });
    }

    getSize(file) {
        const blob = URL.createObjectURL(file);
        return new Observable((observer) => {
            const i = new Image();
            i.onload = () => {
                const width = i.width;
                const height = i.height;
                observer.next([
                    width,
                    height
                ]);
            };
            i.onerror = ((err) => observer.error(err));
            i.src = blob;
        });
    }
}
