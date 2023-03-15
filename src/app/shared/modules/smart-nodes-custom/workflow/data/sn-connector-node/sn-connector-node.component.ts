import { MessageService } from './../../../../../services/message/message.service';
import { SnModelsService } from './../../../../../services/smart-nodes/smart-nodes.service';
import { SnView } from './../../../../smart-nodes/models/sn-view';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnUtilsService } from '../../../../smart-nodes/services';
import * as _ from 'lodash';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnConnectorUtilsService } from './sn-connector-utils.service';
import { SnModelDto } from '@algotech/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
    ...SN_TASK_METADATA,
    template: `
        <goto-button *ngIf="smartflowModel" (goto)="openWorkflowTab()"></goto-button>
        ${SN_TASK_METADATA.template}
    `
})
export class SnConnectorNodeComponent extends SnTaskNodeComponent {

    smartflowModel: SnModelDto;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snUtils: SnUtilsService,
        private snConnectorUtils: SnConnectorUtilsService,
        private snModelsService: SnModelsService,
        private messageService: MessageService,
        private translate: TranslateService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getSmartflows(this.snView.id), 'smartFlow');
        const done = this.node.flows.find((f) => f.key === 'done');
        if (done && done.params.length === 1) {
            done.params[0].displayState.placeHolder = this.translate.instant('SN-SERVICE-RESULT');
        }
        const error = this.node.flows.find((f) => f.key === 'error');
        if (error && error.params.length === 2) {
            error.params[0].displayState.placeHolder = this.translate.instant('SN-SERVICE-CODE');
            error.params[1].displayState.placeHolder = this.translate.instant('SN-SERVICE-ERROR');
        }
        super.initialize(schema);
    }

    calculate() {
        this.smartflowModel = this.snConnectorUtils.getSmartflowModel(this.node);
        const smartflowView: SnView = this.snModelsService.getPublishedView(this.smartflowModel) as SnView;
        if (!smartflowView) {
            return;
        }
        this.snConnectorUtils.updateOutType(smartflowView, this.snView, this.node);
        this.snConnectorUtils.updateInputs(smartflowView, this.snView, this.node);

        const output = this.snATNodeUtils.getOutParam(this.node)?.param;
        const runOutside = this.node.params.find((p) => p.key === 'runOutside')?.value;
        const error = this.node.flows.find((f) => f.key === 'error');
        if (output) {
            if (runOutside) {
                const params = this.snUtils.findConnectedParams(this.snView, output);
                for (const p of params) {
                    p.toward = null;
                }
            }
            output.displayState.hidden = runOutside;
            error.displayState.hidden = runOutside;
        }

        super.calculate();
    }

    openWorkflowTab() {
        this.messageService.send('open-tab', this.smartflowModel);
    }

}
