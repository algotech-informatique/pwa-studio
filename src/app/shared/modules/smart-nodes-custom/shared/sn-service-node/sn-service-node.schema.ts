import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_SERVICE_NODE_SCHEMA: (displayName: SnLang[], nameDone: SnLang[], nameError: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], nameDone: SnLang[], nameError: SnLang[]) => ({
        type: 'SnServiceNode',
        custom: {
            taskKey: 'TaskService'
        },
        displayName,
        icon: 'fa-solid fa-square-caret-up',
        flows: [{
            direction: 'in',
            params: []
        }, {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            displayName: nameDone,
            params: [{
                direction: 'out',
                types: ['object', 'sys:file'],
                pluggable: true,
                display: 'key-edit',
            }, {
                direction: 'out',
                types: 'object',
                pluggable: true,
                display: 'key-edit',
            }]
        }, {
            key: 'error',
            direction: 'out',
            paramsEditable: true,
            displayName: nameError,
            params: [{
                direction: 'out',
                types: 'number',
                pluggable: true,
                display: 'key-edit',
            }, {
                direction: 'out',
                types: 'object',
                pluggable: true,
                display: 'key-edit',
            }]
        }],
        params: [{
            key: 'type',
            direction: 'in',
            types: 'string',
            multiple: false,
            master: false,
            required: true,
            displayName: 'SN-SERVICE-TYPE',
            pluggable: false,
            display: 'select',
            default: 'get',
        }, {
            key: 'responseType',
            direction: 'in',
            types: 'string',
            master: false,
            multiple: false,
            required: true,
            displayName: 'SN-SERVICE-TYPE-RESPONSE',
            pluggable: false,
            display: 'select',
            default: 'text'
        }, {
            key: 'url',
            direction: 'in',
            displayName: 'SN-SERVICE-URL',
            types: 'string',
            required: true,
            multiple: false,
            display: 'input',
            pluggable: true,
            default: 'http://'
        }, {
            key: 'listSysFile',
            direction: 'in',
            types: 'string',
            displayName: 'SN-SERVICE-URL',
            pluggable: false,
            display: 'input',
            required: true,
            value: '',
        }, {
            key: 'multiVariable',
            direction: 'in',
            types: 'boolean',
            displayName: 'SN-SERVICE-MULTIVARIABLE',
            pluggable: false,
            display: 'input',
            required: true,
            default: true,
        }],
        sections: [{
            key: 'properties',
            displayName: 'SN-NODE-PROPERTIES',
            editable: false,
            open: false,
            params: [{
                key: 'fileName',
                direction: 'in',
                types: 'string',
                multiple: false,
                displayName: 'SN-SERVICE-FILENAME',
                pluggable: true,
                required: false,
                display: 'input',
            }],
        }, {
            key: 'save',
            displayName: 'SN-NODE-SAVE',
            editable: false,
            open: false,
            params: [{
                key: 'generate',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-SERVICE-GENERATE',
                pluggable: true,
                required: true,
                display: 'input',
                default: false,
            }, {
                key: 'object',
                direction: 'in',
                types: 'sk:atDocument',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: false,
                multiple: false,
            }, {
                key: 'version',
                direction: 'in',
                types: 'sys:file',
                multiple: false,
                displayName: 'SN-SERVICE-VERSION',
                pluggable: true,
                required: false,
            }]
        }, {
            key: 'headers',
            displayName: 'SN-SERVICE-HEADERS',
            open: true,
            editable: true,
            params: [],
        }, {
            key: 'parameters',
            displayName: 'SN-SERVICE-PARAMETERS',
            open: true,
            editable: true,
            params: [],
        }, {
            key: 'body',
            displayName: 'SN-SERVICE-BODY',
            open: true,
            editable: true,
            params: [],
        }, {
            key: 'bodyObject',
            displayName: 'SN-SERVICE-BODY',
            open: true,
            editable: false,
            hidden: true,
            params: [{
                key: 'jsonObject',
                direction: 'in',
                types: 'object',
                multiple: false,
                displayName: 'SN-SERVICE-BODY-OBJECT',
                pluggable: true,
                required: false,
            }],
        }, {
            key: 'advanced',
            displayName: 'SN-SERVICE-ADVANCED',
            open: false,
            editable: false,
            params: [{
                key: 'returnHeaders',
                direction: 'in',
                types: 'boolean',
                multiple: false,
                displayName: 'SN-SERVICE-RETURN-HEADERS',
                pluggable: true,
                required: true,
                default: false,
                display: 'input',
            }],
        }],
    });
