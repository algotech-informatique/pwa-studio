import { SN_BASE_METADATA } from '../../../smart-nodes/components';

export const SN_TASK_METADATA = {
    selector: 'sn-node-task',
    template: `
    ${SN_BASE_METADATA.template}
    <sn-profile-node *ngIf="snView.options.profiles && snView.options.profiles.length > 0"
        [profil]="node.custom.profile"
        [profiles]="profiles"
        [node]="node"
        [snView]="snView"
        (profileChanged)="onProfileChanged($event)"
    >
    </sn-profile-node>
    `
};
