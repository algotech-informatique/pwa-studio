import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_DELETION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentDeletionNode',
            custom: {
                taskKey: 'TaskDeleteDocument'
            },
            displayName: displayName,
            icon: 'fa-solid fa-trash',
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
                key: 'documents',
                direction: 'in',
                types: 'sys:file',
                displayName: 'SN-DOCUMENT-DELETION-DOCUMENTS',
                pluggable: true,
                required: true,
            }],
            sections: [],
        };
    };
