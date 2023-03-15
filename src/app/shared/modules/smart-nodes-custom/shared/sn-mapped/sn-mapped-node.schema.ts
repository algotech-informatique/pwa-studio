import { trigger } from '@angular/animations';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_MAPPED_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            displayName,
            type: 'SnMappedNode',
            custom: {
                taskKey: 'TaskMapped'
            },
            icon: 'fa-solid fa-cube',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'so:*',
                    dynamic: true,
                    master: true,
                    multiple: true,
                    pluggable: true,
                    display: 'key-edit',
                }]
            }],
            params: [{
                key: 'object',
                direction: 'in',
                types: 'object',
                master: true,
                displayName: 'OBJECT',
                display: 'input',
                pluggable: true,
                multiple: true,
            }, {
                key: 'smartModel',
                direction: 'in',
                types: 'string',
                multiple: false,
                master: false,
                displayName: 'SMARTMODEL',
                display: 'select',
                pluggable: false,
            }, {
                key: 'saveOnApi',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                master: false,
                displayName: 'SN-PARAM.SAVE-ON-API',
                display: 'input',
                pluggable: true,
                default: true,
            }],
            sections: [],
        };
    };
