import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_TRANSFORM_NODE_SCHEMA: (displayName: string ) => SnNodeSchema =
    (displayName: string ) => {
        return {
            type: 'SnTransformNode',
            displayName,
            key: 'transform',
            icon: 'fa-solid fa-cube',
            flows: [],
            params: [{
                key: 'query-result',
                direction: 'in',
                displayName: 'SN-QUERY-RESULT',
                types: 'object',
                multiple: false,
                master: true,
                pluggable: true,
                display: 'input',
            }],
            sections: [{
                key: 'mapped-fields',
                displayName: 'SN-TRANSFORM-MAPPED-FIELDS',
                open: true,
                editable: true,
                params: [],
            }],
        };
    };
