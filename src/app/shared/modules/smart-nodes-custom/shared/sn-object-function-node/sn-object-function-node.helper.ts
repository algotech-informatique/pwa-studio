import { NodeHelper } from '../../helper/class';
import * as _ from 'lodash';

interface FunctionSchema {
    key: string;
    value: string;
    parameters: string[];
}

export class SnObjectFunctionNodeHelper extends NodeHelper<SnObjectFunctionNodeHelper> {
    static _getFunctions(): FunctionSchema[] {
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
