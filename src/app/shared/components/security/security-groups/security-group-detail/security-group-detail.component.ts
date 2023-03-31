import { UserDto, ATGroupUtils } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { OptionsObjectDto } from '../../../../dtos';
import { ToastService } from '../../../../services';
import { SecurityGroup } from '../../dto/security-group.dto';
import { SecurityGroupService } from '../../services/security-group.service';

@Component({
    selector: 'security-group-detail',
    templateUrl: './security-group-detail.component.html',
    styleUrls: ['./security-group-detail.component.scss'],
})
export class SecurityGroupDetailComponent implements OnChanges {

    @Input() groups: SecurityGroup[] = [];
    @Input() group: SecurityGroup;
    @Input() users: UserDto[];

    @Output() updateGroup = new EventEmitter<{create: boolean, group: SecurityGroup }>();
    @Output() removeGroup = new EventEmitter<SecurityGroup>();
    @Output() updateUser = new  EventEmitter();
    @Output() searchChange = new EventEmitter();

    get search() {
        return this._search;
    }
    set search(data) {
        this._search = data;
        this.searchChange.emit(data);
    }
    _search = '';

    optionUsersFiltered: OptionsObjectDto[] = [];
    userOption: OptionsObjectDto[] = [];
    groupCanBeEdited = false;

    constructor(
        private securityGroupService: SecurityGroupService,
        private translateService: TranslateService,
        private toastService: ToastService,
    ) { }

    ngOnChanges() {
        this.userOption = this.securityGroupService.createOptionsUsers(this.users, this.group);
        this.groupCanBeEdited = !ATGroupUtils.isDefault(this.group.group);
        this._filterList(this.search);
    }

    updateName(data) {
        let create = false;
        if (this._validateKey(data)) {
            const grp: SecurityGroup = _.cloneDeep(this.group);
            grp.group.name = data;
            if (grp.group.key === 'new-group') {
                grp.group.key = data;
                create = true;
            }
            this.updateGroup.emit({create, group: grp });
        } else {
            this.toastService.addToast('error', this.translateService.instant('SETTINGS.SECURITY.GROUPS.ADD_ERROR_KEY'), null, 2000);
        }

    }

    updateDescription(data) {
        const grp: SecurityGroup = _.cloneDeep(this.group);
        grp.group.description = data;
        this.updateGroup.emit({create: false, group: grp });
    }

    onDeleteGroup() {
        this.removeGroup.emit(this.group);
    }

    onSelectedObject(data) {
        this.securityGroupService.activateOptionList(data);
        this.updateUser.emit(data);
    }

    onSearch(data) {
        this._filterList(data);
    }

    _filterList(filter: string) {

        this.optionUsersFiltered = _.reduce(this.userOption, (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

    _validateKey(value: string): boolean {

        const find: SecurityGroup[] = _.filter(this.groups, (grp: SecurityGroup) =>
            (grp.group.key.toUpperCase() === value.toUpperCase() || grp.group.name.toUpperCase() === value.toUpperCase())
            && grp.group.uuid !== this.group.group.uuid );
        return (find.length === 0);
    }
}
