import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnUtilsService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnFlow, SnParam, SnSection } from '../../../../smart-nodes/models';
import { SN_BASE_METADATA } from '../../../../smart-nodes/components';
import * as _ from 'lodash';

@Component({
    ...SN_BASE_METADATA,
    template: `
        <sn-flows
            *ngIf="node.flows?.length > 0"
            [snView]="snView"
            [flows]="node.flows"
            [node]="node"
            notifyParam="true"
            [section]="section"
            [connectedParam]="connectedParam"
            [languages]="settings.languages"
        >
        </sn-flows>

        <sn-params
            *ngIf="node.params?.length > 0"
            [params]="node.params"
            [snView]="snView"
            [node]="node"
        >
        </sn-params>

        <sn-sections
            *ngIf="node.sections?.length > 0"
            [sections]="node.sections"
            [snView]="snView"
            [node]="node"
            >
        </sn-sections>
    `
})
export class SnSwitchNodeComponent extends SnTaskNodeComponent {

    section: SnSection;
    connectedParam: SnParam;

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected snUtils: SnUtilsService,
        protected ref: ChangeDetectorRef,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        const sect = this.node.sections.find((sc: SnSection) => sc.key === 'criterias');
        if (sect) {
            this.section = sect;
        }
        const switchAValue = this.snATNodeUtils.findParamByKey(this.node, 'switchAValue');
        this.connectedParam = this.snUtils.findConnectedParam(this.snView, switchAValue);
        this.updateCriteriasDisplay(switchAValue);
        this.updateCriteriasTypes(switchAValue);
        this.updateParams();
        this.updateLibelles();
        super.calculate();
    }

    private updateCriteriasDisplay(conditionAValue: SnParam) {

        const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
        if (conditionAValue.toward) {
            criteriasSection.editable = true;
            this.node.flowsEditable = true;
        } else {
            criteriasSection.editable = false;
            this.node.flowsEditable = false;
        }
    }

    private updateCriteriasTypes(conditionAValue: SnParam) {
        const connectedParam = this.snUtils.findConnectedParam(this.snView, conditionAValue);
        if (connectedParam?.types.length > 0) {
            const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
            criteriasSection.params.forEach(criteria => {
                this.snActions.editParam(this.snView, this.node, criteria, criteriasSection.params, 'types', connectedParam?.types);
            });
        };
    }

    private updateParams() {
        const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
        // Delete
        const params: number = criteriasSection.params.length;
        const flows: number = (this.node.flows.length - 2);
        if (params < flows) {
            this.node.flows = _.reduce(this.node.flows, (result, flow: SnFlow) => {
                if (flow.direction === 'in' || flow.key === 'default') {
                    result.push(flow);
                } else {
                    const param = criteriasSection.params.find((prm: SnParam) => prm.custom?.linkedParam === flow.custom?.linkedParam);
                    if (param) {
                        result.push(flow);
                    }
                }
                return result;
            }, []);
        } else if (flows < params ) {
            criteriasSection.params = _.reduce(criteriasSection.params, (result, param: SnParam) => {
                const flow = this.node.flows.find((flw: SnFlow) => flw.custom?.linkedParam === param.custom?.linkedParam);
                if (flow) {
                    result.push(param);
                }
                return result;
            }, []);
        }
    }

    private updateLibelles() {
        const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
        criteriasSection.params  = _.reduce(criteriasSection.params, (result, prm: SnParam) => {
            const flow = this.node.flows.find((fl: SnFlow) => fl.custom?.linkedParam === prm.custom?.linkedParam);
            if (flow) {
                prm.key = flow.key;
                prm.displayName = flow.displayName;
                prm.value = prm.value ?? '';
                result.push(prm);
            }
            return result;
        }, []);
        this.snActions.notifyUpdate(this.snView);
    }

}
