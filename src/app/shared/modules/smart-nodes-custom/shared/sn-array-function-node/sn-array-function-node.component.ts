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
    parameters: {
        key: string;
        optional?: boolean;
    }[];
}

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnArrayFunctionNodeComponent extends SnATNodeComponent {
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
        this.loadProperties('array', 'propKey', 'object');
        this.load(this.snATNodeUtils.getPrimitiveTypes(), 'propType');

        // hidden
        parameters.hidden = (!nFunction.value || !nFunction.displayState?.items?.some((i) => i.key === nFunction.value) || !array.toward);
        if (nFunction.value && type) {
            const findFunction = this._getFunctions(type).find((f) => f.key === nFunction.value);
            if (findFunction) {
                for (const param of parameters.params) {
                    const fnctParam = findFunction.parameters.find((p) => p.key === param.key);
                    param.displayState.hidden = !fnctParam;
                    param.required = (!param.displayState.hidden && !fnctParam.optional);
                    param.displayState.error = false;

                    if (param.key === 'order' && !param.value) {
                        param.value = 'asc';
                    }
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
            case 'item':
                result.multiple = false;
                break;
            case 'length': {
                result.types = 'number';
                result.multiple = false;
            }
                break;
            case 'join': {
                result.types = 'string';
                result.multiple = false;
            }
                break;
            case 'filter':
            case 'every':
            case 'some':
            case 'map': {
                let propType = null;
                let multiple = null;

                if (type === 'object') {
                    propType = this.snATNodeUtils.findValue(this.node, 'propType');
                } else {
                    if (propKey) {
                        const findItem = propKey.displayState?.items?.find((item) => item.key === propKey.value);
                        propType = findItem && findItem.custom ? findItem.custom.type : null;
                        multiple = findItem && findItem.custom ? findItem.custom.multiple : null;
                    }
                }
                if (propType) {
                    const propValue = parameters.params.find((p) => p.key === 'propValue');
                    if (propValue) {
                        this.snActions.editParam(this.snView, this.node, propValue, parameters.params, 'types', propType);
                        this.snActions.editParam(this.snView, this.node, propValue, parameters.params, 'multiple', multiple);
                    }
                }
                // update output
                if (nFunction.value === 'map' && propType) {
                    result.types = propType;
                }
                if (nFunction.value === 'every' || nFunction.value === 'some') {
                    result.types = 'boolean';
                    result.multiple = false;
                }
            }
                break;
        }

        this.snActions.notifyNode('chg', this.snView, this.node);
        super.calculate();
    }

    loadFunction(type: any) {
        const functions = this._getFunctions(type);
        this.load(_.map(_.orderBy(functions, 'key'), (f) => ({
                key: f.key,
                value: f.value,
            })), 'function');
    }

    _getFunctions(type: string): FunctionSchema[] {
        if (!_.isString(type)) {
            return [];
        }

        const items: FunctionSchema[] = [];
        if (type.startsWith('so:') || type.startsWith('sys:') || type === 'object') {
            items.push(...[{
                key: 'uniqBy',
                value: 'UniqBy',
                parameters: [{ key: 'propKey' }],
            }, {
                key: 'orderBy',
                value: 'OrderBy',
                parameters: [{ key: 'propKey' }, {key: 'order'}]
            }, {
                key: 'map',
                value: 'Map',
                parameters: _.compact([{ key: 'propKey' }, type === 'object' ? {key: 'propType'} : null]),
            }, {
                key: 'filter',
                value: 'Filter',
                parameters: _.compact([{ key: 'propKey' }, type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'every',
                value: 'Every',
                parameters: _.compact([{ key: 'propKey' }, type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'some',
                value: 'Some',
                parameters: _.compact([{ key: 'propKey' }, type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }]);
        } else if (['string', 'number', 'date', 'datetime', 'time', 'boolean'].includes(type)) {
            items.push(...[{
                key: 'uniq',
                value: 'Uniq',
                parameters: []
            }, {
                key: 'sort',
                value: 'Sort',
                parameters: []
            }, {
                key: 'join',
                value: 'Join',
                parameters: [{ key: 'separator', optional: true }]
            }]);
        }

        items.push(...[{
            key: 'left',
            value: 'Left',
            parameters: [{ key: 'position' }],
        }, {
            key: 'right',
            value: 'Right',
            parameters: [{ key: 'position' }]
        }, {
            key: 'reverse',
            value: 'Reverse',
            parameters: []
        }, {
            key: 'difference',
            value: 'Difference',
            parameters: [{ key: 'inspect' }]
        }, {
            key: 'concat',
            value: 'Concat',
            parameters: [{ key: 'inspect' }]
        }, {
            key: 'item',
            value: 'Item',
            parameters: [{ key: 'position' }]
        }, {
            key: 'length',
            value: 'Length',
            parameters: []
        }]);

        return items;
    }

}
