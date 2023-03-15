import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SUB_WORKFLOW_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnSubWorkflowNode',
            custom: {
                taskKey: 'TaskSubWorkflow'
            },
            displayName: displayName,
            icon: 'fa-solid fa-diagram-project',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: []
            }],
            params: [{
                key: 'workFlow',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-SUB-WORKFLOW.SELECT',
                pluggable: false,
                display: 'select',
                required: true,
            }],
            sections: [{
                key: 'inputs',
                displayName: 'SN-SUB-WORKFLOW.INPUTS',
                open: true,
                editable: true,
                hidden: true,
                params: [],
            }, {
                key: 'profiles',
                displayName: 'SN-SUB-WORKFLOW.PROFILES',
                open: true,
                editable: true,
                hidden: true,
                params: [],
            }]
        };
    };
