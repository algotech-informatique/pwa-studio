import { TranslateLangDtoService } from '@algotech-ce/angular';
import { GridConfigurationDto } from '@algotech-ce/business';
import { GridColumnConfigurationDto } from '@algotech-ce/business/src/lib/@components/grid/dto/grid-column-configuration.dto';
import { PairDto, SmartModelDto, SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSelectionService, PageUtilsService } from '../../../../app/services';
import { AppCustomService } from '../../../services';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { IconsService } from '../../../../../services';
import { generateSos, getMockType, getPropertyValue, mockData } from '../data/table-mock-data';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
selector: 'widget-table',
templateUrl: './widget-table.component.html',
styleUrls: ['widget-table.component.scss'],
})
export class WidgetTableComponent implements WidgetComponentInterface, OnDestroy {

    widget: SnPageWidgetDto;
    subscriber: Subscription;
    snApp: SnAppDto;
    selectedColumnId: string | null;
    configuration: GridConfigurationDto;
    columns: GridColumnConfigurationDto[] = [];
    data: { id: string; properties: PairDto[] }[] = [];
    subscription: Subscription;

    constructor(
        private appSelection: AppSelectionService,
        private appCustomService: AppCustomService,
        private translateLangDto: TranslateLangDtoService,
        private pageUtilsService: PageUtilsService,
        private icons: IconsService,
    ) { }

    initialize() {
        this.setConfiguration();
        this.subscription = this.appSelection.onSelect(this.snApp).subscribe(() => {
            this.columns = this.columns.map(column => {
                let widgetColumn = this.appSelection.selections.widgets.find(w => w.id === column.id);
                widgetColumn = widgetColumn?.displayState?.rule?.widget || widgetColumn;
                if (widgetColumn) {
                    column.width = widgetColumn.box.width;
                    column.custom = {
                        overloadStyle: widgetColumn.custom.overloadStyle,
                        css: widgetColumn.css,
                        icon: widgetColumn.custom.icon,
                        display: widgetColumn.custom.display,
                        format: widgetColumn.custom.format,
                        widget: widgetColumn,
                    };
                }
                column.selected = !!widgetColumn;
                return column;
            });
        });
    }

    calculate() {
        this.setConfiguration();
        this.updateTableSelectedColumns();
    }

    setConfiguration() {
        const page = this.pageUtilsService.findPage(this.snApp, this.widget);
        const keyType = page ?
            this.appCustomService.getPathTypeAndMultiple(this.widget.custom.collection, page, this.widget)?.type : null;
        const model = keyType ? this.appCustomService.getModel(keyType) : undefined;

        this.data = !model ? [] : this.data;
        const setNoCollectionMockData = this.data.length === 0 && !model && !this.widget.custom.collection;
        const setCollectionMockData = model && this.widget.custom.collection &&
            ((!_.isEqual(this.columns?.map(c => c.key)?.sort(), this.widget.custom?.columns?.sort())) || this.data.length === 0);

        this.setColumns(model);

        if (setNoCollectionMockData || setCollectionMockData) {
            this.setData();
        }

        const ev = this.widget.events.find((e) => e.eventKey.toLowerCase() === 'onrowselection');
        this.configuration = {
            id: this.widget.id,
            search: this.widget.custom.search,
            rowHeight: this.widget.css?.row?.height?.slice(0, -2),
            colSelectable: true,
            headerEditable: this.widget.custom.editable,
            selection: this.widget.custom.multiselection ? {
                multiselection: this.widget.custom.multiselection,
                selected: [],
                list: this.data.map(d => d.id),
            } : undefined,
            reorder: this.widget.custom.reorder,
            columns: this.columns,
            icons: this.icons.loadListIcons(),
            hasActions: (ev?.pipe.length || 0) > 0,
        };
    }

    setColumns(model?: SmartModelDto) {
        this.columns = this.widget.group?.widgets ? this.widget.group?.widgets.map(widgetColumn => {
            const property = model?.properties.find(prop => prop.key === widgetColumn.custom.propertyKey);
            widgetColumn = widgetColumn.displayState?.rule?.widget || widgetColumn;
            return ({
                id: widgetColumn.id,
                key: widgetColumn.custom.propertyKey,
                name: property ? this.translateLangDto.transform(property.displayName) : widgetColumn.custom.propertyKey,
                resize: widgetColumn.custom.resize,
                filter: widgetColumn.custom.filter,
                sort: widgetColumn.custom.sort,
                type: this.widget.custom.collection ? property?.keyType : getMockType(widgetColumn.custom.propertyKey),
                multiple: property?.multiple,
                width: widgetColumn.box.width,
                selected: this.appSelection.selections.widgets.some(w => w.id === widgetColumn.id),
                custom: {
                    overloadStyle: widgetColumn.custom.overloadStyle,
                    css: widgetColumn.css,
                    icon: widgetColumn.custom.icon,
                    display: widgetColumn.custom.display,
                    format: widgetColumn.custom.format,
                    widget: widgetColumn
                },
                sticky: 'none',
            } as GridColumnConfigurationDto);
        }) : [];
    }

    setData() {
        this.data = this.widget.custom.collection ?
            [...Array(10)].map(() => {
                const properties = this.columns.map(column => {
                    const value = column.type?.startsWith('so:') ?
                        generateSos(this.appCustomService.getModel(column.type)) : getPropertyValue(column.type);
                    return {
                        key: column.key,
                        value,
                    };
                });
                return {
                    id: UUID.UUID(),
                    properties,
                };
            }) : mockData;
    }

    updateTableSelectedColumns() {
        if (this.columns?.length < this.widget.custom?.columns?.length) {
            this.widget.custom.columns = this.widget.custom.columns.reduce((res: string[], c: string) => {
                if (this.columns.some(column => column.key === c)) {
                    res.push(c);
                }
                return res;
            }, []);
        }
    }

    ngOnDestroy() {
        this.subscription?.unsubscribe();
    }

}
