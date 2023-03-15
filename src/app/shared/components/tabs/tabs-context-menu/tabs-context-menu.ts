import { TabDto } from 'src/app/shared/dtos';
import { SnContextmenu } from '../../../modules/smart-nodes';

type Click = (event?: any) => void;
type GetTabsContextmenu = (onClose: Click, onCloseAllOther: Click, onCloseAllOnRight: Click) => SnContextmenu;

export type TabContextMenuEvent = {
    event: any;
    tab: TabDto;
};

export const tabsContextMenu: GetTabsContextmenu = (onClose: Click, onCloseAllOther: Click, onCloseAllOnRight: Click) => ({
        id: 'tabs-context-menu',
        subMenus: [
            [
                {
                    id: 'tab-close',
                    title: 'TABS.CLOSE_ONE',
                    onClick: onClose
                }, {
                    id: 'tab-close-other',
                    title: 'TABS.CLOSE_OTHERS',
                    onClick: onCloseAllOther
                }, {
                    id: 'tab-close-right',
                    title: 'TABS.CLOSE_RIGHT',
                    onClick: onCloseAllOnRight
                }
            ]
        ]
    });
