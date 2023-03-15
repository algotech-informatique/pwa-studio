import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnAlertNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getAlerts('success'), 'alertType');
        super.initialize(schema);
    }
}
