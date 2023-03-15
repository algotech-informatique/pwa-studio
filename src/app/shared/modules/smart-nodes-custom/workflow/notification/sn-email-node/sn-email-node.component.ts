import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnEmailNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        this.loadProfiles();
        super.calculate();

        const directMode = this.node.params.find((p) => p.key === 'direct');
        const profiles = this.node.params.find((p) => p.key === 'profiles');
        const adress = this.node.params.find((p) => p.key === 'adress');
        if (!directMode || !profiles || !adress) {
            return ;
        }

        if (profiles.displayState.hidden === directMode.value) {
            return ;
        }

        profiles.displayState.hidden = directMode.value;
        adress.displayState.hidden = !directMode.value;
        this.snActions.notifyHide(this.snView);
        super.calculate();
    }
}
