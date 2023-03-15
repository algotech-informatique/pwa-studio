import { Component, ChangeDetectorRef } from '@angular/core';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SN_BASE_METADATA } from '../../../smart-nodes/components';
import { TranslateService } from '@ngx-translate/core';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnMagnetNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translate: TranslateService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load([{
            key: 'automatic',
            value: this.translate.instant('SN-MAGNET-PLACEMENT-AUTO'),
        }, {
            key: 'manual',
            value: this.translate.instant('SN-MAGNET-PLACEMENT-MANUAL'),
        }], 'placement');
        this.load(this.snATNodeUtils.getApps(), 'application');
        super.initialize(schema);
    }

    calculate() {
        const placement = this.node.params.find((p) => p.key === 'placement');
        const app = this.node.params.find((p) => p.key === 'application');

        this.load(this.snATNodeUtils.getZone(app?.value), 'zone');
        this.node.sections[0].hidden = placement?.value === 'automatic';
        super.calculate();
    }
}
