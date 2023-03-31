import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, ComponentRef, EventEmitter, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { DataSelectorResult } from '../../../../inspector/dto/data-selector-result.dto';
import { InputItem } from '../../../../inspector/dto/input-item.dto';
import { ListItem } from '../../../../inspector/dto/list-item.dto';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../services';
import * as _ from 'lodash';

@Component({
    selector: 'list-widget-parameters',
    templateUrl: './list-widget-parameters.component.html',
    styleUrls: ['./list-widget-parameters.component.scss'],
})
export class ListWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    subWidgets: SnPageWidgetDto[];

    items: Observable<WidgetInput[]>;
    inputResultNumber: InputItem;
    inputCollection: InputItem;
    typesFlex: ListItem[];
    paginationLimit: ListItem[] = [];

    componentRef: ComponentRef<any>;

    constructor(
        private appCustomService: AppCustomService,
        private translateService: TranslateService,
    ) {
        this.paginationLimit = [{
            key: 'button',
            value: this.translateService.instant('INSPECTOR.WIDGET.LIST.PAGINATION-BUTTON'),
            icon: 'fa-solid fa-hand-pointer',
        }, {
            key: 'infinite',
            value: this.translateService.instant('INSPECTOR.WIDGET.LIST.PAGINATION-INFINITE'),
            icon: 'fa-solid fa-infinity',
        }];

    }

    initialize() {
        this.loadList();
    }

    loadList() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget, null, null);
        this.typesFlex = [{
            key: 'column',
            value: this.translateService.instant('INSPECTOR.WIDGET.LIST.FLEXDIRECTION-COLUMN'),
            icon: 'fa-solid fa-angle-double-down',
        }, {
            key: 'row',
            value: this.translateService.instant('INSPECTOR.WIDGET.LIST.FLEXDIRECTION-ROW'),
            icon: 'fa-solid fa-angle-double-right',
        }];

        this.inputResultNumber = {
            key: 'paginate',
            multiple: false,
            types: ['number'],
            value: this.widget.custom.paginate.limit,
        };
        this.inputCollection = {
            key: 'collection',
            multiple: true,
            types: null,
            value: this.widget.custom.collection,
        };
    }

    onCollectionChanged(input: DataSelectorResult) {
        this.widget.custom.collection = input.path;
        this.changed.emit();
    }

    onListResultNumberChanged(input: DataSelectorResult) {
        this.widget.custom.paginate.limit = input.path;
        this.changed.emit();
    }

    clickSearchList(value: boolean) {
        this.widget.custom.search = value;
        this.changed.emit();
    }

    onSelectModePagination(data: string) {
        this.widget.custom.paginate.mode = data;
        this.changed.emit();
    }

    onSelectFlexDirection(data: string) {
        this.widget.custom.direction = data;
        this.changed.emit();
    }

    clickScrollbarList(value: boolean) {
        if (!value) {
            this.widget.custom.paginate.mode = 'button';
        }
        this.widget.custom.scrollbar = value;
        this.changed.emit();
    }

    onPaginationChanged(pagination: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.paginate.limit = pagination ? 20 : 0;
        this.widget.custom = custom;
        this.inputResultNumber.value = this.widget.custom.paginate.limit;
        this.changed.emit();
    }
}
