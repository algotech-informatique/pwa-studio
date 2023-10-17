import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_SLEEP_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnSleepNode',
            custom: {
                taskKey: 'TaskSleep'
            },
            displayName,
            icon: 'fa-solid fa-bed',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [{
                key: 'due',
                direction: 'in',
                types: 'number',
                displayName: 'SN-SLEEP-DUE',
                pluggable: true,
                required: true,
                display: 'input',
                default: 1000,
            }],
            sections: [],
        });

