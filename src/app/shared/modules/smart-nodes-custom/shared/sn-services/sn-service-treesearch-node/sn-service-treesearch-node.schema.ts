import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SERVICE_TREESEARCH_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        deprecated: true,
        type: 'SnServiceTreeSearchNode',
        displayName,
        icon: 'fa-solid fa-folder-tree',
        custom: {
            service: {
                execute: 'start',
                type: 'POST',
                key: 'tree-search',
                route: '{{SERVER}}/smart-objects/tree-search',
                body: null,
                params: [
                    {
                        key: 'inputUuids',
                        type: 'request-body-uuid'
                    }, {
                        key: 'depth',
                        type: 'request-body'
                    }, {
                        key: 'navigationStrategy',
                        type: 'request-body'
                    }
                ],
                mappedParams: [],
                header: []
            }
        },
        flows: [],
        params: [
            {
                direction: 'out',
                key: 'result',
                types: 'so:',
                multiple: true,
                pluggable: true,
                master: true,
                displayName: 'SN-SERVICE-TREE-SEARCH-RESULT',
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
                        key: 'inputUuids',
                        direction: 'in',
                        types: 'so:',
                        multiple: true,
                        displayName: 'SN-SERVICE-TREE-SEARCH-OBJECTS',
                        pluggable: true,
                        required: true,
                    }, {
                        key: 'depth',
                        direction: 'in',
                        types: 'number',
                        multiple: false,
                        displayName: 'SN-SERVICE-TREE-SEARCH-TREELEVEL',
                        pluggable: true,
                        display: 'input',
                    }, {
                        key: 'navigationStrategy',
                        direction: 'in',
                        types: 'json',
                        multiple: false,
                        displayName: 'SN-SERVICE-TREE-SEARCH-MODELS-PARAMETER',
                        pluggable: true,
                    }
                ]
            }
        ]
    });

