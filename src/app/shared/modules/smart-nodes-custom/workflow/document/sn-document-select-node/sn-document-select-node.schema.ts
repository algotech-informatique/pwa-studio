import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_SELECT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentSelectNode',
            custom: {
                taskKey: 'TaskDocumentSelect'
            },
            displayName: displayName,
            icon: 'fa-solid fa-square-check',
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
                    multiple: false,
                    display: 'key-edit',
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
                key: 'documents',
                direction: 'in',
                types: ['sk:atDocument', 'sys:file'],
                displayName: 'SN-DOCUMENT-LIST-DOCUMENT',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'search',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-LIST-SEARCH-VISIBLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }, {
                    key: 'multiple',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-MULTIPLE-SELECTION',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                }]
            }]
        };
    };
