import { SnLang } from '../../../../smart-nodes';
import { SnNodeSchema } from '../../../../smart-nodes/dto';

export const SN_DOCUMENT_FILEZIP_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        const schema:SnNodeSchema = {
            type: 'SnDocumentFileZipNode',
            custom: {
                taskKey: 'TaskDocumentFileZip'
            },
            displayName: displayName,
            icon: 'fa-solid fa-file-zipper',
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
                    key: 'documents',
                    direction: 'in',
                    types: ['sk:atDocument', 'sys:file'],
                    pluggable: true,
                    displayName: 'SN-DOCUMENT-FILEZIP-ENTRY-ARRAY',
                    required: true,
                },
                {
                    key: 'fileName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-FILEZIP-NAME',
                    pluggable: true,
                    display: 'input',
                    required: false,
                },
                {
                    key: 'download',
                    direction: 'in',
                    types: 'boolean',
                    dynamic: true,
                    multiple: false,
                    displayName: 'SN-DOCUMENT-FILEZIP-DOWNLOAD',
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
                    displayName: 'SN-DOCUMENT-FILEZIP-SAVE',
                    pluggable: true,
                    required: false,
                    display: 'input',
                    default: false
                }, {
                    key: 'object',
                    direction: 'in',
                    types: 'sk:atDocument',
                    displayName: 'SN-DOCUMENT-FILEZIP-OBJECT',
                    pluggable: true,
                    required: false,
                    multiple: false,
                }, {
                    key: 'version',
                    direction: 'in',
                    types: 'sys:file',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-FILEZIP-VERSION',
                    pluggable: true,
                    required: false,
                }]
            }]
        }
        return schema;
    };
