import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnLang } from '../../../smart-nodes/models';

export const SN_CSV_MAPPED_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
        displayName,
        type: 'SnCsvMappedNode',
        custom: {
            taskKey: 'TaskCsvMapped'
        },
        icon: 'fa-solid fa-file-csv',
        flows: [{
            direction: 'in',
            params: []
        }, {
            key: 'done',
            direction: 'out',
            paramsEditable: true,
            params: [{
                direction: 'out',
                types: 'so:*',
                dynamic: true,
                master: true,
                multiple: true,
                pluggable: true,
                display: 'key-edit',
            }]
        }],
        params: [{
            key: 'file',
            direction: 'in',
            types: 'sys:file',
            master: true,
            displayName: 'SN-CSV-MAPPED-FILE',
            display: 'input',
            required: true,
            pluggable: true,
        }, {
            key: 'delimiter',
            direction: 'in',
            types: 'string',
            multiple: false,
            master: false,
            displayName: 'SN-CSV-MAPPED-DELIMITER',
            display: 'input',
            pluggable: true,
            default: ','
        }, {
            key: 'encoding',
            direction: 'in',
            types: 'string',
            multiple: false,
            master: false,
            required: true,
            displayName: 'SN-CSV-MAPPED-ENCODING',
            display: 'select',
            pluggable: true,
            default: 'utf8'
        }, {
            key: 'smartModel',
            direction: 'in',
            types: 'string',
            required: true,
            multiple: false,
            master: false,
            displayName: 'SMARTMODEL',
            display: 'select',
            pluggable: false,
        }, {
            key: 'saveOnApi',
            direction: 'in',
            types: 'boolean',
            multiple: false,
            master: false,
            displayName: 'SN-PARAM.SAVE-ON-API',
            display: 'input',
            pluggable: true,
            default: true,
        }],
        sections: [{
            key: 'columns',
            displayName: 'SN-CSV-MAPPED-COLUMNS',
            editable: true,
            open: true,
            params: [],
        }, {
            key: 'dateFormat',
            displayName: 'SN-CSV-MAPPED-DATE-FORMAT',
            editable: true,
            open: true,
            params: [],
        }],
    });
