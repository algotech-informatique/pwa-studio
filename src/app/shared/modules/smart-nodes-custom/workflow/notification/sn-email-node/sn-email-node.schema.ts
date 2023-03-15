import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_EMAIL_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) =>
        ({
            type: 'SnEmailNode',
            custom: {
                taskKey: 'TaskEmail'
            },
            displayName,
            icon: 'fa-solid fa-envelope',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'send',
                direction: 'out',
                paramsEditable: false,
                params: []
            }],
            params: [{
                key: 'direct',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-EMAIL-DIRECT',
                pluggable: true,
                required: true,
                display: 'input',
                default: false
            }, {
                key: 'profiles',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-EMAIL-TO',
                pluggable: false,
                display: 'select',
                required: false,
            }, {
                key: 'adress',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-EMAIL-TO',
                pluggable: true,
                display: 'input',
                required: false,
            }],
            sections: [{
                key: 'email',
                editable: false,
                displayName: 'SN-EMAIL-EMAIL',
                open: true,
                params: [{
                    key: 'subject',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-EMAIL-SUBJECT',
                    pluggable: true,
                    display: 'input',
                    required: true,
                }, {
                    key: 'body',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-EMAIL-BODY',
                    pluggable: true,
                    display: 'input',
                    required: false,
                }, {
                    key: 'html',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'HTML',
                    pluggable: true,
                    required: false,
                    default: true,
                    display: 'input',
                }, {
                    key: 'linkedFiles',
                    direction: 'in',
                    types: 'sys:file',
                    displayName: 'SN-EMAIL-LINKED-FILES',
                    pluggable: true,
                    required: false,
                }]
            }],
        });
