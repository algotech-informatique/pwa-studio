import { UserDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { OptionsObjectDto } from '../../../dtos';
import { SecurityGroup } from '../dto/security-group.dto';
import * as _ from 'lodash';
import { DialogMessageService } from '../../../services';

@Injectable()
export class SecurityGroupService {

    constructor(
        private dialogMessage: DialogMessageService,
    ) {}

    createOptionsUsers(users: UserDto[], group: SecurityGroup): OptionsObjectDto[] {
        const options: OptionsObjectDto[] = _.map(users, (usr: UserDto) => {
            const opt: OptionsObjectDto = {
                title: usr.username,
                mainLine: `${usr.firstName} ${usr.lastName}`,
                uuid: usr.uuid,
                statusIcon: {
                    color: '#A5A5A5',
                    icon: 'fa-solid fa-circle-check',
                    status: false,
                }
            };
            this._checkStatus(opt, usr, group);
            return opt;
        });
        return options;
    }

    _checkStatus(data: OptionsObjectDto, usr: UserDto, group: SecurityGroup) {
        const index = _.findIndex(group.members, (mb: UserDto) => mb.uuid === usr.uuid);
        if (index !== -1) {
            data.statusIcon.status = true;
            data.statusIcon.color = '#27AE60';
        } else {
            data.statusIcon.color = '#A5A5A5';
            data.statusIcon.status = false;
        }
    }

    activateOptionList(data: OptionsObjectDto) {
        data.statusIcon.status = (data.statusIcon.status) ? false : true;
        data.statusIcon.color = (data.statusIcon.status) ? '#27AE60' : '#A5A5A5';
    }

    extractData(groups: SecurityGroup[]) {
        if (groups.length === 0) {
            return false;
        }

        let str = '';
        const groupKey = ['key', 'name', 'description'];
        str += groupKey.join(';')  + '\r\n';

        const lines = [];
        _.forEach(groups, (grp: SecurityGroup) => {
            const line = _.map(groupKey, (key) => {
                return grp.group[key];
            });
            lines.push(line.join(';'));
            lines.push(...this.loadMembers(grp.members));
        });
        str += lines.join('\r\n');
        this.dialogMessage.getSaveMessage(
            str,
            'text/csv',
            'export_groups_rights.csv'
        );
    }

    loadMembers(users: UserDto[]): string[] {
        if (users.length === 0) {
            return [];
        }

        const userKey = [' ', ' ', ' ', 'login', 'firstName', 'lastName', 'email', 'authorized_applications'];
        const lines = _.map(users, (user: UserDto) => {
            const line = _.map(userKey, (key) => {
                if (key === 'login') {
                    return user.username;
                }
                return (user[key]) ? user[key] : '';
            });
            return line.join(';');
        });
        lines.unshift(userKey.join(';'));
        return lines;
    }
}
