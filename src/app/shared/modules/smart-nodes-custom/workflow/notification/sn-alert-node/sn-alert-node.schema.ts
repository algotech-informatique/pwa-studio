import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_ALERT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnAlertNode',
            custom: {
                taskKey: 'TaskAlert'
            },
            displayName: displayName,
            icon: 'fa-solid fa-triangle-exclamation',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: false,
                params: []
            }],
            params: [{
                key: 'alertTitle',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-ALERT-TITLE',
                pluggable: true,
                display: 'input',
            }, {
                key: 'alertMessage',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-ALERT-MESSAGE',
                pluggable: true,
                display: 'input',
                required: true,
            }, {
                key: 'alertType',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-ALERT-TYPE',
                pluggable: false,
                display: 'select',
            }],
            sections: [],
        };
    };
