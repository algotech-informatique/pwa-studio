import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnUtilsService } from '../../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnConditionNodeComponent extends SnTaskNodeComponent {

    constructor(protected snActions: SnActionsService, protected snATNodeUtils: SnATNodeUtilsService,
        protected snUtils: SnUtilsService,
        protected ref: ChangeDetectorRef) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getConditions(), 'condition');
        super.initialize(schema);
    }

    calculate() {
        const type = this.snATNodeUtils.findType(this.snView, this.node, 'conditionAValue');

        const sectionValue = this.node.sections.find((s) => s.key === 'value');
        if (!sectionValue) {
            return;
        }

        const paramB = sectionValue.params.find((p) => p.key === 'conditionBValue');
        if (!paramB) {
            return;
        }

        this.snActions.editParam(this.snView, this.node, paramB, sectionValue.params, 'types', type ? type : 'string');
        super.calculate();
    }

}
