import { GroupDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'applications-settings-main',
    templateUrl: './applications-settings-main.component.html',
    styleUrls: ['./applications-settings-main.component.scss'],
})
export class ApplicationsSettingsMainComponent implements OnChanges {

    @Input() groups: GroupDto[];
    @Input() selectedUuid: string;
    @Output() selectedGroup = new EventEmitter<string>();

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

    optionList:  OptionsObjectDto[] = [];
    optionListFiltered:  OptionsObjectDto[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes.groups?.currentValue) {
            this.loadList();
        }
    }

    loadList() {
        this.optionList = _.map(this.groups, (group: GroupDto) => {
            const option: OptionsObjectDto = {
                title: group.name,
                mainLine: group.description,
                uuid: group.uuid,
            };
            return option;
        });
        this.filterList(this.search);
    }

    onSelectedObject(data: OptionsObjectDto) {
        this.selectedGroup.emit(data.uuid);
    }

    onSearch(data: string) {
        this.filterList(data);
    }
    
    private filterList(filter: string) {
        this.optionListFiltered = _.reduce(this.optionList, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

}