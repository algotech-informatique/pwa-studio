import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_LIST_NODE_SCHEMA: (displayName: SnLang[], nameExit: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], nameExit: SnLang[]) => {
        return {
            type: 'SnListNode',
            custom: {
                taskKey: 'TaskList'
            },
            displayName: displayName,
            icon: 'fa-solid fa-bars',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'select',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'so:',
                    dynamic: true,
                    pluggable: true,
                    display: 'key-edit',
                }]
            }, {
                key: 'done',
                direction: 'out',
                displayName: nameExit,
                params: []
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
                key: 'items',
                direction: 'in',
                types: ['so:', 'sys:user', 'sys:location', 'sys:schedule', 'sys:workflow'],
                displayName: 'SN-LIST-ITEMS',
                pluggable: true,
                required: true,
                multiple: true,
            }, {
                key: 'columnsDisplay',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-LIST-ITEMS-DISPLAYED-PROPERTIES',
                pluggable: false,
                display: 'select',
                default: [],
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'multipleSelection',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-MULTIPLE-SELECTION',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }, {
                    key: 'pagination',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-PAGINATE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true
                }]
            }, {
                key: 'searchMode',
                displayName: 'SN-NODE-SEARCH',
                editable: false,
                open: false,
                params: [{
                    key: 'search',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-SEARCH-VISIBLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }, {
                    key: 'searchValue',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-LIST-SEARCH-DEFAULT-VALUE',
                    pluggable: true,
                    display: 'input',
                    default: '',
                }]
            }, {
                key: 'mode',
                displayName: 'SN-LIST-MODE',
                editable: false,
                open: false,
                params: [{
                    key: 'cart',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-CART-ENABLED',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true
                }, {
                    key: 'loop',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-LOOP-MODE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }, {
                key: 'filter',
                displayName: 'SN-LIST-FILTER',
                editable: false,
                open: false,
                params: [{
                    key: 'filterProperty',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-LIST-FILTER-PROPERTY',
                    pluggable: false,
                    display: 'select',
                }, {
                    key: 'filterActive',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-LIST-ACTIVE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: true
                }, {
                    key: 'excludeObjects',
                    direction: 'in',
                    types: 'so:',
                    displayName: 'SN-LIST-EXCLUDE-OBJECTS',
                    pluggable: true,
                }]
            }],
        };
    };
