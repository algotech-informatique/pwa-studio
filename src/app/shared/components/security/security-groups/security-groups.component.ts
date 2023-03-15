import { AuthService, GroupsService, UsersService } from '@algotech/angular';
import { GroupDto, UserDto } from '@algotech/core';
import { Component, Input, OnChanges } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { Observable, of, zip } from 'rxjs';
import * as _ from 'lodash';
import { flatMap, map } from 'rxjs/operators';
import { SecurityGroup } from '../dto/security-group.dto';
import { DialogMessageService, SessionsService, ToastService } from '../../../services';
import { AlertMessageDto, OptionsObjectDto } from '../../../dtos';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-security-groups',
    templateUrl: './security-groups.component.html',
    styleUrls: ['./security-groups.component.scss'],
})
export class SecurityGroupsComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    _securityGroups: SecurityGroup[] = [];
    _securityUsers: UserDto[] = [];
    selectedUuid = '';
    search = '';
    selectedGroup: SecurityGroup;
    superGroups: string[];
    userSAdmin = false;
    sadminGroup: GroupDto;

    set securityGroups(value: SecurityGroup[]) {
        this._securityGroups = value;
        this.sessionService.active.datas.read.groups = _.map(value, (val: SecurityGroup) => val.group);
        if (!this.userSAdmin) {
            this.sessionService.active.datas.read.groups.unshift(_.cloneDeep(this.sadminGroup));
        }
    }

    get securityGroups(): SecurityGroup[] {
        return this._securityGroups;
    }

    set securityUsers(value: UserDto[]) {
        this._securityUsers = value;
        this.sessionService.active.datas.read.users = value;
    }

    get securityUsers(): UserDto[] {
        return this._securityUsers;
    }

    constructor(
        private groupService: GroupsService,
        private userService: UsersService,
        private authService: AuthService,
        private dialogMessageService: DialogMessageService,
        private translateService: TranslateService,
        private toastService: ToastService,
        private sessionService: SessionsService,
    ) {
        this.superGroups = ['viewer', 'process-manager', 'plan-editor', 'admin', 'sadmin'];
    }

    ngOnChanges() {
        this.userSAdmin = this.authService.localProfil.groups.indexOf('sadmin') > -1;
        zip(
            this.userService.list(),
            this.groupService.list(),
        ).subscribe(([users, groups]: [UserDto[], GroupDto[]]) => {
            _.map(this.superGroups, (superGroup) => {
                const indexSuperGroup = _.findIndex(groups, (group) => group.key === superGroup);
                if (indexSuperGroup > -1) {
                    const temp = groups[indexSuperGroup];
                    groups.splice(indexSuperGroup, 1);
                    groups.unshift(temp);
                }
            });
            if (!this.userSAdmin) {
                this.sadminGroup = _.find(groups, { key: 'sadmin' });
                _.remove(groups, { key: 'sadmin' });
            }

            this.securityUsers = users;
            this.securityGroups = _.reverse(_.map(groups, (grp: GroupDto) => {
                const gr: SecurityGroup = {
                    group: grp,
                    members: _.reduce(users, (result, usr: UserDto) => {
                        if (usr.groups.find((g) => g === grp.key)) {
                            result.push(usr);
                        }
                        return result;
                    }, [])
                };
                return gr;
            }));
        }, (err) => console.error(err));
    }

    onSelectedGroup(group: SecurityGroup) {
        this.selectedGroup = group;
        this.selectedUuid = this.selectedGroup.group.uuid;
    }

    onCreateNewGroup() {

        const newGroup: SecurityGroup = this._createGroup();
        if (_.find(this.securityGroups, (grp: SecurityGroup) => grp.group.key === newGroup.group.key )) {
            this.toastService.addToast('error', this.translateService.instant('SETTINGS.SECURITY.GROUPS.ADD_ERROR_KEY'), null, 2000);
        } else {
            this.securityGroups.unshift(newGroup);
            this.selectedGroup = newGroup;
            this.selectedUuid = this.selectedGroup.group.uuid;
        }
    }

    onUpdateGroup(data: {create: boolean, group: SecurityGroup}) {

        const obs$: Observable<GroupDto> = (data.create) ?
            this.groupService.post(data.group.group) : this.groupService.put(data.group.group);

        obs$.subscribe((grp: GroupDto) => {
            const grps: SecurityGroup = {
                group: grp,
                members: [],
            };

            const findIndex = (data.create) ?
                _.findIndex(this.securityGroups, (gp: SecurityGroup) => gp.group.key === 'new-group') :
                _.findIndex(this.securityGroups, (gp: SecurityGroup) => gp.group.uuid === grp.uuid );

            if (findIndex !== -1) {
                (grps as any).members = this.securityGroups[findIndex].members;
                const groups = this.securityGroups;
                groups[findIndex] =  grps;
                this.securityGroups = _.cloneDeep(groups);
                this.selectedGroup = grps;
                this.selectedUuid = this.selectedGroup.group.uuid;
            }
        }, (err) => {
            console.error(err);
            this.toastService.addToast('error', this.translateService.instant('SETTINGS.SECURITY.GROUPS.ADD_ERROR_KEY'), null, 2000);
        });
    }

    onUpdateUser(user: OptionsObjectDto) {
        const fIndex = _.findIndex(this.securityUsers, (usr: UserDto) => usr.uuid === user.uuid);
        if (fIndex !== -1) {
            const usr: UserDto = this.securityUsers[fIndex];
            if (user.statusIcon.status) {
                this._addMember(usr);
            } else {
                this._removeMember(usr);
            }
        }
    }

    onRemoveGroup(data: SecurityGroup) {

        const alertMessage: AlertMessageDto = {
            confirm: this.translateService.instant('DIALOGBOX.DELETE'),
            cancel: this.translateService.instant('DIALOGBOX.CANCEL'),
            message: this.translateService.instant('SETTINGS.SECURITY.GROUPS.DELETE_CONFIRM', {name: data.group.name }),
            title: this.translateService.instant('SETTINGS.SECURITY.GROUPS.DELETE'),
            type: 'question',
            messageButton: true,
        };
        this.dialogMessageService.getMessageConfirm(alertMessage).pipe(
            flatMap((result: boolean) => {
                return (result) ? this.groupService.delete(data.group.uuid) : of(null);
            }),
            map((isdeleted) => {
                if (isdeleted) {
                    _.forEach(data.members, (member: UserDto) => {
                        member.groups = _.pull(member.groups, data.group.key);
                        this.userService
                            .patch(member.uuid, { groups: member.groups })
                            .subscribe();
                    });
                }
                return isdeleted;
            }),
        ).subscribe((res) => {
            if (res) {
                const grIndex: number = _.findIndex(this.securityGroups, (grp: SecurityGroup) => grp.group.uuid === data.group.uuid);
                if (grIndex !== -1) {
                    const groups = this.securityGroups;
                    groups.splice(grIndex, 1);
                    this.securityGroups = _.cloneDeep(groups);
                    this.selectedGroup = null;
                    this.selectedUuid = '';
                }
            }
        }, (err) => console.error(err));
    }

    _createGroup(): SecurityGroup {
        const newGroup: GroupDto = {
            key: 'new-group',
            description: '',
            name: '',
            uuid: UUID.UUID(),
            application: {
                authorized: [],
                default: {
                    web: '',
                    mobile: '',
                },
            },
        };
        return {
            group: newGroup,
            members: [],
        };
    }

    _addMember(user: UserDto) {
        const grIndex: number = _.indexOf(user.groups, this.selectedGroup.group.key);
        if (grIndex === -1) {
            user.groups.push(this.selectedGroup.group.key);
            this.userService.patch(user.uuid, { groups: user.groups }).pipe(
                map((res: UserDto) => {
                    if (res) {
                        this.selectedGroup.members.push(user);
                        this._updateGroups(this.selectedGroup);
                    }
                }),
            ).subscribe();
        }
    }

    _removeMember(user: UserDto) {
        const grIndex: number = _.indexOf(user.groups, this.selectedGroup.group.key);
        if (grIndex > -1) {
            user.groups.splice(grIndex, 1);
            this.userService.patch(user.uuid, { groups: user.groups }).pipe(
                map((res: UserDto) => {
                    if (res) {
                        this.selectedGroup.members = _.reject(this.selectedGroup.members, {uuid: res.uuid});
                        this._updateGroups(this.selectedGroup);
                    }
                }),
            ).subscribe();
        }
    }

    _updateGroups(data: SecurityGroup) {
        const grIndex: number = _.findIndex(this.securityGroups, (grp: SecurityGroup) => grp.group.uuid === data.group.uuid);
        if (grIndex !== -1) {
            const groups = this.securityGroups;
            groups[grIndex] = data;
            this.securityGroups = _.cloneDeep(groups);
        }
    }
}
