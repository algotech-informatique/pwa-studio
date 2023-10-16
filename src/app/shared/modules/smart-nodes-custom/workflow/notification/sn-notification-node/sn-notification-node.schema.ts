import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_NOTIFICATION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnNotificationNode',
            custom: {
                taskKey: 'TaskNotification'
            },
            displayName,
            icon: 'fa-solid fa-bell',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'notify',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:notification',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false,
                }]
            }],
            params: [{
                key: 'profiles',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-NOTIFICATION-VALIDATION-PROFILES',
                pluggable: false,
                display: 'select',
                required: true,
                default: []
            }, {
                key: 'destination',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-NOTIFICATION-DESTINATION',
                pluggable: false,
                display: 'select',
                required: true,
                default: 'profil'
            }, {
                key: 'profiles_viewer',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-NOTIFICATION-INFORMATION-PROFILES',
                pluggable: false,
                display: 'select',
                required: true,
                default: []
            }, {
                key: 'groups_viewer',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-NOTIFICATION-INFORMATION-PROFILES',
                pluggable: true,
                display: 'select',
                required: true,
                default: []
            }, {
                key: 'users_viewer',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-NOTIFICATION-INFORMATION-PROFILES',
                pluggable: true,
                display: 'input',
                required: true,
                default: []
            }, {
                key: 'channels',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-NOTIFICATION-CHANNELS',
                pluggable: false,
                display: 'select',
                required: true,
                default: ['web', 'mobile'],
            }],
            sections: [{
                key: 'notification',
                editable: false,
                displayName: 'SN-NOTIFICATION-NOTIFICATION',
                open: true,
                params: [{
                    key: 'title',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-NOTIFICATION-TITLE',
                    pluggable: true,
                    display: 'input',
                    required: true,
                }, {
                    key: 'content',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-NOTIFICATION-CONTENT',
                    pluggable: true,
                    display: 'input',
                    required: false,
                    default: ''
                }]
            }],
        });

