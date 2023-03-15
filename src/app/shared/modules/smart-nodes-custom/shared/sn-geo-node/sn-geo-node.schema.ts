import { SnNodeSchema } from '../../../smart-nodes/dto';

export const SN_GEO_NODE_SCHEMA: SnNodeSchema = {
    type: 'SnGeoNode' ,
    displayName: 'SN-GEO-NODE',
    icon: 'fa-solid fa-earth-europe',
    flows: [],
    params: [{
        direction: 'out',
        key: 'result',
        types: 'sys:location',
        multiple: false,
        pluggable: true,
        master: true,
        displayName: 'SN-LOCATION',
    }, {
        key: 'layer',
        direction: 'in',
        types: 'string',
        multiple: false,
        displayName: 'SN-LAYER',
        display: 'select',
        pluggable: false,
    }],
    sections: [
        {
            key: 'coordinates',
            displayName: 'SN-COORDINATE',
            open: true,
            editable: false,
            params: [
                {
                    key: 'latitude',
                    direction: 'in',
                    types: 'number',
                    multiple: false,
                    master: false,
                    displayName: 'SN-LATITUDE',
                    display: 'input',
                    pluggable: true,
                }, {
                    key: 'longitude',
                    direction: 'in',
                    types: 'number',
                    multiple: false,
                    master: false,
                    displayName: 'SN-LONGITUDE',
                    display: 'input',
                    pluggable: true,
                }
            ]
        }
    ],
};
