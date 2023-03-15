import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_CAMERA_AUTO_NODE_SCHEMA: (displayName: SnLang[], doneText: SnLang[], cancelText: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[], doneText: SnLang[], cancelText: SnLang[]) => {
        return {
            type: 'SnCameraAutoNode',
            custom: {
                taskKey: 'TaskAutoPhoto'
            },
            displayName: displayName,
            icon: 'fa-solid fa-camera',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                displayName: doneText,
                paramsEditable: true,
                params: [{
                    direction: 'out',
                    types: 'sys:file',
                    pluggable: true,
                    display: 'key-edit',
                    multiple: false,
                }]
            }, {
                key: 'cancel',
                displayName: cancelText,
                direction: 'out',
                paramsEditable: false,
                params: []
            }],
            params: [{
                key: 'objectLinked',
                direction: 'in',
                types: 'sk:atDocument',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: [{
                key: 'properties',
                displayName: 'SN-NODE-PROPERTIES',
                editable: false,
                open: true,
                params: [{
                    key: 'defaultName',
                    direction: 'in',
                    types: 'string',
                    multiple: false,
                    displayName: 'SN-CAMERA-AUTO-DEFAULT-NAME',
                    pluggable: true,
                    required: true,
                    display: 'input',
                }, {
                    key: 'accessLocalStorage',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-CAMERA-AUTO-ACCESS-LOCAL',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                }]
            }],
        };
    };
