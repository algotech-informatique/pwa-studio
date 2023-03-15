import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_VIEWER_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentViewerNode',
            custom: {
                taskKey: 'TaskFileViewer'
            },
            displayName: displayName,
            icon: 'fa-solid fa-folder-open',
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
                key: 'title',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-TITLE',
                pluggable: true,
                display: 'input',
            }, {
                key: 'files',
                direction: 'in',
                types: ['sk:atDocument', 'sys:file'],
                displayName: 'SN-DOCUMENT-VIEWER-DOCUMENT',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'fileNameVisible',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-VIEWER-FILE-NAME-VISIBLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }, {
                key: 'annotation',
                displayName: 'SN-DOCUMENT-VIEWER-ANNOTATION',
                editable: false,
                open: true,
                params: [{
                    key: 'activateAnnotation',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-VIEWER-ACTIVATE-ANNOTATION',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }],
        };
    };
