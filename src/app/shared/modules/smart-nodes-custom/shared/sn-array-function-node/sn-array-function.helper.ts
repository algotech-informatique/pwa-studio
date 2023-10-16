import { NodeHelper } from '../../helper/class';
import * as _ from 'lodash';

interface FunctionSchema {
    key: string;
    value: string;
    parameters: {
        key: string;
        optional?: boolean;
    }[];
}

export class SnArrayFunctionNodeHelper extends NodeHelper<SnArrayFunctionNodeHelper> {
    static _getFunctions(type: string, forBuild = false): FunctionSchema[] {
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
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null]),
            }, {
                key: 'find',
                value: 'Find',
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'filter',
                value: 'Filter',
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'every',
                value: 'Every',
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'some',
                value: 'Some',
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
            }, {
                key: 'reject',
                value: 'Reject',
                parameters: _.compact([{ key: 'propKey' }, !forBuild && type === 'object' ? {key: 'propType'} : null, {key: 'propValue'}])
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
            key: 'slice',
            value: 'Slice',
            parameters: [{ key: 'start' }, { key: 'end' }]
        }, {
            key: 'length',
            value: 'Length',
            parameters: []
        }]);

        return items;
    }
}
