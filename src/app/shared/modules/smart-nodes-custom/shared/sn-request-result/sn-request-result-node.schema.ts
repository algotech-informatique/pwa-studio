import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_REQUEST_RESULT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            displayName,
            type: 'SnRequestResultNode',
            custom: {
                taskKey: 'TaskRequestResult'
            },
            icon: 'fa-solid fa-keyboard',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: false,
                params: [{
                    key: 'result',
                    displayName: 'SN-ARRAY-RESULT',
                    direction: 'out',
                    types: 'object',
                    dynamic: true,
                    master: false,
                    pluggable: true,
                }, {
                    key: 'status',
                    direction: 'out',
                    types: 'number',
                    pluggable: false,
                }]
            }],
            params: [{
                key: 'inputs',
                direction: 'in',
                types:  ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:', 'object'],
                master: true,
                displayName: 'SN-DATA',
                pluggable: true,
            }, {
                key: 'code',
                direction: 'in',
                types: 'number',
                displayName: 'SN-RESPONSE-CODE',
                pluggable: true,
                required: true,
                display: 'input',
                default: 200
            }, {
                key: 'format',
                direction: 'in',
                types: 'string',
                multiple: false,
                master: false,
                displayName: 'SN-DATA-FORMAT',
                display: 'select',
                pluggable: false,
                default: 'smartObject'
            }],
            sections: [],
    });
