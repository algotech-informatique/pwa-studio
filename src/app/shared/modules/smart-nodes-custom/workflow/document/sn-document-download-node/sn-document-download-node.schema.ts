import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_DOWNLOAD_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnDocumentDownloadNode',
            custom: {
                taskKey: 'TaskDownload'
            },
            displayName: displayName,
            icon: 'fa-solid fa-file-arrow-down',
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
                key: 'file',
                direction: 'in',
                types: 'sys:file',
                displayName: 'SN-DOCUMENT-DOWNLOAD-FILE',
                pluggable: true,
                required: true,
                multiple: false,
            }, {
                key: 'openFile',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-DOCUMENT-DOWNLOAD-OPEN-FILE',
                pluggable: true,
                required: true,
                display: 'input',
                default: false
            }],
            sections: [{
                key: 'advance',
                displayName: 'SN-NODE-ADVANCE',
                editable: false,
                open: false,
                params: [{
                    key: 'synchronous',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-DOWNLOAD-SYNCHRONOUS',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }],
        };
    };
