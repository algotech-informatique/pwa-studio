import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_FILTER_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnObjectFilterNode',
            custom: {
                taskKey: 'TaskObjectFilter'
            },
            displayName: displayName,
            icon: 'fa-solid fa-filter',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'so:',
                    dynamic: true,
                    multiple: true,
                    pluggable: true,
                    display: 'key-edit'
                }]
            }],
            params: [{
                key: 'objects',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECTS',
                multiple: true,
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'filter',
                displayName: 'SN-OBJECT-FILTER-FILTER',
                editable: false,
                open: true,
                params: [{
                    key: 'smartModel',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-NODE-SMART-MODEL',
                    pluggable: false,
                    display: 'select',
                    required: true,
                }, {
                    key: 'filterProperty',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-OBJECT-FILTER-PROPERTY',
                    pluggable: false,
                    display: 'select',
                }, {
                    key: 'filterValue',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-OBJECT-FILTER-VALUE',
                    pluggable: true,
                    display: 'input',
                }]
            }]
        };
    };
