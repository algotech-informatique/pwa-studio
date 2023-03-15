import { MessageService } from './../../../../../services/message/message.service';
import { SnView } from './../../../../smart-nodes/models/sn-view';
import { SnModelsService } from './../../../../../services/smart-nodes/smart-nodes.service';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../../smart-nodes/components';
import { SnATNodeComponent } from '../../sn-at-node/sn-at-node.component';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnActionsService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnConnectorUtilsService } from '../../../workflow/data/sn-connector-node/sn-connector-utils.service';
import { SnModelDto } from '@algotech/core';

@Component({
    ...SN_BASE_METADATA,
    template: `
        <goto-button *ngIf="smartflowModel" (goto)="openWorkflowTab()"></goto-button>
        ${SN_BASE_METADATA.template}
    `,
})
export class SnServiceConnectorNodeComponent extends SnATNodeComponent {

    smartflowModel: SnModelDto;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snConnectorUtils: SnConnectorUtilsService,
        private snModelsService: SnModelsService,
        private messageService: MessageService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getSmartflows(), 'key');
        super.initialize(schema);
    }

    calculate() {
        this.smartflowModel = this.snConnectorUtils.getSmartflowModel(this.node, 'key');
        const smartflowView: SnView = this.snModelsService.getPublishedView(this.smartflowModel) as SnView;
        if (!smartflowView) {
            return;
        }
        this.snConnectorUtils.updateOutType(smartflowView, this.snView, this.node);
        this.snConnectorUtils.updateInputs(smartflowView, this.snView, this.node, true);
        super.calculate();
    }

    openWorkflowTab() {
        this.messageService.send('open-tab', this.smartflowModel);
    }

}
