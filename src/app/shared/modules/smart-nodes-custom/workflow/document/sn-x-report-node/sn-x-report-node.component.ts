import {
    Component, ChangeDetectorRef
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SessionsService, SnModelsService } from '../../../../../services';
import { SnActionsService, SnNodeMergeService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnView, SnSection, SnParam } from '../../../../smart-nodes/models';
import { WorkflowVariableModelDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnXReportNodeComponent extends SnTaskNodeComponent {
    paramFileId: SnParam;
    paramTemplateName: SnParam;
    paramKeysTypes: SnParam;
    constructor(
        protected snModelsService: SnModelsService,
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected sessionsService: SessionsService,
        protected snMergeService: SnNodeMergeService,
        protected ref: ChangeDetectorRef) {
        super(snActions, snATNodeUtils, ref);
    }
    initialize(schema: SnNodeSchema) {
        this.load(this.snATNodeUtils.getSnReports(), 'report');
        this.paramKeysTypes = this.snATNodeUtils.findParamByKey(this.node, 'keysTypes');
        this.paramFileId = this.snATNodeUtils.findParamByKey(this.node, 'fileId');
        this.paramTemplateName = this.snATNodeUtils.findParamByKey(this.node, 'templateName');

        this.paramKeysTypes.displayState.hidden = true;
        this.paramFileId.displayState.hidden = true;
        this.paramTemplateName.displayState.hidden = true;
        super.initialize(schema);
    }

    calculate() {
        // update type

        const section: SnSection = this.node.sections.find((s) => s.key === 'inputs');
        const findModel = this.sessionsService.active.datas.write.snModels.find(
            (snModel) => (snModel.key === this.snATNodeUtils.findValue(this.node, 'report')
                          && snModel.type === 'report'));
        const snView = this.snModelsService.getActiveView(findModel) as SnView;
        if (!snView) {
            return;
        }

        let variables = snView.options ? snView.options.variables : [];

        variables = _.reduce(variables, (res: any, v: any) => {
            if (v.key.length > 0 && v.type.length > 0) {
                res.push(v);
            }
            return res;
        }, []);

        this.mergedProperties(section, variables);

        this.snActions.editParam(this.snView, this.node, this.paramKeysTypes,
            this.node.params, 'value', variables);
        this.snActions.editParam(this.snView, this.node, this.paramFileId,
            this.node.params, 'value', snView.options.fileId);
        this.snActions.editParam(this.snView, this.node, this.paramTemplateName,
            this.node.params, 'value', snView.options.fileName);
        super.calculate();
    }

    mergedProperties(section: SnSection, variables: WorkflowVariableModelDto) {
        const params = _.map(variables, (v: WorkflowVariableModelDto) => {
            const param: SnParam = {
                id: UUID.UUID(),
                direction: 'in',
                key: v.key,
                toward: null,
                types: v.type,
                multiple: v.multiple,
                pluggable: true,
                displayState: {},
                display: 'input',
            };
            const findParam = section.params.find((f) => f.key === v.key);
            if (findParam) {
                return this.snMergeService.mergeParam(_.cloneDeep(findParam), param);
            } else {
                return param;
            }
        });

        section.hidden = params.length > 0 ? false : true;
        if (JSON.stringify(params) !== JSON.stringify(section.params)) {
            section.params = params;
            this.snActions.notifyNode('chg', this.snView, this.node);
        }
    }
}

