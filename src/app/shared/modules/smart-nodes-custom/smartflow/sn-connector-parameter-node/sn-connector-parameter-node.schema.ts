import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_CONNECTOR_PARAMETER_NODE_SCHEMA: (key: string) => SnNodeSchema = (key: string) => {
        return {
            type: 'SnConnectorParameterNode',
            key: key,
            displayName: 'SN-CONNECTOR-PARAMETER',
            icon: 'fa-solid fa-terminal',
            flows: [],
            params: [{
                direction: 'out',
                key: key,
                types: 'string',
                multiple: false,
                master: true,
                pluggable: true,
            }],
            sections: [],
        };
    };
