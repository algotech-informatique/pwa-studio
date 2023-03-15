import { Component, ChangeDetectorRef } from '@angular/core';
import { SnFlow, SnNode, SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnResetNodeComponent extends SnATNodeComponent {

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
    }
}
