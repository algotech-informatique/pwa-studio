import { SnATNodeUtilsService } from './../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService } from './../../../../smart-nodes/services/view/sn-actions/sn-actions.service';
import { TranslateService } from '@ngx-translate/core';
import { ChangeDetectorRef, Component } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnNotificationNodeComponent extends SnTaskNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translate: TranslateService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load([{
            key: 'web',
            value: this.translate.instant('SN-NOTIFICATION-WEB'),
        }, {
            key: 'mobile',
            value: this.translate.instant('SN-NOTIFICATION-MOBILE'),
        }], 'channels');

        this.load([{
            key: 'profil',
            value: this.translate.instant('SN-NOTIFICATION-PROFIL'),
        }, {
            key: 'group',
            value: this.translate.instant('SN-NOTIFICATION-GROUP'),
        }, {
            key: 'user',
            value: this.translate.instant('SN-NOTIFICATION-USER'),
        }], 'destination');

        this.loadSecurityGroups('groups_viewer');

        super.initialize(schema);
    }

    calculate() {
        this.loadProfiles('profiles');
        this.loadProfiles('profiles_viewer');

        const destination = this.node.params.find((p) => p.key === 'destination')?.value;

        this.node.params.find((p) => p.key === 'profiles_viewer').displayState.hidden = destination !== 'profil';
        this.node.params.find((p) => p.key === 'groups_viewer').displayState.hidden = destination !== 'group';
        this.node.params.find((p) => p.key === 'users_viewer').displayState.hidden = destination !== 'user';

        super.calculate();
    }

}
