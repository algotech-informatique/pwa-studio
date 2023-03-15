import { Injectable } from '@angular/core';
import { SnNode, SnSection, SnView, SnParam } from '../../../../smart-nodes/models';
import { SnNodeMergeService, SnDOMService, SnActionsService } from '../../../../smart-nodes/services';
import { SessionsService, SnModelsService } from '../../../../../services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnModelDto, WorkflowVariableModelDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';

@Injectable()
export class SnConnectorUtilsService {
    constructor(
        protected snModelsService: SnModelsService,
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected sessionsService: SessionsService,
        protected snDOMService: SnDOMService,
        protected snMergeService: SnNodeMergeService,
    ) {
    }

    getSmartflowModel(node: SnNode, key = 'smartFlow'): SnModelDto {
        return this.sessionsService.active.datas.write.snModels.find(
            (model) => model.key === this.snATNodeUtils.findValue(node, key) && model.type === 'smartflow'
        );
    }

    updateOutType(smartflowView: SnView, snView: SnView, node: SnNode) {
        const outParam = this.snATNodeUtils.getOutParam(node);
        if (!outParam) {
            return;
        }

        const typeAndMultiple = this.checkTypeAndMultiple(smartflowView);
        const selectedType = typeAndMultiple.selectedType;
        const multiple = typeAndMultiple.multiple;

        this.snActions.editParam(snView, node, outParam.param, outParam.params, 'types', selectedType);
        this.snActions.editParam(snView, node, outParam.param, outParam.params, 'multiple', multiple);
    }

    checkTypeAndMultiple(smartflowView: SnView) {
        let selectedType = '';
        let multiple = null;
        let requestNode = smartflowView.nodes.filter((n) => n.type === 'SnRequestResultNode');

        const predicateCodeSuccess = (r) => {
            const code = +(r.params.find((p) => p.key === 'code')?.value);
            if (!code) {
                return false;
            }
            return code >= 200 && code < 300;
        };
        if (requestNode.some(predicateCodeSuccess)) {
            requestNode = requestNode.filter(predicateCodeSuccess);
        }

        if (requestNode.length !== 0) {
            const rNode: SnNode = requestNode[requestNode.length - 1];
            const param = this.snATNodeUtils.getOutParam(rNode);
            selectedType = (param.param.types as string);
            multiple = (param.param.multiple);
        } else {
            const mappedNode = smartflowView.nodes.filter((n) => n.type === 'SnMappedNode');
            const smartModels = _.reduce(mappedNode, (results, n: SnNode) => {
                const param = this.snATNodeUtils.getOutParam(n);
                if (param && _.isString(param.param.types)) {
                    const model = this.sessionsService.active.datas.read.smartModels.find((sm) =>
                        sm.key.toUpperCase() === (param.param.types as string).replace('so:', '').toUpperCase()
                    );

                    if (model) {
                        results.push(model);
                    }
                }
                return results;
            }, []);
            selectedType = (smartModels.length === 1) ? `so:${smartModels[0].key.toLowerCase()}` : 'so:';
        }
        return { selectedType, multiple };
    }

    updateInputs(smartflowView: SnView, snView: SnView, node: SnNode, removeSources = false) {
        let variables = smartflowView.options ? smartflowView.options.variables : [];
        variables = _.reduce(variables, (res: any, v: any) => {
            if (v.key.length > 0 && v.type.length > 0) {
                res.push(v);
            }
            return res;
        }, []);

        if (removeSources) {

            _.remove(variables, { key: 'page' });
            _.remove(variables, { key: 'limit' });
            _.remove(variables, { key: 'filter' });
            _.remove(variables, { key: 'search-parameters' });
        }

        this.mergedProperties(snView, node, variables);
    }

    private mergedProperties(snView: SnView, node: SnNode, variables: WorkflowVariableModelDto) {

        const section: SnSection = node.sections.find((s) => s.key === 'inputs');

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
                required: v.required
            };
            const findParam = section.params.find((f) => f.key === v.key);
            return this.snMergeService.mergeParam(findParam ? _.cloneDeep(findParam) : param, param);
        });

        section.hidden = params.length > 0 ? false : true;
        if (JSON.stringify(params) !== JSON.stringify(section.params)) {
            section.params = params;
            this.snActions.notifyNode('chg', snView, node);
        }
    }

}
