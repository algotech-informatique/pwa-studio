import { TranslateLangDtoService } from '@algotech-ce/angular';
import { SnPageWidgetDto, SnAppDto, SnPageDto, SmartModelDto } from '@algotech-ce/core';
import { Component, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { IconsService } from '../../../../../services';
import { PageUtilsService, PageWidgetService } from '../../../../app/services';
import { DataSelectorResult } from '../../../../inspector/dto/data-selector-result.dto';
import { InputItem } from '../../../../inspector/dto/input-item.dto';
import { ListItem } from '../../../../inspector/dto/list-item.dto';
import { WidgetInput } from '../../../dto/widget-input.dto';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';
import { AppCustomService } from '../../../services';
import { WidgetTableService } from '../services/widget-table.service';

@Component({
selector: 'table-widget-parameters',
templateUrl: './table-widget-parameters.component.html',
styleUrls: ['./table-widget-parameters.component.scss'],
})
export class TableWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;
    page: SnPageDto;
    items: Observable<WidgetInput[]>;
    inputCollection: InputItem;
    columnsList: ListItem[] = [];
    paginationModes: ListItem[] = [];
    inputPagination: InputItem;
    collectionModel: SmartModelDto | undefined;

    constructor(
        private appCustomService: AppCustomService,
        private translateLangDtoService: TranslateLangDtoService,
        private iconsService: IconsService,
        private translateService: TranslateService,
        private widgetTableService: WidgetTableService,
        private pageWidget: PageWidgetService,
        private pageUtils: PageUtilsService,
    ) {
        this.paginationModes = [{
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
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);

        this.inputCollection = {
            key: 'collection',
            multiple: true,
            types: ['so:*'],
            value: this.widget.custom.collection,
        };

        this.inputPagination = {
            key: 'paginate',
            multiple: false,
            types: ['number'],
            value: this.widget.custom.paginate.limit,
        };

        const model = this.appCustomService.getModel(this.widget.custom.collectionType);
        if (model !== this.collectionModel) {
            this.collectionModel = model;
            this.getListColumns();
        }
    }

    onCollectionChanged(input?: DataSelectorResult) {
        const custom = _.cloneDeep(this.widget.custom);
        if (input) {
            custom.collection = input.path;
            this.widget.custom = custom;
        }
        const currentPage = this.pageUtils.findPage(this.snApp, this.widget);
        const collectionType = this.appCustomService.getPathTypeAndMultiple(custom.collection, currentPage, this.widget)?.type;
        if (collectionType !== custom.collectionType) {
            custom.collectionType = collectionType;
            this.widget.custom = custom;
            this.collectionModel = this.appCustomService.getModel(custom.collectionType);

            if (this.widget.returnData) {
                this.widget.returnData.forEach((r) => r.type = custom.collectionType);
            }
            this.resetSelectedColumns();
            this.getListColumns();
        }
        this.changed.emit();
    }

    onChangeColumns(columns: string[]) {
        if (columns.length < (this.widget.custom.columns as string[]).length) {
            this.removeColumn(columns);
        } else {
            this.addColumn(columns);
        }
        const custom = _.cloneDeep(this.widget.custom);
        custom.columns = columns;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSearchChanged(search: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.search = search;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSortChanged(sort: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.sort = sort;
        this.widget.custom = custom;
        this.widget.group?.widgets.map(column => {
            column.custom.sort = sort;
            return column;
        });
        this.changed.emit();
    }

    onFilterChanged(filter: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.filter = filter;
        this.widget.custom = custom;
        this.widget.group?.widgets.map(column => {
            column.custom.filter = filter;
            return column;
        });
        this.changed.emit();
    }

    onPaginationChanged(pagination: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.paginate.limit = pagination ? 20 : 0;
        this.widget.custom = custom;
        this.inputPagination.value = this.widget.custom.paginate.limit;
        this.changed.emit();
    }

    onPaginationNumberChanged(input: DataSelectorResult) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.paginate.limit = input.path;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onSelectModePagination(mode: string) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.paginate.mode = mode;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onResizeChanged(resize: boolean) {
        this.widget.custom.resize = resize;
        this.widget.group?.widgets.map(column => {
            column.custom.resize = resize;
            return column;
        });
        this.changed.emit();
    }

    onReorderChanged(reorder: boolean) {
        this.widget.custom.reorder = reorder;
        this.changed.emit();
    }

    onMultiselectionChanged(multiselection: boolean) {
        const custom = _.cloneDeep(this.widget.custom);
        custom.multiselection = multiselection;
        this.widget.custom = custom;
        this.changed.emit();
    }

    onEditableChanged(editable: boolean) {
        this.widget.custom.editable = editable;
        this.changed.emit();
    }

    private addColumn(columns: string[]) {
        const toAdd = columns.find((col: string) => !this.widget.custom.columns.includes(col));
        const property = this.collectionModel?.properties.find(prop => prop.key === toAdd);
        if (property) {
            const columnToAdd = this.widgetTableService.createColumn(this.widget, property);
            this.widget.group = this.pageWidget.buildGroup([...this.widget.group?.widgets || [], columnToAdd]);
        }
    }

    private removeColumn(columns: string[]) {
        const toRemove = (this.widget.custom.columns as string[]).find(col => !columns.includes(col));
        if (toRemove) {
            this.widgetTableService.removeColumn(this.widget, toRemove);
        }
    }

    private getListColumns() {
        this.columnsList = this.collectionModel?.properties.map(prop =>
            ({
                key: prop.key,
                value: this.translateLangDtoService.transform(prop.displayName),
                icon: this.iconsService.getIconByType(prop.keyType)?.value,
                color: this.iconsService.getIconColor(prop.keyType),
            })
        ) || [];
    }

    private resetSelectedColumns() {
        if (this.collectionModel) {
            this.widgetTableService.setDefaultColumns(this.widget, this.collectionModel);
        }
    }

}
