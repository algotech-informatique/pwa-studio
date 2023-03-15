import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SERVICE_WORKFLOW_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        deprecated: true,
        type: 'SnServiceWorkflowNode',
        displayName,
        icon: 'fa-solid fa-diagram-project',
        custom: {
            service: {
                execute: 'start',
                type: 'GET',
                key: 'get-workflows',
                route: '{{SERVER}}/workflow-models?filter={{filterProperty}}',
                body : null,
                params: [
                    {
                        key: 'filterProperty',
                        type: 'url-segment'
                    }
                ],
                mappedParams: [],
                header: [],
            }
        },
        flows: [],
        params: [
            {
                direction: 'out',
                key: 'result',
                types: 'sys:workflow',
                multiple: true,
                pluggable: true,
                master: true,
                displayName: 'SN-SERVICE-WORKFLOW-RESULT',
            }
        ],
        sections: [
            {
                key: 'sectionfilter',
                displayName: 'SN-SERVICE-WORKFLOW-FILTER',
                editable: false,
                open: true,
                params: [
                    {
                        key: 'filterProperty',
                        direction: 'in',
                        types: 'string',
                        multiple: false,
                        displayName: 'SN-SERVICE-WORKFLOW-FILTER-PROPERTY',
                        pluggable: false,
                        display: 'select',
                    }
                ]
            }
        ]
    });
