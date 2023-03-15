import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SCHEDULE_DELETION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        deprecated: true,
        type: 'SnScheduleDeletionNode',
        custom: {
            taskKey: 'TaskScheduleDelete'
        },
        displayName,
        icon: 'fa-solid fa-calendar-xmark',
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
            key: 'schedules',
            direction: 'in',
            types: 'sys:schedule',
            displayName: 'SN-SCHEDULE-DELETION-SCHEDULE',
            pluggable: true,
            required: true,
        }],
        sections: [],
    });
