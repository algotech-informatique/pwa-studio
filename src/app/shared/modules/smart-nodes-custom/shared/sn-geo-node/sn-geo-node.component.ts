import { Component, ChangeDetectorRef } from '@angular/core';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SN_BASE_METADATA } from '../../../smart-nodes/components';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnGeoNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getLayers(), 'layer');
        super.initialize(schema);
    }

    calculate() {
        super.calculate();
    }
}
