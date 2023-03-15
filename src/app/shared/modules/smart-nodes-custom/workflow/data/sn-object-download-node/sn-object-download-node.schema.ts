import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_DOWNLOAD_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        deprecated: true,
        type: 'SnObjectDownloadNode',
        custom: {
            taskKey: 'TaskObjectDownload'
        },
        displayName,
        icon: 'fa-solid fa-cloud-arrow-down',
        flows: [{
            direction: 'in',
            params: []
        }, {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            params: [{
                direction: 'out',
                types: 'so:',
                dynamic: true,
                pluggable: true,
                display: 'key-edit'
            }]
        }],
        params: [{
            key: 'objects',
            direction: 'in',
            types: 'so:',
            displayName: 'SN-NODE-OBJECT(S)',
            pluggable: true,
            required: true,
        }],
        sections: [{
            key: 'advance',
            displayName: 'SN-NODE-ADVANCE',
            open: false,
            editable: false,
            params: [{
                key: 'first',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-OBJECT-DOWNLOAD-FIRST',
                pluggable: true,
                required: true,
                display: 'input',
                default: false
            }],
        }],
    });
