import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnScheduleAutoCreationNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getRepetitions(), 'repetitionMode');
        this.load(this.snATNodeUtils.getScheduleTypeKeys(), 'scheduleTypeKey');
        super.initialize(schema);
    }

    calculate() {
        this.loadProfiles();
        const scheduleTypeKey = this.snATNodeUtils.findValue(this.node, 'scheduleTypeKey');
        this.load(this.snATNodeUtils.getScheduleStatus(scheduleTypeKey), 'scheduleStatus');
        super.calculate();
    }
}
