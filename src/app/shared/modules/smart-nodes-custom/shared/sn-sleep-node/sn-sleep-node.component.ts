import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnSleepNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        const due = this.node.params.find((p) => p.key === 'due');
        if (+due?.value > 60000) {
            due.value = 60000;
        }
    }
}
