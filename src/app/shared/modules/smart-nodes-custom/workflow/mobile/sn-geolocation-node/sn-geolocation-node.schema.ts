import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_GEOLOCATION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnGeolocationNode',
            custom: {
                taskKey: 'TaskGeolocation'
            },
            displayName: displayName,
            icon: 'fa-solid fa-location-dot',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:location',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false
                }]
            }],
            params: [],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'geoObjects',
                    direction: 'in',
                    types: 'sk:atGeolocation',
                    displayName: 'SN-GEOLOCATION-GEO-OBJECT',
                    pluggable: true,
                    required: false,
                }, {
                    key: 'timeout',
                    direction: 'in',
                    types: 'number',
                    displayName: 'SN-GEOLOCATION-TIMEOUT',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: 30000,
                }, {
                    key: 'highAccuracy',
                    direction: 'in',
                    types: 'boolean',
                    displayName: 'SN-GEOLOCATION-HIGH-ACCURACY',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true,
                }, {
                    key: 'waitingMessage',
                    direction: 'in',
                    types: 'string',
                    displayName: 'SN-GEOLOCATION-WAITING-MESSAGE',
                    pluggable: true,
                    display: 'input',
                }]
            }],
        });
