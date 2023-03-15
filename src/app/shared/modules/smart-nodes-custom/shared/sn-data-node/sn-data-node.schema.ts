import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_DATA_NODE_SCHEMA: (data: { id: string; key: string; displayName: string; type: string; multiple: boolean }) =>
     SnNodeSchema =
    (data: { id: string; key: string; displayName: string; type: string; multiple: boolean }) => ({
        type: 'SnDataNode',
        key: data.id,
        displayName: data.displayName,
        icon: 'fa-solid fa-terminal',
        flows: [],
        params: [{
            direction: 'out',
            key: data.key,
            types: data.type,
            multiple: data.multiple,
            pluggable: true,
            master: true,
        }],
        sections: [{
            key: 'properties',
            displayName: 'SN-NODE-PROPERTIES',
            open: true,
            editable: true,
            params: [],
        }],
    });
