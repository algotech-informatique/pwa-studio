import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../../smart-nodes';
import { SnActionsService } from '../../../../smart-nodes/services';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../../../shared/sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnMergeNodeComponent extends SnATNodeComponent {

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
        this.loadProperties('smartModel', 'propType', 'model');
        this.calculateTypeWithModel();
        super.calculate();
    }
}
