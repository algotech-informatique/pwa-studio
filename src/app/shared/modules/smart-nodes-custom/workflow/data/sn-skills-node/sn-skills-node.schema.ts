import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_SKILLS_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnSkillsNode',
            custom: {
                taskKey: 'TaskSkills'
            },
            displayName: displayName,
            icon: 'fa-solid fa-brain',
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
                    multiple: true,
                    display: 'key-edit',
                }, {
                    direction: 'out',
                    types: 'sys:location',
                    pluggable: true,
                    multiple: true,
                    display: 'key-edit',
                }, {
                    direction: 'out',
                    types: 'sys:tag',
                    pluggable: true,
                    multiple: true,
                    display: 'key-edit',
                }, {
                    direction: 'out',
                    types: 'sys:signature',
                    pluggable: true,
                    multiple: false,
                    display: 'key-edit',
                }, {
                    direction: 'out',
                    types: 'sys:magnet',
                    pluggable: true,
                    multiple: true,
                    display: 'key-edit',
                }]
            }],
            params: [{
                key: 'object',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECT',
                pluggable: true,
                required: true,
                multiple: false,
            }],
            sections: []
        };
    };
