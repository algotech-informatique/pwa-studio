import { Component, ChangeDetectorRef } from '@angular/core';
import { SnActionsService, SnUtilsService } from '../../../../smart-nodes/services';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnFlow, SnInputItem, SnNode, SnParam } from '../../../../smart-nodes/models';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { IconsService } from '../../../../../services';

interface displayedData {
    id: string;
    key: string;
    isConnected: boolean;
    multiple: boolean;
    types: string;
    param: SnParam;
}

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnDataBufferNodeComponent extends SnTaskNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snUtils: SnUtilsService,
        private iconService: IconsService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        this.recalculateType();
        this.loadDisplayed();
        super.calculate();
    }

    private loadDisplayed() {
        const param: displayedData = this.getDoneParam(this.node);
        const items: SnInputItem[] = _.reduce(this.snView.nodes, (result: SnInputItem[], nd: SnNode) => {
            if (nd.type === 'SnDataBufferNode') {
                const nParam: displayedData = this.getDoneParam(nd);
                if (nParam.key !== '' && nParam.id !== param.id) {
                    if (param.isConnected && nParam.isConnected) {
                        if (param.multiple === nParam.multiple && param.types.includes(nParam.types)) {
                            this.loadResult(result, nParam);
                        }
                    } else {
                        this.loadResult(result, nParam);
                    }
                }

            }
            return result;
        }, []);
        if (param) {
            if (param.param?.displayState) {
                param.param.displayState.listItems = items;
            } else {
                param.param.displayState = { listItems: items };
            }
        }
    }

    private loadResult(result: SnInputItem[], param: displayedData) {
        const exists = _.find(result, (rs: SnInputItem) =>
            rs.key === param.key
            && rs.multiple === param.multiple
            && rs.type === param.types);

        if (!exists) {
            const item: SnInputItem = {
                key: param.key,
                multiple: param.multiple,
                type: param.types,
                icon: this.iconService.getIcon((param.types) ? param.types : 'any'),
            };
            result.push(item);
        }
    }

    private getDoneParam(node: SnNode): displayedData {
        const flows: SnFlow[] = this.snUtils.getFlows(this.snView, node);
        const flow: SnFlow = (flows.length !== 0) ? flows.find((f: SnFlow) => f.key === 'done') : null;
        const dataParam: SnParam = this.snUtils.getParamByKey('data', node);
        const connected: SnParam = this.snUtils.findConnectedParam(this.snView, dataParam);

        return {
            id: node.id,
            key:  (flow && flow?.params[0]) ? flow?.params[0]?.key : '',
            isConnected: (connected) ? true : false,
            multiple: (connected?.multiple) ? true : false,
            types: (connected) ? connected.types as string : '',
            param:  (flow && flow?.params[0]) ? flow?.params[0] : null,
        };
    }

    private recalculateType() {
        const cumulMode = this.node.params.find((p) => p.key === 'cumul');
        const dataParam: SnParam = this.node.params.find((p) => p.key === 'data');
        const connected = this.snUtils.findConnectedParam(this.snView, dataParam);

        const flowOut = this.getFlowOut(this.node);
        if (!flowOut) { return ; }

        let multiple = cumulMode.value || connected?.multiple;
        let type =  this.snATNodeUtils.findType(this.snView, this.node, 'data') ?
                this.snATNodeUtils.findType(this.snView, this.node, 'data') : null;

        // undefined type (reinitialize)
        if (!type) {
            multiple = true;
            const dataBufferNodes = this.snView.nodes.filter((n) => n.type === this.node.type && n !== this.node);
            type = dataBufferNodes.reduce((result, n) => {
                const _flowOut = this.getFlowOut(n);
                if (!_flowOut) {
                    return result;
                }
                const outParam = _flowOut?.params[0];
                if (outParam.key && outParam.key === flowOut.params[0].key && !Array.isArray(outParam.types)) {
                    result = outParam.types;
                }
                return result;
            }, 'any');
        }

        this.snActions.editParam(this.snView, this.node, flowOut.params[0], flowOut.params, 'types', type);
        this.snActions.editParam(this.snView, this.node, flowOut.params[0], flowOut.params, 'multiple', multiple);
    }

    private getFlowOut(node: SnNode):  SnFlow {
        const flowOut = _.find(node.flows, { key: 'done' });
        if (!flowOut || flowOut.params.length === 0 ) { return null; }
        return flowOut;
    }

}
