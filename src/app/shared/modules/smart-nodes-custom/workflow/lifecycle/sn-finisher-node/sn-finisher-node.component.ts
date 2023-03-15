import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnFinisherNodeComponent extends SnTaskNodeComponent {

    hasDisplay = false;

    initialize(schema: SnNodeSchema) {
        this.hasDisplay = (schema.sections.some((s) => s.key === 'display'));
        if (this.hasDisplay) {
            this.load(this.snATNodeUtils.getAlerts(), 'type');
            this.load(this.snATNodeUtils.getDisplayModel(), 'displayMode');
            this.load(this.snATNodeUtils.getOutputTrigger(), 'outputTrigger');
        }
        super.initialize(schema);
    }

    calculate(): void {
        super.calculate();
        if (this.hasDisplay) {

            const mode = this.snATNodeUtils.findParamByKey(this.node, 'displayMode').value;

            this.snATNodeUtils.findParamByKey(this.node, 'timeout').displayState.hidden = mode === 'nothing';
            this.snATNodeUtils.findParamByKey(this.node, 'message').displayState.hidden = mode === 'nothing';
            this.snATNodeUtils.findParamByKey(this.node, 'type').displayState.hidden = mode !== 'popup';
        }
    }
}
