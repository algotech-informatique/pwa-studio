import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../../shared/sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam } from '../../../smart-nodes/models';
import { TranslateService } from '@ngx-translate/core';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnMergeV2NodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translateService: TranslateService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels();
        super.initialize(schema);
    }

    calculate() {

        this.node.flows[1].params[0].displayState.placeHolder = this.translateService.instant('SN-MERGE-ADD-OBJECTS');
        this.node.flows[1].params[1].displayState.placeHolder = this.translateService.instant('SN-MERGE-UPDATE-OBJECTS');

        this.loadProperties('smartModel', 'propType', 'model');
        this.loadProperties('smartModel', 'propToMerge', 'model');
        this.calculateMultipleTypeWithModel();
        super.calculate();
    }
}
