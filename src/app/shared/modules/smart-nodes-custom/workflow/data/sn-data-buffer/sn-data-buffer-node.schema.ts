import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DATA_BUFFER_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDataBufferNode',
            custom: {
                taskKey: 'TaskDataBuffer'
            },
            displayName,
            icon: 'fa-solid fa-sd-card',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'any',
                    dynamic: true,
                    multiple: true,
                    pluggable: true,
                    display: 'key-edit'
                }],
            }],
            params: [{
                key: 'data',
                direction: 'in',
                displayName: 'SN-DATA-BUFFER-DATA',
                types: ['string', 'number', 'date', 'time', 'object', 'datetime', 'boolean', 'so:', 'sys:'],
                dynamic: true,
                pluggable: true,
                required: false,
            }, {
                key: 'cumul',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-DATA-BUFFER-CUMUL',
                pluggable: true,
                required: true,
                default: false,
                display: 'input',
            }],
            sections: [],
        };
    };
