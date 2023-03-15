import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnActionsService, SnUtilsService } from '../../../smart-nodes/services';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnItem } from './../../../smart-nodes/models/sn-pair';
import { SnFlow, SnParam } from '../../../smart-nodes/models';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnRequestResultNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private snUtils: SnUtilsService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        const elements: SnItem[] = [
            {
                key: 'smartObject',
                value: 'SmartObject'
            }, {
                key: 'json',
                value: 'JSON'
            },
        ];
        this.load(elements, 'format');
        const status = this.node.flows
            ?.find((f) => f.direction === 'out')?.params
            ?.find((p) => p.key === 'status');

        if (status) {
            status.displayState.hidden = true;
        }
        super.initialize(schema);
    }

    calculate() {
        this.calculCode();
        this.recalculateType();
        super.calculate();
    }

    calculCode() {

        const codeParam = this.node.params.find((p) => p.key === 'code');
        const code = codeParam.value;
        if (code >= 100 && code < 200) {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-INFO';
        } else if (code >= 200 && code < 300) {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-SUCCESS';
        } else if (code >= 300 && code < 400) {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-REDIRECT';
        } else if (code >= 400 && code < 500) {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-CLIENT-ERROR';
        } else if (code >= 500 && code < 600) {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-SERVOR-ERROR';
        } else {
            this.node.displayState.headerColor = '--SN-NODE-HEADER-BACKGROUND-SNREQUESTRESULTNODE-SUCCESS';
            codeParam.value = 200;
        }
    }

    private recalculateType() {
        const findType = this.snATNodeUtils.findType(this.snView, this.node, 'inputs');
        const format = this.node.params.find((p) => p.key === 'format');
        if (!format) {
            return;
        }

        let type = '';
        if (findType) {
            type = (findType.startsWith('so:') && (format.value === 'json')) ? 'object' : findType;
        } else {
            type = 'object';
        }

        if (!_.isArray(type)) {
            if (findType) {
                format.displayState.hidden  = !(findType as string).startsWith('so:');
                if ((findType as string).startsWith('so:') && !format.value) {
                    format.value = 'smartObject';
                }
            } else {
                format.displayState.hidden = true;
                format.value = null;
            }
        } else {
            format.displayState.hidden = true;
            format.value = null;
        }

        const flowOut: SnFlow = _.find(this.node.flows, { key: 'done' });
        if (!flowOut || flowOut.params.length === 0) { return; }
        if (flowOut.params[0].types === type) {
            return;
        }
        flowOut.params[0].types = type;

        const nodeParam: SnParam = this.node.params.find((p) => p.key === 'inputs');
        const outParam = this.snUtils.findConnectedParam(this.snView, nodeParam);
        flowOut.params[0].multiple = outParam ? outParam.multiple : false;
        this.snActions.notifyNode('chg', this.snView, this.node);
    }
}
