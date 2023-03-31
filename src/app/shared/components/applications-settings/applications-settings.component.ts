import { GroupsService } from '@algotech-ce/angular';
import { GroupDto } from '@algotech-ce/core';
import { Component, Input, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { zip } from 'rxjs';
import { SessionsService } from '../../services';

@Component({
    selector: 'app-applications-settings',
    templateUrl: './applications-settings.component.html',
    styleUrls: ['./applications-settings.component.scss'],
})
export class ApplicationsSettingsComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    groups: GroupDto[];
    selectedUuid: string;
    selectedGroup: GroupDto | undefined;
    search: string;

    constructor(
        private groupsService: GroupsService,
        private sessionsService: SessionsService,
    ) { }

    ngOnChanges() {
        this.groupsService.list().subscribe({
            next: (groups: GroupDto[]) => {
                this.groups = _.orderBy(groups, 'name');
                this.restart();
            },
            error: (err) => console.error(err),
        });
    }

    onSelectedGroup(name: string) {
        this.selectList(name);
    }

    onUpdateGroup(group: GroupDto) {
        this.groupsService.put(group).subscribe({
            next: (groupUpdated: GroupDto) => {
                const index = this.sessionsService.active.datas.read.groups.findIndex((g) => g.key === group.key);
                if (index > -1) {
                    this.sessionsService.active.datas.read.groups[index] = groupUpdated;
                }
            },
            error: (err) => console.error(err),
        });
    }

    onUpdateAllGroups(groups: GroupDto[]) {
        const updateAll$ = groups.map((group) => this.groupsService.put(group));
        zip(...updateAll$).subscribe({
            next: (groupsUpdated: GroupDto[]) => {
                groupsUpdated.forEach((gu) => {
                    const index = this.sessionsService.active.datas.read.groups.findIndex((g) => g.key === gu.key);
                    if (index > -1) {
                        this.sessionsService.active.datas.read.groups[index] = gu;
                    }
                });
            },
            error: (err) => console.error(err),
        });
    }

    private restart() {
        this.selectedUuid = '';
        this.selectedGroup = undefined;
        this.search = '';
    }

    private selectList(uuid: string) {
        this.selectedUuid = uuid;
        this.selectedGroup = _.find(this.groups, { uuid });
    }

}
