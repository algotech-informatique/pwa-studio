import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_LOOP_NODE_SCHEMA: (displayName: SnLang[], nextText: SnLang[], finishText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], nextText: SnLang[], finishText: SnLang[]) => {
        return {
            type: 'SnLoopNode',
            custom: {
                taskKey: 'TaskLoop'
            },
            displayName,
            icon: 'fa-solid fa-rotate-left',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                displayName: finishText,
                direction: 'out',
                params: [],
            }, {
                key: 'next',
                direction: 'out',
                displayName: nextText,
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: ['string', 'number', 'date', 'time', 'object', 'datetime', 'boolean', 'so:', 'sys:'],
                    dynamic: true,
                    multiple: false,
                    pluggable: true,
                    display: 'key-edit'
                }],
            }],
            params: [{
                key: 'forEach',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-FOREACH',
                pluggable: true,
                required: true,
                display: 'input',
                default: true,
            },
            {
                key: 'count',
                direction: 'in',
                types: 'number',
                displayName: 'SN-LOOP-COUNT',
                multiple: false,
                pluggable: true,
                display: 'input',
                required: false,
            },
            {
                key: 'items',
                direction: 'in',
                displayName: 'SN-ITEMS-MODE',
                types: ['string', 'number', 'date', 'time', 'object',  'datetime', 'boolean', 'so:', 'sys:'],
                dynamic: true,
                multiple: true,
                pluggable: true,
                required: false,
            }],
            sections: [],
        };
    };
