import { SnNodeSchema } from '../../../../../smart-nodes/dto';
import { SnLang } from '../../../../../smart-nodes/models';

export const SN_CONDITION_NODE_SCHEMA: (displayName: SnLang[], confirmText: SnLang[], cancelText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], confirmText: SnLang[], cancelText: SnLang[]) =>
        ({
            deprecated: true,
            type: 'SnConditionNode',
            custom: {
                taskKey: 'TaskCondition'
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
                key: 'condition',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-CONDITION-CONDITION',
                pluggable: false,
                display: 'select',
                required: true,
            }],
            sections: [{
                key: 'value',
                displayName: 'SN-CONDITION-VALUE',
                editable: false,
                open: true,
                params: [{
                    key: 'conditionAValue',
                    direction: 'in',
                    types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:'],
                    dynamic: true,
                    displayName: 'SN-CONDITION-FIELD-A',
                    pluggable: true,
                    required: true,
                }, {
                    key: 'conditionBValue',
                    direction: 'in',
                    types: ['string', 'number', 'date', 'time', 'datetime', 'boolean', 'so:', 'sys:'],
                    dynamic: true,
                    displayName: 'SN-CONDITION-FIELD-B',
                    pluggable: true,
                    display: 'input',
                }],
            }]
        });

