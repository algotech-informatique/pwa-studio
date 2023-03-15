import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SCHEDULE_CREATION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        deprecated: true,
        type: 'SnScheduleCreationNode',
        custom: {
            taskKey: 'TaskScheduleCreate'
        },
        displayName,
        icon: 'fa-solid fa-calendar-days',
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
            key: 'title',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-NODE-TITLE',
            pluggable: true,
            display: 'input',
        }, {
            key: 'scheduleTypeKey',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-SCHEDULE-CREATION-TYPE-KEY',
            pluggable: true,
            display: 'select',
            required: false,
        }],
        sections: [{
            key: 'properties',
            displayName: 'SN-NODE-PROPERTIES',
            editable: false,
            open: true,
            params: [{
                key: 'linkedSO',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECTS',
                pluggable: true,
                required: true,
            }, {
                key: 'linkedWorkflow',
                direction: 'in',
                types: 'sys:workflow',
                displayName: 'SN-SCHEDULE-CREATION-WORKFLOWS',
                pluggable: true,
                required: false,
            }, {
                key: 'profiles',
                direction: 'in',
                types: 'string',
                multiple: true,
                displayName: 'SN-SCHEDULE-CREATION-PROFILES',
                pluggable: false,
                display: 'select',
                required: false,
            }, {
                key: 'assignedUsers',
                direction: 'in',
                types: 'sys:user',
                displayName: 'SN-SCHEDULE-CREATION-ASSIGNED-USERS',
                pluggable: true,
                required: false,
            }, {
                key: 'receivers',
                direction: 'in',
                types: 'sys:user',
                displayName: 'SN-SCHEDULE-CREATION-RECEIVERS',
                pluggable: true,
                required: false,
            }]
        }, {
            key: 'options',
            displayName: 'SN-NODE-OPTIONS',
            editable: false,
            open: true,
            params: [{
                key: 'scheduleTitle',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-SCHEDULE-CREATION-TITRE',
                pluggable: true,
                display: 'input',
                required: false,
            }, {
                key: 'beginDate',
                direction: 'in',
                types: ['date', 'datetime'],
                multiple: false,
                displayName: 'SN-SCHEDULE-CREATION-DATE-START',
                pluggable: true,
                display: 'input',
                required: false,
            }, {
                key: 'endDate',
                direction: 'in',
                types: ['date', 'datetime'],
                multiple: false,
                displayName: 'SN-SCHEDULE-CREATION-DATE-END',
                pluggable: true,
                display: 'input',
                required: false,
            }, {
                key: 'repetitionMode',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-SCHEDULE-CREATION-REPETITION-MODE',
                pluggable: true,
                display: 'select',
                required: false,
            }, {
                key: 'scheduleStatus',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-SCHEDULE-CREATION-SCHEDULE-STATUS',
                pluggable: true,
                display: 'select',
                required: false,
            }],
        }],
    });
