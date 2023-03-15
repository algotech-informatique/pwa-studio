import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SWITCH_NODE_SCHEMA: (displayName: SnLang[], defaultText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], defaultText: SnLang[]) =>
        ({
            type: 'SnSwitchNode',
            custom: {
                taskKey: 'TaskSwitch'
            },
            displayName,
            icon: 'fa-solid fa-arrows-split-up-and-left fa-rotate-90',
            flowsEditable: true,
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'default',
                direction: 'out',
                params: [],
                displayName: defaultText,
                locked: true,
            }],
            params: [{
                key: 'switchAValue',
                direction: 'in',
                types: ['string', 'number', 'date', 'time', 'datetime'],
                dynamic: true,
                displayName: 'SN-SWITCH-FIELD',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'criterias',
                displayName: 'SN-SWITCH-CRITERIAS',
                editable: true,
                hidden: false,
                open: true,
                params: [],
            }]
        });
