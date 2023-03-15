import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_INPUT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnInputNode',
            custom: {
                taskKey: 'TaskInputCapture'
            },
            displayName: displayName,
            icon: 'fa-solid fa-pencil-alt',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'string',
                    multiple: false,
                    pluggable: true,
                    display: 'key-edit'
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
                key: 'entryField',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-ENTRY-FIELD',
                pluggable: true,
                display: 'input',
            }],
            sections: [],
        };
    };
