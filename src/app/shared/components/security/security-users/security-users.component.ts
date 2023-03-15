import { AuthService, CustomersService, GroupsService, UsersService } from '@algotech/angular';
import { CustomerDto, GroupDto, UserDto } from '@algotech/core';
import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DialogMessageService, SessionsService, ToastService } from '../../../services';
import * as _ from 'lodash';
import { of, zip } from 'rxjs';
import { AlertMessageDto } from '../../../dtos';
import { catchError, flatMap, map } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { SecurityUserService } from '../services/security-user.service';

@Component({
    selector: 'app-security-users',
    templateUrl: './security-users.component.html',
    styleUrls: ['./security-users.component.scss'],
})
export class SecurityUsersComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    _securityUsers: UserDto[] = [];
    selectedUuid = '';
    search = '';
    selectedUser: UserDto;
    activeSelected = true;

    favLang: string;
    userSAdmin = false;
    groups: GroupDto[];
    generatePassword = false;
    isNewUser = false;
    isCurrentUser = false;

    set securityUsers(value: UserDto[]) {
        this._securityUsers = value;
        this.sessionService.active.datas.read.users = value;
    }

    get securityUsers(): UserDto[] {
        return this._securityUsers;
    }

    constructor(
        private userService: UsersService,
        private readonly groupsService: GroupsService,
        private readonly customersService: CustomersService,
        private authService: AuthService,
        private dialogMessageService: DialogMessageService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private sessionService: SessionsService,
        private securityUserService: SecurityUserService,
    ) { }

    ngOnChanges() {
        this.userSAdmin = this.authService.localProfil.groups.indexOf('sadmin') > -1;
        zip(
            this.userService.list(),
            this.groupsService.list(),
            this.customersService.getByCustomerKey(),
        ).subscribe(([users, groups, customer]: [UserDto[], GroupDto[], CustomerDto]) => {
            if (!this.userSAdmin) {
                _.remove(groups, { key: 'sadmin' });
            }
            this.groups = groups;

            this.securityUsers = _.reduce(users, (results: UserDto[], user: UserDto) => {
                if (!this.userSAdmin) {
                    if (user.groups.indexOf('sadmin') === -1) {
                        if (user.groups?.length) {
                            user.groups = _.reduce(user.groups, (res: string[], key: string) => {
                                if (_.some(this.groups, { key })) {
                                    res.push(key);
                                }
                                return res;
                            }, []);
                        }
                        results.push(user);
                    }
                } else {
                    if (user.groups?.length) {
                        user.groups = _.reduce(user.groups, (res: string[], key: string) => {
                            if (_.some(this.groups, { key })) {
                                res.push(key);
                            }
                            return res;
                        }, []);
                    }
                    results.push(user);
                }
                return results;
            }, []);
            this.securityUsers = _.reverse(this.securityUsers);
            this.favLang = customer.languages[0].lang;
        }, (err) => console.error(err));
    }

    onSelectedUser(user: UserDto) {
        this.isNewUser = false;
        this.selectedUser = user;
        this.selectedUuid = (user) ? this.selectedUser.uuid : '';
        this.activeSelected = (user) ? user.enabled as boolean : true;
        this.isCurrentUser = this.selectedUser?.username === this.authService.localProfil?.login;
    }

    onCreateNewUser() {
        const newUser: UserDto = this.securityUserService.createEmptyUser(this.favLang);
        this.onSelectedUser(newUser);
        this.isNewUser = true;
    }

    onUpdateUser(data: { user: UserDto; userPatch: any}) {
        this.userService.patch(data.user.uuid, data.userPatch).pipe(
            map((res) => ({ user: res, err: '' })),
            catchError((err: HttpErrorResponse) => {
                console.error(err);
                return of({
                    user: null,
                    err: this.translateService.instant('SETTINGS.SECURITY.USERS.UPDATE-ERROR')
                });
            }),
        ).subscribe((result: { user: UserDto; err: string }) => {
            if (result.user) {
                this._updateUserList(result.user, 'update');
            } else {
                this.toastService.addToast('error', '', result.err, 2000);
            }
        }, (err) => console.error(err));
    }

    onAddUser(data: UserDto) {
        const newUser: UserDto = this.securityUserService.createNewUser(data, this.favLang);
        this.userService.post(newUser)
            .pipe(
                map((res) => ({ user: res, err: '' })),
                catchError((err: HttpErrorResponse) =>
                    of({
                        user: null,
                        err: err.error?.message && err.error.message[0]?.value?.message === 'login already exist' ?
                            this.translateService.instant('SETTINGS.SECURITY.USERS.ADD.ALREADY_EXISTS',
                                { login: newUser.username }) :
                            this.translateService.instant('SETTINGS.SECURITY.USERS.APPS.NOTENOUGHT.LIC'),
                    })
                ),
            ).subscribe((result: { user: UserDto; err: string }) => {
                if (result.user) {
                    this.securityUsers.unshift(result.user);
                    this.onSelectedUser(result.user);
                    const login = result.user.email;
                    // return this.authService.resetPassword(login).subscribe();
                } else {
                    this.toastService.addToast('error', '', result.err, 2000);
                }
        }, (err) => console.error(err));
    }

    _updateUserList(updateUser: UserDto, option: 'delete' | 'update') {
        const users = this.securityUsers;
        const usrIndex = _.findIndex(users, (usr: UserDto) => usr.uuid === updateUser.uuid);
        if (usrIndex !== -1) {
            if (option === 'delete') {
                users.splice(usrIndex, 1);
                this.onSelectedUser(null);
            } else {
                users[usrIndex] = updateUser;
                this.onSelectedUser(updateUser);
            }
            this.securityUsers = _.cloneDeep(users);
        }
    }

    onChangePassword() {
        this.generatePassword = true;
    }

    onCloseGeneratePassword() {
        this.generatePassword = false;
    }

    onRemoveUser(data: UserDto) {
        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.SECURITY.USERS.DELETE_ONE_CONFIRM', { email: data.username }),
            title: this.translateService.instant('SETTINGS.SECURITY.USERS.DELETE_ONE'),
            type: 'question',
            messageButton: true,
        };
        this.dialogMessageService.getMessageConfirm(alertMessage).pipe(
            flatMap((result: boolean) => (result) ? this.userService.delete(data.uuid) : of(null)),
        ).subscribe((res) => {
            if (res) {
                this._updateUserList(data, 'delete');
            }
        }, (err) => console.error(err));
    }
}
