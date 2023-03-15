import { GridConfigurationDto } from '@algotech/business';
import { GridComponent } from '@algotech/business';
import { GridColumnConfigurationDto } from '@algotech/business/src/lib/@components/grid/dto/grid-column-configuration.dto';
import { SmartObjectDto, SysQueryDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SnContextmenuAction } from '../../../modules/smart-nodes';
import { DataBaseAction } from '../actions/actions';
import { AppDataBaseContextMenuComponent } from '../context-menu/context-menu.component';
import { BreadCrumbLink } from '../interfaces/link.interface';
import { Row } from '../interfaces/row.interface';

@Component({
    selector: 'app-search-so-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})

export class SearchSoGridComponent {
    @ViewChild('grid', { static: true }) grid: GridComponent;
    @Input() empty: boolean;
    @Input() data: Row[];
    @Input() query: SysQueryDto;
    @Input() moreDataToLoad: boolean;
    @Input() loading: boolean;
    @Input() configuration: GridConfigurationDto;
    @Input() paginate: string;
    @Input() count: number;
    @Input() actions: SnContextmenuAction[];
    @Input() dismiss: Subject<any>


    constructor() { }
    onQueryChanged(currentQuery) {
        /*this.reloadDataBase.emit(currentQuery);*/
    }
}
