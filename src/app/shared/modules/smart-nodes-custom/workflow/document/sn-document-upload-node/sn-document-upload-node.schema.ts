import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_UPLOAD_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentUploadNode',
            custom: {
                taskKey: 'TaskUpload'
            },
            displayName: displayName,
            icon: 'fa-solid fa-cloud-arrow-up',
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
                key: 'documents',
                direction: 'in',
                types: 'sk:atDocument',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'multiple',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-UPLOAD-MULTIPLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }, {
                key: 'version',
                displayName: 'SN-NODE-SAVE',
                editable: false,
                open: false,
                params: [{
                    key: 'version',
                    direction: 'in',
                    types: 'sys:file',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-UPLOAD-VERSION',
                    pluggable: true,
                    required: false,
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
                }]
            }, {
                key: 'metadatas',
                displayName: 'SN-NODE-METADATAS',
                editable: false,
                open: false,
                params: [{
                    key: 'activeMetadata',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-NODE-METADATAS-ACTIVEMETADATA',
                    pluggable: true,
                    display: 'input',
                    required: true,
                    default: false,
                }]
            }],
        };
    };
