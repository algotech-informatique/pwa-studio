import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_X_REPORT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnxReportNode',
            custom: {
                taskKey: 'TaskXReport'
            },
            displayName: displayName,
            icon: 'fa-solid fa-file-lines',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:file',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false,
                }]
            }],
            params: [
                {
                    key: 'report',
                    direction: 'in',
                    types: 'string',
                    displayName: 'SN-REPORT-REPORT',
                    pluggable: false,
                    display: 'select',
                    required: true,
                }, {
                    key: 'fileId',
                    direction: 'in',
                    types: 'string',
                    displayName: 'SN-REPORT-REPORT',
                    pluggable: false,
                    display: 'input',
                    required: false,
                    value: '',
                }, {
                    key: 'templateName',
                    direction: 'in',
                    types: 'string',
                    displayName: 'SN-REPORT-REPORT',
                    pluggable: false,
                    display: 'input',
                    required: false,
                    value: '',
                }, {
                    key: 'keysTypes',
                    direction: 'in',
                    types: 'string',
                    displayName: 'SN-REPORT-REPORT',
                    pluggable: false,
                    display: 'input',
                    required: false,
                }],
            sections: [{
                key: 'inputs',
                displayName: 'SN-REPORT-INPUTS',
                editable: true,
                open: true,
                params: []
            }, {
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'fileName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-REPORT-FILENAME',
                    pluggable: true,
                    required: true,
                    display: 'input',
                }, {
                    key: 'download',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-REPORT-DOWNLOAD',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                }]
            }, {
                key: 'save',
                displayName: 'SN-NODE-SAVE',
                editable: false,
                open: true,
                params: [{
                    key: 'generate',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-REPORT-GENERATE',
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
                    displayName: 'SN-REPORT-VERSION',
                    pluggable: true,
                    required: false,
                }]
            }],
        };
    };
