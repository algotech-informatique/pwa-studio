import { GroupDto, WorkflowProfilModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SessionsService } from '../../../../../../../../services';
import { ListItem } from '../../../../../../dto/list-item.dto';
import * as _ from 'lodash';
import { EventWorkflowPairDto, EventWorkflowPairProfileDto } from '../../../../../../dto/event-workflow-pair.dto';

@Component({
    selector: 'event-profiles',
    templateUrl: './event-profiles.component.html',
    styleUrls: ['./event-profiles.component.scss'],
})
export class EventProfilesComponent implements OnChanges {

    @Input() pair: EventWorkflowPairDto[];
    @Input() eventProfiles: WorkflowProfilModelDto[];
    @Output() profilesChanged = new EventEmitter<EventWorkflowPairDto[]>();
    listsGroups: ListItem[];

    constructor(
        private sessionsService: SessionsService,
    ) { }

    ngOnChanges() {
        this.listsGroups = _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) =>
            ({
                key: group.key,
                value: group.name,
                icon: 'fa-solid fa-users',
            }) as ListItem
        );
    }

    onSelectProfiles(profiles: string[], indexPair: number, indexProfile: number) {
        this.pair[indexPair].profiles[indexProfile].groups = profiles;
        this.profilesChanged.emit(this.pair);
    }

    addProfilePair() {
        this.pair.push({
            profiles: _.map(this.eventProfiles, (eventProfile: WorkflowProfilModelDto) =>
                ({
                    uuid: eventProfile.uuid,
                    groups: [],
                }) as EventWorkflowPairProfileDto
            ),
        });
        this.listsGroups.push(
            _.map(this.eventProfiles, () =>
                _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) =>
                    ({
                        key: group.key,
                        value: group.name,
                        icon: 'fa-solid fa-users',
                        selected: false,
                    }) as ListItem
                )
            )
        );
        this.profilesChanged.emit(this.pair);
    }

    removeProfile(indexPair: number) {
        this.pair.splice(indexPair, 1);
        this.listsGroups.splice(indexPair, 1);
        this.profilesChanged.emit(this.pair);
    }

}
