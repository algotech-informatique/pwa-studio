import { SnContextmenu } from '../../../modules/smart-nodes';

type click = (event?: any) => void;
type GetSessionContextmenu = (onReload: click, onDisconnect: click) => SnContextmenu;

export const cmSessionExpander: GetSessionContextmenu = (onRefresh: click, onDisconnect: click) => {
    return {
        id: 'session-expander',
        subMenus: [
            [
                {
                    id: 'expander-reload',
                    title: 'SN-CONTEXTMENU.SCHEMA.REFRESH',
                    onClick: onRefresh,
                },
            ], [
                {
                    id: 'expander-disconnect',
                    title: 'SN-CONTEXTMENU.SCHEMA.DISCONNECT',
                    onClick: onDisconnect,
                },
            ]
        ],
    };
};
