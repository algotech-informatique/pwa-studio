import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_EDITION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentEditionNode',
            custom: {
                taskKey: 'TaskEditDocument'
            },
            displayName: displayName,
            icon: 'fa-solid fa-marker',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: false,
                params: []
            }],
            params: [{
                key: 'objectLinked',
                direction: 'in',
                types: 'sk:atDocument',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }, {
                key: 'document',
                direction: 'in',
                types: 'sys:file',
                displayName: 'SN-DOCUMENT-EDITION-DOCUMENT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: [{
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
