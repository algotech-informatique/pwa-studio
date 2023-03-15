import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';


export const SN_LAYER_METADATA_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnLayerMetadataNode',
            custom: {
                taskKey: 'TaskLayerMetadata'
            },
            displayName,
            key: 'layer-metadata',
            icon: 'fa-solid fa-th',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [{
                key: 'location',
                direction: 'in',
                displayName: 'SN-METADATA-INPUT-OBJECT',
                types: ['sys:location', 'sys:file', 'sk:atGeolocation'],
                multiple: false,
                master: false,
                pluggable: true,
            }, {
                key: 'type',
                direction: 'in',
                types: 'string',
                displayName: 'SN-METADATA-TYPE',
                pluggable: false,
                display: 'input',
                required: true,
                value: '',
            }],
            sections: [{
                key: 'results',
                displayName: 'SN-METADATA-MAPPED-FIELDS',
                open: true,
                editable: true,
                params: [],
            }],
        };
    };
