import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SIGNATURE_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnSignatureNode',
            custom: {
                taskKey: 'TaskSignature'
            },
            displayName: displayName,
            icon: 'fa-solid fa-signature',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:signature',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false
                }]
            }],
            params: [{
                key: 'objectLinked',
                direction: 'in',
                types: 'sk:atSignature',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: [],
        };
    };
