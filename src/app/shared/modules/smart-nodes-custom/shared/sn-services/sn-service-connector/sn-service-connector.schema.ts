import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';


export const SN_SERVICE_CONNECTOR_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnServiceConnectorNode',
            displayName,
            icon: 'fa-solid fa-bolt-lightning',
            custom: {
                service: {
                    execute: 'start',
                    type: 'POST',
                    key: 'connector',
                    route: '{{SERVER}}/smartflows/startsmartflows',
                    body: null,
                    params: [
                        {
                            key: 'key',
                            type: 'request-body'
                        }, {
                            key: 'inputs',
                            type: 'request-body'
                        }
                    ],
                    header: [],
                }
            },
            flows: [],
            params: [{
                direction: 'out',
                key: 'result',
                types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:', 'object'],
                dynamic: true,
                pluggable: true,
                master: true,
                displayName: 'SN-SERVICE-SMART-OBJECT-RESULT',
            }, {
                key: 'key',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-CONNECTOR-SMARTFLOW',
                pluggable: false,
                display: 'select',
                required: true,
            }],
            sections: [{
                key: 'inputs',
                displayName: 'SN-CONNECTOR-INPUTS',
                open: true,
                editable: true,
                params: [],
            }]
        });
