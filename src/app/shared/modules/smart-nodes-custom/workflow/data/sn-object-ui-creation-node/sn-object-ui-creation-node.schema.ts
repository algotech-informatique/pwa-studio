import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_UI_CREATION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnObjectUICreationNode',
            custom: {
                taskKey: 'TaskObjectCreateUI'
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
                key: 'title',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-TITLE',
                pluggable: true,
                display: 'input',
            }, {
                key: 'skills',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-OBJECT-UI-CREATION-SKILLS',
                pluggable: false,
                display: 'select',
                required: true,
            }],
            sections: [],
        };
    };
