import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang, SnParam, SnSection } from '../../../../smart-nodes/models';

export const SN_FINISHER_NODE_SCHEMA: (displayName: SnLang[], display: boolean) => SnNodeSchema =
    (displayName: SnLang[], display: boolean) => ({
        type: 'SnFinisherNode',
        custom: {
            taskKey: 'TaskFinisher'
        },
        displayName,
        icon: 'fa-solid fa-flag-checkered',
        flows: [{
            direction: 'in',
            params: [],
        }],
        params: [{
            key: 'save',
            direction: 'in',
            types: 'boolean',
            multiple: false,
            displayName: 'SN-FINISHER-SAVE',
            pluggable: true,
            required: true,
            default: true,
            display: 'input',
        }],
        sections: display ? [workflowDisplay] : [],
    });

const workflowDisplay: SnSection = {
    key: 'display',
    displayName: 'SN-FINISHER-DISPLAY',
    editable: false,
    open: true,
    params: [
        {
            key: 'outputTrigger',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-FINISHER-OUTPUTTRIGGER',
            pluggable: false,
            default: 'end-op',
            display: 'select',
            required: true,
        },
        {
            key: 'displayMode',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-FINISHER-DISPLAYMODE',
            pluggable: false,
            default: 'toast',
            display: 'select',
            required: true,
        }, {
            key: 'timeout',
            direction: 'in',
            types: 'number',
            multiple: false,
            displayName: 'SN-FINISHER-TIMEOUT',
            pluggable: true,
            default: 2000,
            display: 'input',
        },
        {
            key: 'message',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-FINISHER-MESSAGE',
            pluggable: true,
            display: 'input',
        },
        {
            key: 'type',
            direction: 'in',
            types: 'string',
            multiple: false,
            displayName: 'SN-FINISHER-TYPE',
            pluggable: false,
            display: 'select',
            default: 'success',
        }]
};
