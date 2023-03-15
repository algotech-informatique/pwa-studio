import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_OBJECT_DELETION_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnObjectDeletionNode',
            custom: {
                taskKey: 'TaskObjectDelete'
            },
            displayName: displayName,
            icon: 'fa-solid fa-eraser',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [{
                key: 'objects',
                direction: 'in',
                types: 'so:',
                displayName: 'SN-NODE-OBJECT(S)',
                pluggable: true,
                required: true,
            }],
            sections: [],
        };
    };
