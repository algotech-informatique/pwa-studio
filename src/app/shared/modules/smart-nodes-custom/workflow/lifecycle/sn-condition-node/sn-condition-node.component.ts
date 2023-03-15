import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeSchema, SnSectionClickEvent } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';
import { SnActionsService, SnUtilsService } from '../../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../../../shared/sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnParam, SnSection } from '../../../../smart-nodes/models';
import { UUID } from 'angular2-uuid';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnConditionV2NodeComponent extends SnTaskNodeComponent {

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
        const conditionAValue = this.snATNodeUtils.findParamByKey(this.node, 'conditionAValue');
        this.updateCriteriasDisplay(conditionAValue);
        this.updateCriteriasTypes(conditionAValue);
        super.calculate();
    }

    onSectionClicked(event: SnSectionClickEvent) {
        if (!this.validateSequential(event.section.params)) {
            event.section.params = this.recalculeKey(event.section.params);
        }
        this.addCriteria(event.section);
    }

    private validateSequential(items: SnParam[]): boolean {
        for (let v = 0; v < items.length; v++) {
            const itemVal = items[v].key.replace('#', '');
            if (itemVal !== (v + 1).toString()) {
                return false;
            }
        }
        return true;
    }

    private recalculeKey(params: SnParam[]): SnParam[] {
        return params.map((param: SnParam, index: number) => {
            param.key = '#' + (index + 1);
            return param;
        });
    }

    private updateCriteriasDisplay(conditionAValue: SnParam) {
        const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
        if (conditionAValue.toward) {
            criteriasSection.hidden = false;
        } else {
            this.snActions.removeParams(this.snView, criteriasSection.params, criteriasSection.params);
            criteriasSection.hidden = true;
        }
    }

    private addCriteria(section: SnSection) {
        const conditionAValue = this.snATNodeUtils.findParamByKey(this.node, 'conditionAValue');
        const connectedParam = this.snUtils.findConnectedParam(this.snView, conditionAValue);
        const param: SnParam = {
            id: UUID.UUID(),
            direction: 'in',
            key: '#' + (section.params.length + 1),
            types: 'sys:filter',
            multiple: false,
            pluggable: true,
            master: false,
            required: true,
            custom: { type: connectedParam?.types, multiple: connectedParam?.multiple },
        };
        this.snActions.addParam(this.snView, this.node, param, section.params);
    }

    private updateCriteriasTypes(conditionAValue: SnParam) {
        const criteriasSection = this.snATNodeUtils.findSection(this.node, 'criterias');
        const connectedParam = this.snUtils.findConnectedParam(this.snView, conditionAValue);
        criteriasSection.params.forEach(criteria => {
            this.snActions.editParam(this.snView, this.node, criteria, criteriasSection.params, 'custom',
                { type: connectedParam?.types, multiple: connectedParam?.multiple });
        });
    }

}
