import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_DOCUMENT_CONVERT_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        const schema: SnNodeSchema = {
            type: 'SnDocumentConvertNode',
            custom: {
                taskKey: 'TaskConvert'
            },
            displayName,
            icon: 'fa-solid fa-rotate',
            flowsEditable: false,
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
                    key: 'inputFile',
                    direction: 'in',
                    types: 'sys:file',
                    displayName: 'SN-DOCUMENT-CONVERT-FILE',
                    pluggable: true,
                    required: false,
                }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'fileName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-CONVERT-FILENAME',
                    pluggable: true,
                    required: false,
                    display: 'input',
                }, {
                    key: 'download',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-DOCUMENT-CONVERT-DOWNLOAD',
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
                    key: 'save',
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
        return schema;
    };
