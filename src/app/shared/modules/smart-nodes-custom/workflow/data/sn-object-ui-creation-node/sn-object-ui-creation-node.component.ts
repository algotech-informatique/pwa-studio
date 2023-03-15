import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnObjectUICreationNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getSkills(), 'skills');
        super.initialize(schema);
    }

    calculate() {
        // update type
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const skills = this.snATNodeUtils.findValue(this.node, 'skills');

        if (outParam && skills) {
            this.snActions.editParam(this.snView, this.node, outParam.param, outParam.params, 'types', `sk:${skills}`);
        }
        super.calculate();
    }
}
