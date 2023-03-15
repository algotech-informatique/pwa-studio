import { DocumentsService, TranslateLangDtoService } from '@algotech/angular';
import { GroupDto, PairDto, SmartModelDto, SmartPropertyModelDto, SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import * as _ from 'lodash';
import { ListItem } from '../../../../../inspector/dto/list-item.dto';
import { IconsService, SessionsService } from '../../../../../../services';

@Component({
    selector: 'magnet-widget-parameters',
    templateUrl: './magnet-widget-parameters.component.html',
    styleUrls: ['./magnet-widget-parameters.component.scss']
})

export class MagnetWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();
    snApp: SnAppDto;
    widget: SnPageWidgetDto;
    file: File;
    selectedSmartModel: SmartModelDto;
    smartmodels: ListItem[];
    properties: ListItem[];
    propertyType: string;
    securityList: ListItem[];

    constructor(
        private documentService: DocumentsService,
        private sessionsService: SessionsService,
        private translateLangDtoService: TranslateLangDtoService,
        private iconsService: IconsService,
    ) { }

    initialize() {
        // if (this.widget?.custom?.imageUuid) {
        //     this.filesService.downloadFile(this.widget?.custom?.imageUuid).subscribe((myblob: Blob) => {
        //         this.file = new File([myblob], 'name', { type: myblob.type });
        //     });
        // }

        this.securityList = this.getSecurityList();
        this.smartmodels = this.getSmartModelsList();

        if (this.widget.custom.modelKey) {
            this.setPropertiesList();
        }
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

    onSelectSmartmodel(key: string) {
        this.widget.custom.modelKey = key;
        this.widget.custom.filter = null;
        this.setPropertiesList();
        this.changed.emit();
    }

    onSelectFilterProperty(property: string) {
        this.widget.custom.filter.property = property;
        this.setPropertyType();
        this.changed.emit();
    }

    onChangeFilterValue(event: PairDto) {
        this.widget.custom.filter.value = event.value;
        this.changed.emit();
    }

    eraseFilter() {
        this.widget.custom.filter = null;
        this.changed.emit();
    }

    addFilter() {
        this.widget.custom.filter = {
            property: '',
            value: '',
        };
        this.changed.emit();
    }

    onChangePermissions(event: string[]) {
        this.widget.custom.permissions = event;
        this.changed.emit();
    }

    private uploadFile(f: File) {
        const uuid: string = UUID.UUID();
        this.documentService.uploadDocument(f, f.name, uuid).
            subscribe(() => {
                const custom = _.cloneDeep(this.widget.custom);
                custom.imageUuid = uuid;
                this.widget.custom = custom;
                this.changed.emit();
            });
    }

    private getSmartModelsList(): ListItem[] {
        return _.reduce(this.sessionsService.active.datas.read.smartModels, (res: ListItem[], smartModel: SmartModelDto) => {
            if (smartModel.skills.atMagnet) {
                res.push({
                    key: smartModel.key,
                    value: this.translateLangDtoService.transform(smartModel.displayName),
                });
            }
            return res;
        }, []);
    }

    private setPropertiesList() {
        this.selectedSmartModel = _.find(this.sessionsService.active.datas.read.smartModels, { key: this.widget.custom.modelKey });

        if (this.widget.custom.filter?.property) {
            this.setPropertyType();
        }

        this.properties = this.getPropertiesList();
    }

    private setPropertyType() {
        const property: SmartPropertyModelDto = _.find(this.selectedSmartModel?.properties, { key: this.widget.custom.filter.property });
        this.propertyType = property.keyType;
    }

    private getSecurityList(): ListItem[] {
        return _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) => ({
            key: group.key,
            value: group.name,
            icon: 'fa-solid fa-users',
        }));
    }

    private getPropertiesList(): ListItem[] {
        return _.reduce(this.selectedSmartModel.properties, (res: ListItem[], property: SmartPropertyModelDto) => {
            if (['string', 'boolean', 'number'].indexOf(property.keyType) > -1) {
                res.push({
                    key: property.key,
                    value: this.translateLangDtoService.transform(property.displayName),
                    icon: this.iconsService.getIconByType(property.keyType)?.value,
                    color: this.iconsService.getIconColor(property.keyType)
                });
            }
            return res;
        }, []);
    }
}
