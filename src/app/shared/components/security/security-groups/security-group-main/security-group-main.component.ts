import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';
import { SecurityGroup } from '../../dto/security-group.dto';
import { SecurityGroupService } from '../../services/security-group.service';
import { ATGroupUtils } from '@algotech-ce/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'security-group-main',
    templateUrl: './security-group-main.component.html',
    styleUrls: ['./security-group-main.component.scss'],
})
export class SecurityGroupMainComponent implements OnChanges {

    @Input() groups: SecurityGroup[] = [];
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

    @Output() selectedGroup = new EventEmitter();
    @Output() createNewGroup = new EventEmitter();

    optionGroup: OptionsObjectDto[] = [];
    optionGroupFiltered: OptionsObjectDto[] = [];

    constructor(
        private securityGroupService: SecurityGroupService,
        private translateService: TranslateService,
    ) { }

    ngOnChanges() {
        this.loadList();
    }

    loadList() {
        this.optionGroup = _.map(this.groups, (securityGroup: SecurityGroup) => {
            const option: OptionsObjectDto = {
                title: securityGroup.group.name,
                mainLine: securityGroup.group.description,
                uuid: securityGroup.group.uuid,
            };
            if (ATGroupUtils.isDefault(securityGroup.group)) {
                option.detailIcon = 'fa-solid fa-shield-alt';
                option.detailLine = this.translateService.instant('SETTINGS.SECURITY.GROUPS.PROTECTED');
            }
            return option;
        });
        this._filterList(this.search);
    }

    onCreateNewGroup() {
        this.createNewGroup.emit();
    }

    onSelectedObject(data: OptionsObjectDto) {
        const index = _.findIndex(this.groups, (grp: SecurityGroup) => grp.group.uuid === data.uuid);
        if (index !== -1 ) {
            this.selectedGroup.emit(this.groups[index]);
        }
    }

    onSearch(data) {
        this._filterList(data);
    }

    onExtractRights() {
        this.securityGroupService.extractData(this.groups);
    }

    _filterList(filter: string) {

        this.optionGroupFiltered = _.reduce(this.optionGroup, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }
}
