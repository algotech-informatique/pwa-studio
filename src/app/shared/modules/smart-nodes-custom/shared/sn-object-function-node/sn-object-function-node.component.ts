import { Component, ChangeDetectorRef } from '@angular/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import * as _ from 'lodash';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { TranslateService } from '@ngx-translate/core';

interface FunctionSchema {
    key: string;
    value: string;
    parameters: string[];
}

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnObjectFunctionNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef,
        private translate: TranslateService,
    ) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load([{
            key: 'asc',
            value: this.translate.instant('SN-ORDER-ASC')
        }, {
            key: 'desc',
            value: this.translate.instant('SN-ORDER-DESC')
        }], 'order');

        super.initialize(schema);
    }

    calculate() {

        const type = this.snATNodeUtils.findType(this.snView, this.node, 'array');
        const result = this.node.params.find((p) => p.key === 'result');
        const array = this.node.params.find((p) => p.key === 'array');
        const nFunction = this.node.params.find((p) => p.key === 'function');
        const parameters = this.node.sections.find((s) => s.key === 'parameters');

        if (!parameters || !nFunction || !array || !result) {
            return;
        }

        // load
        this.loadFunction(type);

        // hidden
        parameters.hidden = (!nFunction.value || !nFunction.displayState.items.some((i) => i.key === nFunction.value) || !array.toward);
        if (nFunction.value && type) {
            const findFunction = this._getFunctions(type).find((f) => f.key === nFunction.value);
            if (findFunction) {
                for (const param of parameters.params) {
                    param.displayState.hidden = !findFunction.parameters.some((p) => p === param.key);
                }
            }
        }

        // type
        const propKey = parameters.params.find((p) => p.key === 'propKey');
        if (type === 'object' && propKey) {
            propKey.display = 'input';
        }
        const arrayType = type ? type : ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'object', 'sys:'];
        const inspect = parameters.params.find((p) => p.key === 'inspect');
        if (inspect) {
            inspect.types = arrayType;
        }
        result.types = arrayType;
        result.multiple = true;
        switch (nFunction.value) {
            case 'keys': {
                result.types = 'string';
                result.multiple = true;
            }
                break;
            case 'has':
            case 'hasIn': {
                result.types = 'boolean';
                result.multiple = false;
            }
                break;
            case 'set': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'unset': {
                result.types = 'boolean';
                result.multiple = false;
            }
                break;
            case 'at':
                result.multiple = true;
                result.types = 'object';
                break;
            case 'omit': {
                result.multiple = false;
                result.types = 'object';
            }
                break;
            case 'defaults':
            case 'defaultsDeep': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'findKey': {
                result.types = 'string';
                result.multiple = false;
            }
                break;
            case 'findLastKey': {
                result.types = 'string';
                result.multiple = false;
            }
                break;
            case 'get': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'invert':
            case 'invertBy': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'merge': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'pick': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
            case 'result': {
                result.types = 'object';
                result.multiple = false;
            }
                break;
        }

        this.snActions.notifyNode('chg', this.snView, this.node);
        super.calculate();
    }

    loadFunction(type: any) {
        const functions = this._getFunctions(type);
        this.load(_.map(_.orderBy(functions, 'key'), (f) =>
            ({
                key: f.key,
                value: f.value,
            })
        ), 'function');
    }

    _getFunctions(type: string): FunctionSchema[] {
        if (!_.isString(type)) {
            return [];
        }

        const items: FunctionSchema[] = [];
        items.push(...[{
            key: 'at',
            value: 'at',
            parameters: ['propPathArray'],
        }, {
            key: 'omit',
            value: 'omit',
            parameters: ['propPathArray'],
        }, {
            key: 'defaults',
            value: 'default',
            parameters: ['sources']
        }, {
            key: 'defaultsDeep',
            value: 'defaultsDeep',
            parameters: ['sources'],
        }, {
            key: 'has',
            value: 'has',
            parameters: ['compare'],
        }, {
            key: 'hasIn',
            value: 'hasIn',
            parameters: ['compare'],
        }, {
            key: 'keys',
            value: 'keys',
            parameters: [],
        }, {
            key: 'set',
            value: 'set',
            parameters: ['compare', 'value'],
        }, {
            key: 'unset',
            value: 'unset',
            parameters: ['compare'],
        }, {
            key: 'findKey',
            value: 'findKey',
            parameters: ['sources'],
        }, {
            key: 'findLastKey',
            value: 'findLastKey',
            parameters: ['sources'],
        }, {
            key: 'get',
            value: 'get',
            parameters: ['propPathArray', 'value'],
        },
        {
            key: 'invert',
            value: 'invert',
            parameters: [],
        },
        {
            key: 'invertBy',
            value: 'inverBy',
            parameters: [],
        }, {
            key: 'merge',
            value: 'merge',
            parameters: ['sources'],
        },
        {
            key: 'pick',
            value: 'pick',
            parameters: ['propPathArray'],
        },
        {
            key: 'result',
            value: 'result',
            parameters: ['propPathArray', 'value'],
        }]);
        return items;
    }

}
