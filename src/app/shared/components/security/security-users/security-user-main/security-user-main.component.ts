import { UserDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';
import * as _ from 'lodash';
import { SecurityUserService } from '../../services/security-user.service';

@Component({
    selector: 'security-user-main',
    templateUrl: './security-user-main.component.html',
    styleUrls: ['./security-user-main.component.scss'],
})
export class SecurityUserMainComponent implements OnChanges {

    @Input() users: UserDto[] = [];
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

    _activeSelected = true;
    @Input()
    get activeSelected() {
        return this._activeSelected;
    }
    @Output() activeSelectedChange = new EventEmitter();
    set activeSelected(data) {
        this._activeSelected = data;
        this.activeSelectedChange.emit(data);
    }

    @Output() selectedUser = new EventEmitter();
    @Output() createNewUser = new EventEmitter();

    optionActiveUser: OptionsObjectDto[] = [];
    optionInActiveUser: OptionsObjectDto[] = [];
    optionUserFiltered: OptionsObjectDto[] = [];

    constructor(
        private securityUserService: SecurityUserService,
    ) { }

    ngOnChanges() {
        this.loadList();
    }

    loadList() {
        this.optionActiveUser = this.securityUserService.getUser(this.users, true);
        this.optionInActiveUser = this.securityUserService.getUser(this.users, false);
        this._filterList(this.search);
    }

    onCreateNewUser() {
        this.createNewUser.emit();
    }

    onSelectedObject(data: OptionsObjectDto) {
        const index = _.findIndex(this.users, (usr: UserDto) => usr.uuid === data.uuid);
        if (index !== -1 ) {
            this.selectedUser.emit(this.users[index]);
        }
    }

    onSelectedOption(active: boolean) {
        this.activeSelected = active;
        this.search = '';
        this._filterList('');
    }

    onSearch(data) {
        this._filterList(data);
    }

    _filterList(filter: string) {

        this.optionUserFiltered = _.reduce((this.activeSelected) ? this.optionActiveUser : this.optionInActiveUser
            , (result, opt: OptionsObjectDto) => {
            if (opt.title.toUpperCase().includes(filter.toUpperCase()) || opt.mainLine.toUpperCase().includes(filter.toUpperCase())) {
                result.push(opt);
            }
            return result;
        }, []);
    }

}
