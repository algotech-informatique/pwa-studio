import { GridConfigurationDto } from '@algotech/business';
import { GridComponent } from '@algotech/business';
import { GridColumnConfigurationDto } from '@algotech/business/src/lib/@components/grid/dto/grid-column-configuration.dto';
import { SmartObjectDto, SysQueryDto } from '@algotech/core';
import { Component, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SnContextmenuAction } from '../../../modules/smart-nodes';
import { DataBaseAction } from '../actions/actions';
import { AppDataBaseContextMenuComponent } from '../context-menu/context-menu.component';
import { BreadCrumbLink } from '../interfaces/link.interface';
import { Row } from '../interfaces/row.interface';

@Component({
    selector: 'app-data-base-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})

export class AppDataBaseGridComponent implements OnChanges {
    @ViewChild('grid', { static: true }) grid: GridComponent;
    @Input() empty: boolean;
    @Input() data: Row[];
    @Input() query: SysQueryDto;
    @Input() moreDataToLoad: boolean;
    @Input() loading: boolean;
    @Input() configuration: GridConfigurationDto;
    @Input() paginate: string;
    @Input() count: number;
    @Input() skip: number;
    @Input() lastPage: number;
    @Input() actions: SnContextmenuAction[];
    @Output() reloadDataBase = new EventEmitter<SysQueryDto>();
    @Output() executeAction = new EventEmitter<DataBaseAction>();
    @Output() navigateTo = new EventEmitter<BreadCrumbLink>();
    soCount = 0;
    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.soCount = !this.count ? 0 : this.count;
    }
    onQueryChanged(currentQuery) {
        this.reloadDataBase.emit(this.query);
    }

    onCellChange(value, row, key: string) {
        this.executeAction.emit({ key: 'update', value: { key, row, value } });
    }

    onFileDropped(ev) {
        if (this.configuration.columns.length > 0) {
            this.executeAction.emit({ key: 'importSOs', event: ev });
        }
    }

    onActionClick($event, id) {
        if (id || (this.configuration.selection?.selected && this.configuration.selection?.selected.length > 0)) {
            this.grid.showPopup.next({
                component: AppDataBaseContextMenuComponent,
                event: $event,
                width: 250,
                props: {
                    dismiss: this.grid.dismissPopup,
                    id,
                    actions: this.actions
                }
            });
        }
    }

    onCellClick(row: Row, column: GridColumnConfigurationDto) {
        if (column.custom.clickable) {
            const prop = row.properties.find(c => c.key === column.key);
            if (prop) {
                this.navigateTo.emit({
                    root: false,
                    path: column.key,
                    key: column.key,
                    parentUuid: row.id,
                    display: column.name,
                    model: column.type.split('so:')[1],
                    uuids: !prop?.value ? [] : Array.isArray(prop.value) ?
                        (prop.value as SmartObjectDto[]).map(so => (so.uuid as string)) :
                        [(prop.value as SmartObjectDto).uuid as string],
                    multiple: column.multiple,
                    isComposition: column.custom.isComposition
                });
            }
        }
    }
}
