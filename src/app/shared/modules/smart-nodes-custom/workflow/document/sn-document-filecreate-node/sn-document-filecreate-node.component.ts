import {
    ChangeDetectorRef,
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService } from '../../../../smart-nodes/services';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnDocumentFileCreateNodeComponent extends SnTaskNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        super.calculate();

        const properties = this.node.sections.find((s) => s.key === 'properties');
        const fileName = properties.params.find((p) => p.key === 'fileName');
        const fileExt = properties.params.find((p) => p.key === 'ext');

        const re = /(?:\.([^.]+))?$/;
        const ext = re.exec(fileName.value)[1] ? re.exec(fileName.value)[1] : 'txt';

        fileExt.displayState.hidden = true;
        fileExt.value = ext;
    }
}
