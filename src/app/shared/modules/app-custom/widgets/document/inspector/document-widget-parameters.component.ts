import { GroupDto, SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { AppCustomService } from '../../../services';
import { Observable } from 'rxjs';
import { InputItem } from '../../../../inspector/dto/input-item.dto';
import { ListItem } from '../../../../inspector/dto/list-item.dto';
import { TranslateService } from '@ngx-translate/core';
import { SessionsService } from '../../../../../services';
import { DataSelectorResult } from '../../../../inspector/dto/data-selector-result.dto';

@Component({
    selector: 'document-widget-parameters',
    templateUrl: './document-widget-parameters.component.html',
    styleUrls: ['./document-widget-parameters.component.scss'],
})
export class DocumentWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;
    snApp: SnAppDto;
    page: SnPageDto;
    items: Observable<WidgetInput[]>;
    input: InputItem;
    groupsList: ListItem[];
    modes: ListItem[];
    types: ListItem[];
    pagination: InputItem = {
        key: 'paginate',
        multiple: false,
        types: ['number'],
        value: '0',
    };

    constructor(
        private appCustomService: AppCustomService,
        private sessionsService: SessionsService,
        private translateService: TranslateService,
    ) {
        this.modes = [{
            key: 'list',
            value: this.translateService.instant('INSPECTOR.WIDGET.DOCUMENTS.MODE.LIST'),
            icon: 'fa-solid fa-list-ul',
        }, {
            key: 'grid',
            value: this.translateService.instant('INSPECTOR.WIDGET.DOCUMENTS.MODE.GRID'),
            icon: 'fa-solid fa-table-cells-large',
        }, {
            key: 'carousel',
            value: this.translateService.instant('INSPECTOR.WIDGET.DOCUMENTS.MODE.CAROUSEL'),
            icon: 'fa-solid fa-images',
        },];

        this.types = [{
            key: 'documents',
            value: this.translateService.instant('INSPECTOR.WIDGET.DOCUMENTS.TYPE.DOCUMENTS'),
            icon: 'fa-solid fa-file',
        }, {
            key: 'images',
            value: this.translateService.instant('INSPECTOR.WIDGET.DOCUMENTS.TYPE.IMAGES'),
            icon: 'fa-solid fa-image',
        }];
    }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
        this.input = {
            key: 'source',
            multiple: true,
            types: ['sk:atDocument', 'sys:file'],
            value: this.widget.custom.input,
            multiNoStrict: true,
        };
        this.groupsList = _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) =>
            ({
                key: group.key,
                value: group.name,
                icon: 'fa-solid fa-users',
            })
        );
        this.pagination.value = this.widget.custom?.pagination;
    }

    onModeChanged(mode: string) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.mode = mode;
        switch (mode) {
            case 'carousel':
                custom.pagination = 0;
                custom.type = ['images'];
                custom.search = false;
                custom.tagFilter = false;
                custom.metadatas = false;
                custom.oldVersions.active = false;
                break;
            case 'list':
                custom.pagination = 10;
                custom.type = ['images', 'documents'];
                custom.search = true;
                custom.tagFilter = false;
                custom.metadatas = true;
                custom.oldVersions.active = true;
                break;
            case 'grid':
                custom.pagination = 30;
                custom.type = ['images'];
                custom.search = false;
                custom.tagFilter = false;
                custom.metadatas = false;
                custom.oldVersions.active = false;
                break;
        }
        this.widget.custom = custom;
        this.pagination.value = this.widget.custom?.pagination;
        this.changed.emit();
    }

    onTypeChanged(type: string) {
        const custom = _.cloneDeep(this.widget.custom);
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSearchChanged(search: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.search = search;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onTagFilterChanged(tagFilter: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.tagFilter = tagFilter;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onMetadatasChanged(metadatas: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.metadatas = metadatas;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onOldVersionsActiveChanged(activeOldVersions: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.oldVersions.active = activeOldVersions;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onOldVersionsGroupsChanged(items: string[]) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.oldVersions.groups = items;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onPaginationChanged(pagination: boolean) {

        const custom = _.cloneDeep(this.widget.custom);
        custom.pagination = pagination ?
            custom.mode === 'grid' ? 30 : 10 : 0;

        this.widget.custom = custom;
        this.pagination.value = this.widget.custom.pagination;
        this.changed.emit();
    }

    onPaginationNumberChanged(pagination: DataSelectorResult) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.pagination = pagination.path;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSourceChanged(source: DataSelectorResult) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.input = source.path;
        this.widget.custom = custom;
        this.changed.emit();
    }
}
