import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_FORM_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnFormNode',
            custom: {
                taskKey: 'TaskForm'
            },
            displayName: displayName,
            icon: 'fa-solid fa-square-poll-horizontal',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [{
                key: 'title',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-TITLE',
                pluggable: true,
                display: 'input',
            }, {
                key: 'object',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }, {
                key: 'smartModel',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-FORM-SMART-MODEL',
                pluggable: false,
                display: 'select',
                required: false,
            }],
            sections: [{
                key: 'options',
                displayName: 'SN-FORM-FIELDS',
                editable: true,
                open: true,
                params: [],
            }, {
                key: 'advance',
                displayName: 'SN-NODE-ADVANCE',
                editable: false,
                open: false,
                params: [{
                    key: 'description',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-FORM-DESCRIPTION',
                    pluggable: true,
                    display: 'input',
                }, {
                    key: 'readOnly',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-FORM-READONLY',
                    pluggable: true,
                    display: 'input',
                }]
            }, {
                key: 'tags',
                displayName: 'SN-NODE-TAGS',
                editable: false,
                open: false,
                params: [{
                    key: 'activeTag',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-NODE-TAGS-ACTIVETAG',
                    pluggable: true,
                    display: 'input',
                    required: true,
                    default: false,
                }, {
                    key: 'modelsTag',
                    direction: 'in',
                    types: 'string',
                    multiple: true,
                    displayName: 'SN-NODE-TAGS-SELECTTAG',
                    pluggable: false,
                    display: 'select',
                }],
            }],
        };
    };
