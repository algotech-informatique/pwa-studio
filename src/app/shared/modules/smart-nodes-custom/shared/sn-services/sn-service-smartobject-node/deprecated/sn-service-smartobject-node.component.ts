import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../../smart-nodes/dto';
import { SnATNodeComponent } from '../../../sn-at-node/sn-at-node.component';
import { SN_BASE_METADATA } from '../../../../../smart-nodes/components';
import { TranslateService } from '@ngx-translate/core';
import { SnATNodeUtilsService } from '../../../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService } from '../../../../../smart-nodes/services';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnServiceSmartObjectNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translate: TranslateService) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.loadModels('modelKey');
        this.load([{
            key: '1',
            value: this.translate.instant('SN-ORDER-ASC')
        }, {
            key: '-1',
            value: this.translate.instant('SN-ORDER-DESC')
        }], 'orderDirection');
        super.initialize(schema);
    }

    calculate() {
        this.loadProperties('modelKey', 'filterProperty', 'model');
        this.loadProperties('modelKey', 'orderProperty', 'model');
        this.calculateTypeWithModel('modelKey');
        super.calculate();
    }
}
