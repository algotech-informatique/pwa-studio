import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_QRCODE_NODE_SCHEMA:
    (displayName: SnLang[], doneText: SnLang[], revisionText: SnLang[], timeoutText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], doneText: SnLang[], revisionText: SnLang[], timeoutText: SnLang[]) => {
        return {
            type: 'SnQRCodeNode',
            custom: {
                taskKey: 'TaskQRCodeReader'
            },
            displayName: displayName,
            icon: 'fa-solid fa-barcode',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                displayName: doneText,
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'string',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false
                }]
            }, {
                key: 'revision',
                direction: 'out',
                displayName: revisionText,
                paramsEditable: false,
                params: [],
            }, {
                key: 'timeout',
                displayName: timeoutText,
                direction: 'out',
                paramsEditable: false,
                params: [],
            }],
            params: [{
                key: 'title',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-TITLE',
                pluggable: true,
                display: 'input',
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'timeoutSeconds',
                    direction: 'in',
                    types: 'number',
                    displayName: 'SN-QRCODE-TIMEOUT-VALUE',
                    pluggable: true,
                    required: true,
                    multiple: false,
                    display: 'input',
                    default: 0,
                }]
            }],
        };
    };
