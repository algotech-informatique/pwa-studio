import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SnLang } from '../../../../smart-nodes/models';

export const SN_LAUNCHER_NODE_SCHEMA: (displayName: SnLang[]) => SnNodeSchema =
    (displayName: SnLang[]) => {
        return {
            type: 'SnLauncherNode',
            custom: {
                taskKey: 'TaskLauncher'
            },
            displayName: displayName,
            icon: 'fa-solid fa-play-circle',
            flows: [{
                key: 'done',
                direction: 'out',
                params: []
            }],
            params: [],
            sections: [],
        };
    };
