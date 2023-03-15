import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SERVICE_SMARTOBJECTV2_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnServiceSmartObjectV2Node',
            displayName,
            icon: 'fa-solid fa-cubes',
            custom: {
                service: {
                    execute: 'start',
                    type: 'POST',
                    key: 'search-smart-objects',
                    route: '{{SERVER}}/search/smart-objects?search={{search}}&skip={{skip}}&limit={{limit}}',
                    body: null,
                    params: [
                        {
                            key: 'modelKey',
                            type: 'request-body'
                        }, {
                            key: 'filter',
                            type: 'request-body'
                        }, {
                            key: 'order',
                            type: 'request-body'
                        }, {
                            key: 'searchParameters',
                            type: 'request-body'
                        }, {
                            key: 'skip',
                            type: 'url-segment'
                        }, {
                            key: 'limit',
                            type: 'url-segment'
                        }, {
                            key: 'search',
                            type: 'url-segment'
                        }
                    ],
                    mappedParams: [
                        {
                            key: 'skip',
                            value: 'skip'
                        }, {
                            key: 'limit',
                            value: 'limit'
                        }, {
                            key: 'search',
                            value: 'search'
                        }
                    ],
                    header: [],
                }
            },
            flows: [],
            params: [
                {
                    direction: 'out',
                    key: 'result',
                    types: 'so:',
                    dynamic: true,
                    multiple: true,
                    pluggable: true,
                    master: true,
                    displayName: 'SN-SERVICE-SMART-OBJECT-RESULT',
                },
                {
                    key: 'modelKey',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-SERVICE-SMART-OBJECT-MODEL',
                    pluggable: false,
                    display: 'select',
                    required: true,
                },
                {
                    key: 'searchParameters',
                    direction: 'in',
                    types: 'sys:query',
                    multiple: false,
                    displayName: 'SN-SERVICE-SMART-OBJECT-SEARCH-PARAMETERS',
                    pluggable: true,
                    required: false,
                },
                {
                    key: 'search',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-SERVICE-SMART-OBJECT-SEARCH',
                    pluggable: true,
                    display: 'input',
                    required: false,
                }
            ],
            sections: [{
                    key: 'filter',
                    displayName: 'SN-SERVICE-SMART-OBJECT-FILTER',
                    editable: true,
                    open: true,
                    params: [],
                },
                {
                    key: 'order',
                    displayName: 'SN-SERVICE-SMART-OBJECT-ORDER-PROPERTY',
                    editable: true,
                    open: true,
                    params: [],
                }, {
                    key: 'pagination',
                    displayName: 'SN-SERVICE-SMART-OBJECT-PAGINATION',
                    editable: false,
                    open: false,
                    params: [
                        {
                            key: 'skip',
                            direction: 'in',
                            types: 'number',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-PAGE',
                            pluggable: true,
                            display: 'input'
                        }, {
                            key: 'limit',
                            direction: 'in',
                            types: 'number',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-LIMIT',
                            pluggable: true,
                            display: 'input'
                        }
                    ]
                }
            ]
        });
