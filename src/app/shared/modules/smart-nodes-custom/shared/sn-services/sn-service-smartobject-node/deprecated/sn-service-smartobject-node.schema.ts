import { SnNodeSchema } from '../../../../../smart-nodes/dto';
import { SnLang } from '../../../../../smart-nodes/models';

export const SN_SERVICE_SMARTOBJECT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            deprecated: true,
            type: 'SnServiceSmartObjectNode',
            displayName,
            icon: 'fa-solid fa-cubes',
            custom: {
                service: {
                    execute: 'start',
                    type: 'GET',
                    key: 'search-smart-objects',
                    route: '{{SERVER}}/smart-objects/search/{{modelKey}}?property={{filterProperty}}&value={{filterValue}}&defaultOrder={{orderProperty}}&order={{orderDirection}}&skip={{skip}}&limit={{limit}}',
                    body: null,
                    params: [
                        {
                            key: 'modelKey',
                            type: 'url-segment'
                        }, {
                            key: 'filterProperty',
                            type: 'url-segment'
                        }, {
                            key: 'filterValue',
                            type: 'url-segment'
                        }, {
                            key: 'orderProperty',
                            type: 'url-segment'
                        }, {
                            key: 'orderDirection',
                            type: 'url-segment'
                        }, {
                            key: 'skip',
                            type: 'url-segment'
                        }, {
                            key: 'limit',
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
                            value: 'value'
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
                }
            ],
            sections: [
                {
                    key: 'so',
                    displayName: '',
                    editable: false,
                    open: true,
                    params: [
                        {
                            key: 'modelKey',
                            direction: 'in',
                            types: 'string',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-MODEL',
                            pluggable: false,
                            display: 'select',
                            required: true,
                        }
                    ]
                }, {
                    key: 'filter',
                    displayName: 'SN-SERVICE-SMART-OBJECT-FILTER',
                    editable: false,
                    open: false,
                    params: [
                        {
                            key: 'filterProperty',
                            direction: 'in',
                            types: 'string',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-FILTER-PROPERTY',
                            pluggable: false,
                            display: 'select',
                            default: '',
                        }, {
                            key: 'filterValue',
                            direction: 'in',
                            types: 'string',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-FILTER-VALUE',
                            pluggable: true,
                            display: 'input',
                            default: '',
                        }
                    ]
                },
                {
                    key: 'orderItems',
                    displayName: 'SN-SERVICE-SMART-OBJECT-ORDER-PROPERTY',
                    editable: false,
                    open: false,
                    params: [
                        {
                            key: 'orderProperty',
                            direction: 'in',
                            types: 'string',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-FILTER-PROPERTY',
                            pluggable: false,
                            display: 'select',
                            default: '',
                        },
                        {
                            key: 'orderDirection',
                            direction: 'in',
                            types: 'string',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-ORDER-DIRECTION',
                            pluggable: false,
                            display: 'select',
                            default: 'asc',
                        }
                    ]
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
                            display: 'input',
                            default: ''
                        }, {
                            key: 'limit',
                            direction: 'in',
                            types: 'number',
                            multiple: false,
                            displayName: 'SN-SERVICE-SMART-OBJECT-LIMIT',
                            pluggable: true,
                            display: 'input',
                            default: ''
                        }
                    ]
                }
            ]
        });
