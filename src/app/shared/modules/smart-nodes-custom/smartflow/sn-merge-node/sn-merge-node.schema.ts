import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_MERGEV2_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            displayName,
            type: 'SnMergeV2Node',
            custom: {
                taskKey: 'TaskMergeV2'
            },
            icon: 'fa-solid fa-code-merge',
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
                    master: false,
                    multiple: true,
                    pluggable: true,
                    display: 'key-edit',
                },
                {
                    direction: 'out',
                    types: 'so:*',
                    dynamic: true,
                    master: false,
                    multiple: true,
                    pluggable: true,
                    display: 'key-edit',
                }]
            }],
            params: [{
                key: 'smartModel',
                direction: 'in',
                types: 'string',
                multiple: false,
                master: false,
                displayName: 'SMARTMODEL',
                display: 'select',
                pluggable: false,
                required: true,
            }, {
                key: 'array',
                direction: 'in',
                types: 'so:*',
                master: false,
                displayName: 'SN-MERGE-ARRAY',
                display: 'input',
                multiple: true,
                pluggable: true,
                required: true,
            }, {
                key: 'propType',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-MERGE-REFERENCE',
                pluggable: true,
                display: 'select',
                required: true,
            }, {
                key: 'propToMerge',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-MERGE-PROP-TO-MERGE',
                pluggable: false,
                display: 'select',
                required: true,
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
