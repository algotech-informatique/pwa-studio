import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnObjectDownloadNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        this.calculateTypeWithParam('objects');

        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const first = this.snATNodeUtils.findValue(this.node, 'first') ? true : false;

        if (outParam) {
            this.snActions.editParam(this.snView, this.node, outParam.param, outParam.params, 'multiple', !first);
        }
        super.calculate();
    }
}
