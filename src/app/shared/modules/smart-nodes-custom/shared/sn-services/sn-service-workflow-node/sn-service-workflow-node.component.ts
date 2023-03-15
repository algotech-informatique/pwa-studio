import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { TranslateService } from '@ngx-translate/core';
import { SnATNodeUtilsService } from '../../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnActionsService } from '../../../../smart-nodes/services';
import { SnItem } from '../../../../smart-nodes/models';
import { SnATNodeComponent } from '../../sn-at-node/sn-at-node.component';
import { SN_BASE_METADATA } from '../../../../smart-nodes/components';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnServiceWorkflowNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        private translateService: TranslateService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        this.load(
            this.loadListWorkflow(),
            'filterProperty'
        );
        super.calculate();
    }

    loadListWorkflow(): SnItem[] {
        return [
            {
                key: 'mobile',
                value: this.translateService.instant('SN-SERVICE-WORKFLOW-MOBILE'),
            },
            {
                key: 'display',
                value: this.translateService.instant('SN-SERVICE-WORKFLOW-DISPLAY'),
            },
            {
                key: 'system',
                value: this.translateService.instant('SN-SERVICE-WORKFLOW-SYSTEM'),
            }
        ];
    }
}
