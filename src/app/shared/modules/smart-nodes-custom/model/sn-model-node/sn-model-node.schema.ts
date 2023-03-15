import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_MODEL_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        type: 'SnModelNode',
        custom: {
            key: null,
            permissions: {
                R: [],
                RW: [],
            },
            skills: {
                atDocument: false,
                atGeolocation: false,
                atSignature: false,
                atTag: false,
                atMagnet: false,
            },
            uniqueKeys: [],
            description: '',
        },
        displayName,
        icon: 'fa-solid fa-cube',
        flows: [],
        params: [{
            master: true,
            direction: 'out',
            types: 'so:*',
            pluggable: true
        }],
        sections: [{
            key: 'fields',
            displayName: 'SN-MODEL-FIELDS',
            open: true,
            editable: true,
            params: [],
        }]
    });
