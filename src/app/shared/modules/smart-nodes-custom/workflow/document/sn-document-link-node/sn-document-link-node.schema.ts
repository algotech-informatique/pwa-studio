import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_LINK_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentLinkNode',
            custom: {
                taskKey: 'TaskListLinkDoc'
            },
            displayName: displayName,
            icon: 'fa-solid fa-rectangle-list',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:file',
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
                key: 'items',
                direction: 'in',
                types: 'sk:atDocument',
                displayName: 'SN-DOCUMENT-LINK-ITEMS',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'multipleSelection',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-LINK-MULTIPLE-SELECTION',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }, {
                    key: 'search',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-LINK-SEARCH-VISIBLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }, {
                key: 'mode',
                displayName: 'SN-LIST-MODE',
                editable: false,
                open: false,
                params: [{
                    key: 'cart',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-LINK-CART-ENABLED',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true
                }]
            }]
        };
    };
