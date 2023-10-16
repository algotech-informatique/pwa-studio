import { SnContextmenu } from '../../../modules/smart-nodes';
import * as _ from 'lodash';
import { TabDto } from '../../../dtos';

type Click = (event?: any) => void;
type GetTabsContextmenu = (onClose: Click, onCloseAllOther: Click, onCloseAllOnRight: Click, onSearchReference?: Click) => SnContextmenu;

export type TabContextMenuEvent = {
    event: any;
    tab: TabDto;
};

export const tabsContextMenu: GetTabsContextmenu = (onClose: Click, onCloseAllOther: Click, onCloseAllOnRight: Click,
        onSearchReference?: Click) => ({
        id: 'tabs-context-menu',
        subMenus: [
            _.compact([
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
                }, onSearchReference ? {
                    id: 'reference',
                    title: 'SN-CONTEXTMENU.SCHEMA.REFERENCE',
                    onClick: onSearchReference
                } : null
            ])
        ]
    });
