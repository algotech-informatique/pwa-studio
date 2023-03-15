import { TranslateLangDtoService } from '@algotech/angular';
import { TagListDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';

@Component({
    selector: 'tags-lists-main',
    templateUrl: './tags-lists-main.component.html',
    styleUrls: ['./tags-lists-main.component.scss'],
})
export class TagsListsMainComponent implements OnChanges {

    @Input() tagsLists: TagListDto[] = [];
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
    @Output() createNewTagsList = new EventEmitter();

    optionList: OptionsObjectDto[] = [];
    optionListFiltered: OptionsObjectDto[] = [];

    constructor(
        private translateService: TranslateLangDtoService,
    ) { }

    ngOnChanges() {
        this.loadList();
    }

    loadList() {
        this.optionList = _.map(this.tagsLists, (tagList: TagListDto) => {
            const option: OptionsObjectDto = {
                title: this.translateService.transform(tagList.displayName),
                mainLine: tagList.key,
                uuid: tagList.uuid as string,
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
        this.createNewTagsList.emit();
    }
}
