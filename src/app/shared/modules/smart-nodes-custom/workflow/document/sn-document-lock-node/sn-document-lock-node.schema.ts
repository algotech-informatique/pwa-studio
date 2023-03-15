import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_LOCK_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentLockNode',
            custom: {
                taskKey: 'TaskLockDocument'
            },
            displayName: displayName,
            icon: 'fa-solid fa-lock',
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
                displayName: 'SN-DOCUMENT-LOCK-DOCUMENTS',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'locked',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-LOCK-LOCK',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true
                }]
            }]
        };
    };
