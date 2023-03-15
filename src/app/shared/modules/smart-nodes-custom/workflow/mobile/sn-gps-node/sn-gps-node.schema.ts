import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_GPS_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnGpsNode',
            custom: {
                taskKey: 'TaskSiteLocation'
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
            params: [{
                key: 'title',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NODE-TITLE',
                pluggable: true,
                display: 'input',
            }, {
                key: 'objectLinked',
                direction: 'in',
                types: 'sk:atGeolocation',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'launchGPS',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-GPS-LAUNCH',
                    pluggable: true,
                    display: 'input',
                }]
            }],
        };
    };
