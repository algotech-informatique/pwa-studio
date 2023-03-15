import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnObjectFilterNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        super.initialize(schema);
    }

    calculate() {
        this.loadProperties('smartModel', 'filterProperty', 'model');
        this.calculateTypeWithParam('objects');
        super.calculate();
    }
}
