import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import * as _ from 'lodash';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnDocumentSelectNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        this.calculateMultiple('multiple');
        super.calculate();
    }
}
