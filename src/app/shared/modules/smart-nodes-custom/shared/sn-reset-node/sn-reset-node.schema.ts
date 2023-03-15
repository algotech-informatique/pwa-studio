import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_RESET_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnResetNode',
    displayName: 'SN-RESET-NODE',
    icon: 'fa-solid fa-repeat',
    flows: [],
    params: [{
        direction: 'out',
        key: 'reset',
        dynamic: false,
        types: 'reset',
        master: true,
        multiple: false,
        pluggable: true,
        default: { reset: true },
        displayName: 'SN-RESET-NODE-RESET',
    }],
    sections: [],
};
