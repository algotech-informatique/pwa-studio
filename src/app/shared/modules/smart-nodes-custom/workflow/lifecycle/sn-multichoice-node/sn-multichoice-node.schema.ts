import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_MULTICHOICE_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnMultiChoiceNode',
            custom: {
                taskKey: 'TaskMultichoice'
            },
            displayName: displayName,
            icon: 'fa-solid fa-question',
            flowsEditable: true,
            flows: [{
                direction: 'in',
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
                key: 'description',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-MULTICHOICE-DESCRIPTION',
                pluggable: true,
                display: 'input',
            }],
            sections: [],
        };
    };
