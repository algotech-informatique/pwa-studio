import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_MAGNET_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnMagnetNode' ,
    displayName: 'SN-MAGNET-NODE',
    icon: 'fa-solid fa-magnet',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: 'sys:magnet',
        multiple: false,
        pluggable: true,
        master: true,
        displayName: 'SN-MAGNET',
    }, {
        key: 'application',
        direction: 'in',
        types: 'string',
        required: true,
        multiple: false,
        displayName: 'WORKFLOW.TASK.MAGNET.APP',
        display: 'select',
        pluggable: false,
    }, {
        key: 'zone',
        direction: 'in',
        types: 'string',
        required: true,
        multiple: false,
        displayName: 'WORKFLOW.TASK.MAGNET.ZONE',
        display: 'select',
        pluggable: true,
    }, {
        key: 'boardInstance',
        direction: 'in',
        types: 'string',
        required: false,
        multiple: false,
        displayName: 'WORKFLOW.TASK.MAGNET.BOARD-INSTANCE',
        display: 'input',
        pluggable: true,
    }, {
        key: 'placement',
        direction: 'in',
        types: 'string',
        required: true,
        multiple: false,
        displayName: 'SN-MAGNET-PLACEMENT',
        display: 'select',
        pluggable: false,
        default: 'automatic'
    }],
    sections: [
        {
            key: 'coordinates',
            displayName: 'SN-COORDINATE',
            open: true,
            editable: false,
            params: [
                {
                    key: 'x',
                    direction: 'in',
                    types: 'number',
                    multiple: false,
                    master: false,
                    displayName: 'X',
                    display: 'input',
                    pluggable: true,
                    default: 0
                }, {
                    key: 'y',
                    direction: 'in',
                    types: 'number',
                    multiple: false,
                    master: false,
                    displayName: 'Y',
                    display: 'input',
                    pluggable: true,
                    default: 0
                }
            ]
        }
    ],
};
