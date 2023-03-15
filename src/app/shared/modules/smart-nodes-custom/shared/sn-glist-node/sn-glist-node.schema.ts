import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_GLIST_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnGListNode' ,
    displayName: 'SN-GLIST-NODE',
    icon: 'fa-solid fa-list',
    flows: [],
    params: [
        {
            direction: 'out',
            key: 'result',
            dynamic: false,
            types: 'sys:glistvalue',
            master: true,
            multiple: true,
            pluggable: true,
            displayName: 'SN-GLIST-NODE',
        },
        {
            key: 'selectedglist',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-SELECT-GLIST',
            pluggable: true,
            display: 'select',
            required: true,
        }
    ],
    sections: [],
};

