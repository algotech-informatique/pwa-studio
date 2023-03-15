import { Component, ChangeDetectorRef } from '@angular/core';
import { SnActionsService } from '../../../../smart-nodes/services';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnLoopNodeComponent extends SnTaskNodeComponent {

    defaultType = ['string', 'number', 'date', 'time', 'object',  'datetime', 'boolean', 'so:', 'sys:'];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        super.initialize(schema);
    }

    calculate() {
        this.recalculateType();
        super.calculate();

        const forEachMode = this.node.params.find((p) => p.key === 'forEach');
        const count = this.node.params.find((p) => p.key === 'count');
        const items = this.node.params.find((p) => p.key === 'items');

        if (!forEachMode || !count || !items) {
            return ;
        }

        if (count.displayState.hidden === forEachMode.value) {
            return ;
        }

        items.displayState.hidden = !forEachMode.value;
        count.displayState.hidden = forEachMode.value;
        this.snActions.notifyHide(this.snView);
        super.calculate();
    }

    private recalculateType() {
        const forEachMode = this.node.params.find((p) => p.key === 'forEach');

        const type = (forEachMode.value) ?
            this.snATNodeUtils.findType(this.snView, this.node, 'items') ?
                this.snATNodeUtils.findType(this.snView, this.node, 'items') :
                ['string', 'number', 'date', 'time', 'object',  'datetime', 'boolean', 'so:', 'sys:']
            : 'number';

        const flowOut = _.find(this.node.flows, { key: 'next' });
        if (!flowOut || flowOut.params.length === 0 ) { return; }
        this.snActions.editParam(this.snView, this.node, flowOut.params[0], flowOut.params, 'types', type);
    }

}
