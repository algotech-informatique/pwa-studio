import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_JSON_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnJsonNode' ,
    displayName: 'SN-JSON-NODE',
    icon: 'fa-solid fa-file-code',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: 'object',
        multiple: false,
        pluggable: true,
        master: true,
        displayName: 'SN-JSON-RESULT',
    }],
    sections: [
        {
            key: 'sources',
            displayName: 'SN-SOURCES',
            open: true,
            editable: true,
            params: [],
        },
        {
            key: 'json',
            displayName: 'SN-JSON-EDIT',
            open: true,
            editable: false,
            params: [],
            hidden: true,
        }
    ],
};
