import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_TASK_METADATA } from './sn-task-node.metadata';
import { SnActionsService } from '../../../smart-nodes/services';
import { PairDto } from '@algotech/core';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnTaskNodeComponent extends SnATNodeComponent {

    profiles: PairDto[] = [];
    constructor(protected snActions: SnActionsService, protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.updateProfiles();
        super.initialize(schema);

        // set profile of previous task
        if (this.node.custom && this.node.custom.profile) {
            return ;
        }
        const previousNode = this.snATNodeUtils.getPreviousNode(this.snView, this.node);
        if (previousNode && previousNode.custom && previousNode.custom.profile) {
            this.onProfileChanged(previousNode.custom.profile);
        }
    }

    calculate() {
        this.updateProfiles();
        super.calculate();
    }

    updateProfiles() {
        this.profiles = this.snATNodeUtils.getProfiles(this.snView);
        if (this.node.custom.profile) {
            if (!this.profiles.find((p) => p.key === this.node.custom.profile)) {
                this.onProfileChanged(null);
            }
        }
    }

    onProfileChanged(value) {
        this.node.custom.profile = value;
        this.snActions.notifyNode('chg', this.snView, this.node);
    }

    protected loadProfiles(profilesKey = 'profiles') {
        this.load(this.snATNodeUtils.getProfiles(this.snView), profilesKey);
    }
}
