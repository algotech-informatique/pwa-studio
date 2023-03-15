import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_CAMERA_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnCameraNode',
            custom: {
                taskKey: 'TaskCamera'
            },
            displayName: displayName,
            icon: 'fa-solid fa-camera-retro',
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
                    display: 'key-edit'
                }]
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
                    displayName: 'SN-CAMERA-DEFAULT-NAME',
                    pluggable: true,
                    required: true,
                    display: 'input',
                }, {
                    key: 'multiple',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-CAMERA-MULTIPLE',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }, {
                    key: 'accessLocalStorage',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-CAMERA-ACCESS-LOCAL',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false,
                }]
            },  {
                key: 'annotation',
                displayName: 'SN-CAMERA-ANNOTATION',
                editable: false,
                open: false,
                params: [{
                    key: 'editionAnnotation',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-CAMERA-EDITION-ANNOTATION',
                    pluggable: true,
                    required: true,
                    display: 'input',
                    default: false
                }]
            }, {
                key: 'tags',
                displayName: 'SN-NODE-TAGS',
                editable: false,
                open: false,
                params: [{
                    key: 'activeTag',
                    direction: 'in',
                    types: 'boolean',
                    multiple: false,
                    displayName: 'SN-NODE-TAGS-ACTIVETAG',
                    pluggable: true,
                    display: 'input',
                    required: true,
                    default: false,
                }, {
                    key: 'modelsTag',
                    direction: 'in',
                    types: 'string',
                    multiple: true,
                    displayName: 'SN-NODE-TAGS-SELECTTAG',
                    pluggable: false,
                    display: 'select',
                }]
            }],
        };
    };
