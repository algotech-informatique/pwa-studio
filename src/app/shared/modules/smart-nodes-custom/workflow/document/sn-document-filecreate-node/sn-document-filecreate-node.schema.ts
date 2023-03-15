import { SnLang } from '../../../../smart-nodes';
import { SnNodeSchema } from '../../../../smart-nodes/dto';

export const SN_DOCUMENT_FILECREATE_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        const schema: SnNodeSchema = {
            type: 'SnDocumentFileCreateNode',
            custom: {
                taskKey: 'TaskDocumentFileCreate'
            },
            displayName,
            icon: 'fa-solid fa-file-circle-plus',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [
                    {
                        direction: 'out',
                        types: 'sys:file',
                        pluggable: true,
                        display: 'key-edit',
                        multiple: false,
                    }
                ]
            }],
            params: [],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                open: true,
                editable: false,
                params: [{
                    key: 'body',
                    direction: 'in',
                    types: ['string', 'object'],
                    pluggable: true,
                    displayName: 'SN-DOCUMENT-FILECREATE-BODY',
                    required: true,
                },
                {
                    key: 'fileName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-FILENAME',
                    pluggable: true,
                    display: 'input',
                    required: true,
                    default: 'file.txt'
                },{
                    key: 'ext',
                    direction: 'in',
                    types: 'string',
                    pluggable: true,
                    displayName: 'SN-DOCUMENT-FILECREATE-EXT',
                    display: 'input',
                    default: '',
                },
                {
                    key: 'download',
                    direction: 'in',
                    types: 'boolean',
                    dynamic: true,
                    multiple: false,
                    displayName: 'SN-DOCUMENT-OPEN',
                    pluggable: true,
                    required: false,
                    display: 'input',
                    default: false
                }],
             }, {
                key: 'save',
                displayName: 'SN-NODE-SAVE',
                editable: false,
                open: true,
                params: [{
                    key: 'save',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-SAVE',
                    pluggable: true,
                    required: false,
                    display: 'input',
                    default: false
                }, {
                    key: 'object',
                    direction: 'in',
                    types: 'sk:atDocument',
                    displayName: 'SN-NODE-OBJECT',
                    pluggable: true,
                    required: false,
                    multiple: false,
                }, {
                    key: 'version',
                    direction: 'in',
                    types: 'sys:file',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-VERSION',
                    pluggable: true,
                    required: false,
                }]
            }]
        };
        return schema;
    };
