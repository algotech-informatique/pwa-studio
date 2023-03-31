import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnParam } from '../../../smart-nodes/models';
import { SnActionsService, SnUtilsService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import * as _ from 'lodash';
import { PairDto } from '@algotech-ce/core';

@Component({
    ...SN_BASE_METADATA,
    template: SN_BASE_METADATA.template
})
export class SnFilterNodeComponent extends SnATNodeComponent {

    stringCriterias = [{
        key: 'startsWith',
        value: this.translate.instant('SN-FILTER.CRITERIA.STARTS-WITH'),
    }, {
        key: 'notStartsWith',
        value: this.translate.instant('SN-FILTER.CRITERIA.NOT-STARTS-WITH'),
    }, {
        key: 'endWith',
        value: this.translate.instant('SN-FILTER.CRITERIA.END-WITH'),
    }, {
        key: 'contains',
        value: this.translate.instant('SN-FILTER.CRITERIA.CONTAINS'),
    }];

    numberCriterias = [{
        key: 'gt',
        value: this.translate.instant('SN-FILTER.CRITERIA.MORE-THAN'),
    }, {
        key: 'lt',
        value: this.translate.instant('SN-FILTER.CRITERIA.LESS-THAN'),
    }, {
        key: 'gte',
        value: this.translate.instant('SN-FILTER.CRITERIA.MORE-THAN-EQUAL'),
    }, {
        key: 'lte',
        value: this.translate.instant('SN-FILTER.CRITERIA.LESS-THAN-EQUAL'),
    }, {
        key: 'between',
        value: this.translate.instant('SN-FILTER.CRITERIA.BETWEEN'),
    }];

    genericCriterias = [{
        key: 'equals',
        value: this.translate.instant('SN-FILTER.CRITERIA.EQUALS'),
    }, {
        key: 'different',
        value: this.translate.instant('SN-FILTER.CRITERIA.DIFFERENT'),
    }, {
        key: 'isNull',
        value: this.translate.instant('SN-FILTER.CRITERIA.IS-NULL'),
    }, {
        key: 'exists',
        value: this.translate.instant('SN-FILTER.CRITERIA.EXISTS'),
    }, {
        key: 'in',
        value: this.translate.instant('SN-FILTER.CRITERIA.IN'),
    }];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected translate: TranslateService,
        protected ref: ChangeDetectorRef,
        private snUtils: SnUtilsService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const outParamConnected = this.snUtils.findConnectedParam(this.snView, outParam?.param);

        if (outParamConnected?.custom?.type) {
            outParam.param.custom = outParamConnected.custom;
        }

        const firstValue = this.snATNodeUtils.findParamByKey(this.node, 'firstValue');
        const secondValue = this.snATNodeUtils.findParamByKey(this.node, 'secondValue');
        const criteria = this.snATNodeUtils.findParamByKey(this.node, 'criteria');

        this.updateInputsTypes(outParam.param.custom?.type, firstValue, secondValue, criteria.value);
        this.updateCriteriaItems(outParam.param.custom?.type, outParam.param.custom?.multiple, criteria);
        this.updateInputsDisplay(firstValue, secondValue, criteria);

        super.calculate();
    }

    private updateInputsTypes(outParamCustom: string | string[], firstValue: SnParam, secondValue: SnParam, criteriaValue: string) {
        if (outParamCustom) {
            const type = _.isString(outParamCustom) && (outParamCustom as string).startsWith('so:') ? 'string' : outParamCustom;
            this.snActions.editParam(this.snView, this.node, firstValue, this.node.params, 'types', type);
            if (criteriaValue === 'in') {
                this.snActions.editParam(this.snView, this.node, firstValue, this.node.params, 'multiple', true);
                this.snActions.editParam(this.snView, this.node, firstValue, this.node.params, 'display', null);
            } else {
                this.snActions.editParam(this.snView, this.node, firstValue, this.node.params, 'multiple', false);
                this.snActions.editParam(this.snView, this.node, firstValue, this.node.params, 'display', 'input');
                if (criteriaValue === 'between') {
                    this.snActions.editParam(this.snView, this.node, secondValue, this.node.params, 'types', type);
                }
            }
        }
    }

    private getCriterias(type: string, multiple: boolean) {
        let criterias = [...this.stringCriterias, ...this.genericCriterias];
        switch (type) {
            case 'string':
                criterias = [...this.stringCriterias, ...this.genericCriterias];
                break;
            case 'date':
            case 'time':
            case 'datetime':
            case 'number':
                criterias = [...this.numberCriterias, ...this.genericCriterias];
                break;
            case 'boolean':
                criterias = [...this.genericCriterias];
                break;
            default:
                criterias = [...this.stringCriterias, ...this.genericCriterias];
        };

        if (type?.startsWith('so:') && multiple) {
            criterias = _.reject(criterias, (item: PairDto) => item.key === 'notStartsWith' || item.key === 'different');
        }

        return criterias;
    }

    private updateCriteriaItems(type: string, multiple: boolean, criteria: SnParam) {
        this.load(this.getCriterias(type, multiple), 'criteria');

        if (!criteria.displayState.items.find(item => item.key === criteria.value)) {
            this.snActions.editParam(this.snView, this.node, criteria, this.node.params, 'value', null);
        }
    }

    private updateInputsDisplay(firstValue: SnParam, secondValue: SnParam, criteria: SnParam) {
        secondValue.displayState.hidden = !criteria.value || criteria.value !== 'between';
        firstValue.displayState.hidden = !criteria.value
            || criteria.value === 'isNull'
            || criteria.value === 'exists'
            || criteria.value === 'isNotNull';
    }

}
