import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_LOCK_GO_BACK_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => ({
            type: 'SnLockGoBackNode',
            custom: {
                taskKey: 'TaskLockGoBack'
            },
            displayName,
            icon: 'fa-solid fa-road-lock',
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
        });

