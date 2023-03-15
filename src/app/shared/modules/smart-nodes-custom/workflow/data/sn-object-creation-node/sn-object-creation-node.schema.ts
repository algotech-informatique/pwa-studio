import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_CREATION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnObjectCreationNode',
            custom: {
                taskKey: 'TaskObjectCreate'
            },
            displayName: displayName,
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
                    types: 'so:',
                    dynamic: true,
                    multiple: false,
                    pluggable: true,
                    display: 'key-edit'
                }, {
                    key: 'placeToSave',
                    displayName: 'SN-NODE-PLACE-TO-SAVE',
                    direction: 'in',
                    types: 'so:',
                    multiple: true,
                    pluggable: true,
                }]
            }],
            params: [{
                key: 'smartModel',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-SMART-MODEL',
                pluggable: false,
                display: 'select',
                required: true,
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
            }],
        };
    };
