import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_UNDO_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnUndoNode',
            custom: {
                taskKey: 'TaskUndo'
            },
            displayName: displayName,
            icon: 'fa-solid fa-rotate-left',
            flows: [{
                direction: 'in',
                params: []
            }, {
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [],
            sections: [],
        };
    };
