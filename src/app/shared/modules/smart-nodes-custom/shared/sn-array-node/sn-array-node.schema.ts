import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_ARRAY_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnArrayNode' ,
    displayName: 'SN-ARRAY-DATA',
    icon: 'fa-solid fa-layer-group',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:'],
        dynamic: true,
        multiple: true,
        pluggable: true,
        master: true,
        displayName: 'SN-ARRAY-RESULT',
    }],
    sections: [{
        key: 'items',
        displayName: 'SN-ARRAY-ITEMS',
        open: true,
        editable: true,
        params: [],
    }],
};
