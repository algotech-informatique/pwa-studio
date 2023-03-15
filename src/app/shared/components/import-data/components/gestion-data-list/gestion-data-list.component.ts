import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';
import { ImportDataService } from '../../services/import-data.service';

@Component({
    selector: 'gestion-data-list',
    templateUrl: './gestion-data-list.component.html',
    styleUrls: ['./gestion-data-list.component.scss'],
})
export class GestionDataListComponent implements OnChanges {

    @Input() optionList: OptionsObjectDto[] = [];
    @Input() searchPlaceHolder: string;
    @Output() selectedChanged = new EventEmitter();

    search = '';
    optionListFiltered: OptionsObjectDto[] = [];

    constructor(
        private importDataService: ImportDataService,
    ) { }

    ngOnChanges() {
        this.optionListFiltered = this.optionList;
    }

    onSearch(data) {
        this._filterList(data);
    }

    _filterList(filter: string) {

        this.optionListFiltered = _.reduce(this.optionList, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine?.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

    onSelected(data) {
        this.importDataService.activateOptionList(data);
        this.selectedChanged.emit(data);
    }
}
