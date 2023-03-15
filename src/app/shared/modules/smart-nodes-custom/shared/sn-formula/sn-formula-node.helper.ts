import { SnParam } from '../../../smart-nodes/models';
import { SnActionsService } from '../../../smart-nodes/services';
import { NodeHelper } from '../../helper/class';
import _ from 'lodash';
import { UUID } from 'angular2-uuid';

type FormulaInputType = 'string' | 'date' | 'datetime' | 'number' | 'time' | 'boolean' | 'object';
export class SnFormulaNodeHelper extends NodeHelper<SnFormulaNodeHelper> {
    setSource(sources: { key: string; value?: any; relativeTo?: SnParam; type?: FormulaInputType}[]): SnFormulaNodeHelper {
        sources.forEach((source) => {
            const param: SnParam = {
                id: UUID.UUID(),
                direction: 'in',
                key: source.key,
                types: 'string',
                pluggable: true,
                displayState: {},
                display: 'input',
            };
            if (source.value) {
                param.multiple = false;
                param.value = source.value;
                param.types = source.type ? source.type : 'string';
            }
            if (source.relativeTo) {
                param.toward = source.relativeTo.id;
                param.types = source.relativeTo.types;
                param.multiple = source.relativeTo.multiple;
                param.value = source.relativeTo.value;
            }
            this.helperContext.initializeParamValue(param);
            this.helperContext.createNodeParam(this.view, this.node, param);
        });
        return this;
    }

    setFormula(formula: string): SnFormulaNodeHelper {
        this.node.params[0].value = formula;
        return this;
    }

    getResultParam(): SnParam {
        return this.getParam('result');
    }
}
