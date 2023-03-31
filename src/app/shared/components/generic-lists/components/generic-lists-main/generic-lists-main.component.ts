import { TranslateLangDtoService } from '@algotech-ce/angular';
import { GenericListDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';

@Component({
    selector: 'generic-lists-main',
    templateUrl: './generic-lists-main.component.html',
    styleUrls: ['./generic-lists-main.component.scss'],
})
export class GenericListsMainComponent implements OnChanges {

    @Input() genericLists: GenericListDto[] = [];
    @Input() selectedId: string;

    _search = '';
    @Input()
    get search() {
        return this._search;
    }
    @Output() searchChange = new EventEmitter();
    set search(data) {
        this._search = data;
        this.searchChange.emit(data);
    }

    @Output() selectedList = new EventEmitter();
    @Output() createNewList = new EventEmitter();

    optionList:  OptionsObjectDto[] = [];
    optionListFiltered: OptionsObjectDto[] = [];

    constructor(
        private translateService: TranslateLangDtoService,
    ) { }

    ngOnChanges() {
        this.loadList();
    }

    loadList() {
        this.optionList = _.map(this.genericLists, (gList: GenericListDto) => {
            const option: OptionsObjectDto = {
                title: this.translateService.transform(gList.displayName),
                mainLine: gList.key,
                uuid: gList.uuid,
            };
            return option;
        });
        this._filterList(this.search);
    }

    onSelectedObject(data) {
        this.selectedList.emit(data);
    }

    onSearch(data) {
        this._filterList(data);
    }

    _filterList(filter: string) {

        this.optionListFiltered = _.reduce(this.optionList, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

    onCreateNewList() {
        this.createNewList.emit();
    }
}
