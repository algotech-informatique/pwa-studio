import { MessageService } from './../../../../../services/message/message.service';
import { EntryComponentsService } from './../../../service/entry-components/entry-components/entry-components.service';
import { SnNodeMergeService } from './../../../../smart-nodes/services/view/sn-node-merge/sn-node-merge.service';
import { SnSection } from './../../../../smart-nodes/models/sn-section';
import { WorkflowVariableModelDto, WorkflowProfilModelDto, SnModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { SnFlow } from './../../../../smart-nodes/models/sn-flow';
import { SnParam } from './../../../../smart-nodes/models/sn-param';
import { SnView } from './../../../../smart-nodes/models/sn-view';
import { SnModelsService } from './../../../../../services/smart-nodes/smart-nodes.service';
import { SnNode } from './../../../../smart-nodes/models/sn-node';
import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnUtilsService } from '../../../../smart-nodes/services';
import * as _ from 'lodash';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    ...SN_TASK_METADATA,
    template: `
        <goto-button *ngIf="snModel" (goto)="openWorkflowTab()"></goto-button>
        ${SN_TASK_METADATA.template}
    `,
})
export class SnSubWorkflowNodeComponent extends SnTaskNodeComponent {

    snModel: SnModelDto;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        private snUtilsService: SnUtilsService,
        protected ref: ChangeDetectorRef,
        private snModelsService: SnModelsService,
        private snMergeService: SnNodeMergeService,
        private messageService: MessageService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getWorkflows(this.snView.id), 'workFlow');
        super.initialize(schema);
    }

    calculate() {
        const workflowView: SnView = this.getWorkflowView();
        if (!workflowView) {
            return;
        }
        this.updateOutputs(workflowView);
        this.updateWorkflowProfiles(workflowView);
        this.updateInputs(workflowView, this.node);
        super.calculate();
    }

    openWorkflowTab() {
        this.messageService.send('open-tab', this.snModel);
    }

    private getWorkflowView() {
        this.snModel = this.snATNodeUtils.getSnModel(this.node, 'workFlow');
        return this.snModelsService.getPublishedView(this.snModel) as SnView;
    }

    private updateOutputs(workflowView: SnView) {
        const outputs = this.snUtilsService.getOutputs(workflowView);

        const flow: SnFlow = this.node.flows.find((f) => f.key === 'done');
        const params = _.map(outputs, (output: SnParam) => {
            output = _.cloneDeep(output);
            output.id = UUID.UUID();
            output.hidden = false;
            output.displayState = {};
            output.value = output.key;
            output.key = null;
            output.dynamic = false;

            const findParam = flow.params.find((param) => param.value === output.value);

            const res = findParam ? this.snMergeService.mergeParam(findParam, output, false) : output;
            res.displayState.placeHolder = output.value;
            return res;
        });
        flow.params = params;
    }

    private updateInputs(workflowView: SnView, node: SnNode) {
        let variables = workflowView.options ? workflowView.options.variables : [];
        variables = _.reduce(variables, (res: any, v: any) => {
            if (v.key.length > 0 && v.type.length > 0) {
                res.push(v);
            }
            return res;
        }, []);

        const section: SnSection = node.sections.find((s) => s.key === 'inputs');
        const params = _.map(variables, (v: WorkflowVariableModelDto) => {
            return this.createParam(section, v.key, 'input', v.type, v.multiple, true, true);
        });

        section.hidden = params.length > 0 ? false : true;
        section.params = params;
    }

    private updateWorkflowProfiles(workflowView: SnView) {
        const profiles = _.reduce(workflowView.options?.profiles, (res: any, p: any) => {
            if (p.name.length > 0) {
                res.push(p);
            }
            return res;
        }, []);

        const section: SnSection = this.node.sections.find((s) => s.key === 'profiles');
        const params = _.map(profiles, (p: WorkflowProfilModelDto) => {
            const param: SnParam = this.createParam(section, p.name, 'select', 'string', false, false);
            param.displayState.items = this.snATNodeUtils.getProfiles(this.snView);
            return param;
        });
        section.hidden = params.length > 0 ? false : true;
        section.params = params;
    }

    private createParam(
        paramsParent: SnSection | SnFlow,
        key: string,
        display: 'input' | 'password' | 'select' | 'key-edit',
        types: string | string[],
        multiple: boolean,
        pluggable: boolean,
        required: boolean = false,
    ): SnParam {
        const param: SnParam = {
            id: UUID.UUID(),
            direction: 'in',
            key,
            toward: null,
            types,
            multiple,
            pluggable,
            displayState: {},
            display,
            required
        };
        const findParam = paramsParent.params.find((f) => f.key === key);
        return this.snMergeService.mergeParam(findParam ? _.cloneDeep(findParam) : param, param);
    }

}
