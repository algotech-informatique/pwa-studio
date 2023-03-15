import { GroupDto, UserDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';
import * as _ from 'lodash';
import { ToastService } from '../../../../services';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'security-user-detail',
    templateUrl: './security-user-detail.component.html',
    styleUrls: ['./security-user-detail.component.scss'],
})
export class SecurityUserDetailComponent implements OnChanges {

    @Input() user: UserDto;
    @Input() groups: GroupDto[];
    @Input() isSuperAdmin: boolean;
    @Input() isNewUser: boolean;
    @Input() isCurrentUser: boolean;
    
    @Output() updateUser = new EventEmitter<{ user: UserDto; userPatch: any}>();
    @Output() removeUser = new EventEmitter<UserDto>();
    @Output() changePassword = new EventEmitter();
    @Output() addUser = new EventEmitter<UserDto>();

    formatedGroups: OptionsElementDto[];
    inputList: OptionsElementDto[];
    items: OptionsElementDto[];

    constructor(
        private toastService: ToastService,
        private translateService: TranslateService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.groups?.currentValue) {
            this.formatedGroups = _.map(this.groups, (group: GroupDto) =>
                ({ key: group.key, value: group.name }) as OptionsElementDto
            );
        }
        this.items = _.map(this.user.groups, (gr: string) => _.find(this.formatedGroups, { key: gr }));
        this.inputList = _.filter(this.formatedGroups, (fg: OptionsElementDto) => !this.user.groups.includes(fg.key));
    }

    activeUser() {
        this.user.enabled = !this.user.enabled;
        if (!this.isNewUser) {
            this.updateUser.emit({user: this.user, userPatch: {enabled: this.user.enabled } });
        }
    }

    updateLogin(data) {
        if (!this._validateEmail(data)) {
            this.toastService.addToast('error', this.translateService.instant('SETTINGS.SECURITY.USERS.ADD_ERROR_KEY'), null, 2000);
            return;
        }
        this.user.username = data;
    }

    updateFirstName(data) {
        this.user.firstName = data;
        if (!this.isNewUser) {
            this.updateUser.emit({user: this.user, userPatch: {firstName: data } });
        }
    }

    updateLastName(data) {
        this.user.lastName = data;
        if (!this.isNewUser) {
            this.updateUser.emit({user: this.user, userPatch: {lastName: data } });
        }
    }

    onChangeUserGroups(data) {
        this.user.groups = _.map(data, (gr: OptionsElementDto) => gr.key);
        if (!this.isNewUser) {
            this.updateUser.emit({user: this.user, userPatch: {groups: this.user.groups } });
        }
    }

    onDeleteUser() {
        this.removeUser.emit(this.user);
    }

    onChangePassword() {
        this.changePassword.emit();
    }

    onAddUser() {
        if (this.user.firstName && this.user.lastName && this.user.username) {
            this.addUser.emit(this.user);
        }
    }

    _validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

}
