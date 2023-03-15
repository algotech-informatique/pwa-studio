import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { SmartPermissionsDto, GroupDto } from '@algotech/core';
import { SessionsService } from '../../../../services';
import * as _ from 'lodash';

interface PermissionDisplay {
    key: string;
    name: string;
    R: boolean;
    W: boolean;
}

@Component({
    selector: 'permissions',
    templateUrl: './permissions.component.html',
    styleUrls: ['./permissions.component.scss'],
})
export class PermissionsComponent implements OnChanges {
    @Input() custom;
    @Input() permissions: SmartPermissionsDto;

    @Output()
    changed = new EventEmitter();

    @Output()
    applyAll = new EventEmitter();

    permissionsDisplay: PermissionDisplay[] = [];

    constructor(public sessionsService: SessionsService) { }

    ngOnChanges(changes: SimpleChanges) {
        // check difference
        if (!changes.custom) {
            return;
        }

        const permissionsDisplay = _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) => {
            return {
                key: group.key,
                name: group.name,
                R: this.permissions.R.includes(group.key) || this.permissions.RW.includes(group.key),
                W: this.permissions.RW.includes(group.key),
            };
        });

        permissionsDisplay.unshift({
            key: '',
            name: '',
            R: false,
            W: false,
        });

        this.permissionsDisplay = permissionsDisplay;
        this.buildResult();
        this.refreshToggleAll();
    }

    toggleAll(type: 'R' | 'W', state: boolean) {
        for (const permission of this.permissionsDisplay) {
            permission[type] = state;
        }
        if (type === 'R' && !state) {
            this.toggleAll('W', false);
        }
        if (type === 'W' && state) {
            this.toggleAll('R', true);
        }
    }

    refreshToggleAll() {
        if (this.permissionsDisplay.length === 0) {
            return ;
        }
        this.permissionsDisplay[0].R = _.uniq([...this.permissions.R, ...this.permissions.RW]).length ===
            this.sessionsService.active.datas.read.groups.length;

        this.permissionsDisplay[0].W = this.permissions.RW.length === this.sessionsService.active.datas.read.groups.length;
    }

    onApplyAll() {
        this.applyAll.emit(this.permissions);
    }

    onChangePermission(permission: PermissionDisplay, type: 'R' | 'W') {
        permission[type] = !permission[type];

        if (permission.key === '') {
            this.toggleAll(type, permission[type]);
            this.notify();
            return;
        }

        if (type === 'R' && permission.W) {
            permission.W = false;
        }

        if (type === 'W' && permission[type]) {
            permission.R = true;
        }

        this.notify();
        this.refreshToggleAll();
    }

    notify() {
        this.buildResult();
        this.changed.emit(this.permissions);
    }

    buildResult() {
        this.permissions = {
            R: _.reduce(this.permissionsDisplay, (results, p: PermissionDisplay) => {
                if (p.R && !p.W && p.key) {
                    results.push(p.key);
                }
                return results;
            }, []),
            RW: _.reduce(this.permissionsDisplay, (results, p: PermissionDisplay) => {
                if (p.W && p.key) {
                    results.push(p.key);
                }
                return results;
            }, []),
        };
    }
}
