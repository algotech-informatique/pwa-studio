import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_CONDITIONV2_NODE_SCHEMA: (displayName: SnLang[], confirmText: SnLang[], cancelText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], confirmText: SnLang[], cancelText: SnLang[]) =>
        ({
            type: 'SnConditionV2Node',
            custom: {
                taskKey: 'TaskConditionV2'
            },
            displayName,
            icon: 'fa-solid fa-diamond',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'true',
                direction: 'out',
                params: [],
                displayName: confirmText,
            }, {
                key: 'false',
                direction: 'out',
                params: [],
                displayName: cancelText,
            }],
            params: [{
                key: 'conditionAValue',
                direction: 'in',
                types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'object', 'so:'],
                dynamic: true,
                displayName: 'SN-CONDITION-FIELD',
                pluggable: true,
                required: true,
            }],
            sections: [{
                key: 'criterias',
                displayName: 'SN-CONDITION-CRITERIAS',
                editable: true,
                open: true,
                params: [],
            }]
        });
