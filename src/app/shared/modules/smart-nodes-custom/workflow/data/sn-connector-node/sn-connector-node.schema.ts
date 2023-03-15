import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_CONNECTOR_NODE_SCHEMA: (displayName: SnLang[], nameDone: SnLang[], nameError: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], nameDone: SnLang[], nameError: SnLang[]) => ({
            type: 'SnConnectorNode',
            custom: {
                taskKey: 'TaskConnector'
            },
            displayName,
            icon: 'fa-solid fa-atom',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                displayName: nameDone,
                params: [{
                    direction: 'out',
                    types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:', 'object'],
                    dynamic: true,
                    pluggable: true,
                    display: 'key-edit'
                }]
            }, {
                key: 'error',
                direction: 'out',
                paramsEditable: true,
                displayName: nameError,
                params: [{
                    direction: 'out',
                    types: 'number',
                    pluggable: true,
                    display: 'key-edit',
                }, {
                    direction: 'out',
                    types: ['string', 'object'],
                    pluggable: true,
                    display: 'key-edit',
                }]
            }],
            params: [{
                key: 'smartFlow',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-CONNECTOR-SMARTFLOW',
                pluggable: false,
                display: 'select',
                required: true,
            }, {
                key: 'runOutside',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-CONNECTOR-RUN-OUTSIDE',
                pluggable: true,
                required: true,
                display: 'input',
                default: false
            }],
            sections: [{
                key: 'inputs',
                displayName: 'SN-CONNECTOR-INPUTS',
                open: true,
                editable: true,
                params: [],
            }]
        });
