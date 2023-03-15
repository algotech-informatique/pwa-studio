import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_QUERY_BUILDER_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnQueryBuilderNode',
            custom: {
                taskKey: 'TaskQueryBuilder'
            },
            displayName: displayName,
            icon: 'fa-solid fa-database',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'object',
                    pluggable: true,
                    display: 'key-edit',
                }]
            }],
            params: [{
                key: 'connection',
                direction: 'in',
                types: 'sys:dbconnection',
                multiple: false,
                master: true,
                required: true,
                displayName: 'SN-QUERY-BUILDER-CONNECTION',
                pluggable: true,
            }, {
                key: 'wizardMode',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                master: false,
                required: true,
                displayName: 'SN-QUERY-BUILDER-WIZARD-MODE',
                pluggable: true,
                display: 'input',
                default: false
            }],
            sections: [{
                key: 'sources',
                displayName: 'SN-SOURCES',
                open: true,
                editable: true,
                params: [],
            }, {
                key: 'query',
                displayName: 'SN-QUERY-BUILDER-REQUEST',
                open: true,
                editable: false,
                params: [{
                    key: 'plainQuery',
                    direction: 'in',
                    types: 'string',
                    dynamic: true,
                    pluggable: true,
                    required: true,
                    value: '',
                }],
                hidden: true,
            }],
        };
    };
