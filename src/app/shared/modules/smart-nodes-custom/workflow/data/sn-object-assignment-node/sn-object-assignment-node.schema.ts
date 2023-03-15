import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_ASSIGNMENT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnObjectAssignmentNode',
            custom: {
                taskKey: 'TaskAssignObject'
            },
            displayName: displayName,
            icon: 'fa-solid fa-bullseye',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [{
                key: 'object',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECT(S)',
                pluggable: true,
                required: true,
            }, {
                key: 'smartModel',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-OBJECT-ASSIGNMENT-SMART-MODEL',
                pluggable: false,
                display: 'select',
                required: false,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                open: true,
                editable: true,
                params: [],
            }, {
                key: 'skills',
                displayName: 'SN-OBJECT-ASSIGNMENT-SKILLS',
                open: true,
                editable: true,
                params: [],
            }, {
                key: 'advance',
                displayName: 'SN-NODE-ADVANCE',
                open: false,
                editable: false,
                params: [{
                    key: 'cumul',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-OBJECT-ASSIGNMENT-CUMUL',
                    pluggable: true,
                    required: true,
                    default: true,
                    display: 'input',
                }],
            }],
        };
    };
