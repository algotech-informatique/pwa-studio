import { SnContextmenu } from '../../../modules/smart-nodes';

type click = (event?: any) => void;
type GetTreeLineContextmenu = (
    onCopy: click,
    onRemove: click,
    onRename: click,
    disableStore?: boolean,
    showCopy?: boolean,
) => SnContextmenu;


export const cmTreeLine: GetTreeLineContextmenu = (
    onCopy: click,
    onRemove: click,
    onRename: click,
    disableStore?: boolean,
    showCopy?: boolean,
) => {
    const menu: SnContextmenu = {
        id: 'tree-line',
        subMenus: [
            [
                {
                    id: 'rename-line',
                    title: 'SN-CONTEXTMENU.SCHEMA.RENAME',
                    onClick: onRename,
                }, {
                    id: 'remove-line',
                    title: 'SN-CONTEXTMENU.SCHEMA.REMOVE',
                    onClick: onRemove,
                }
            ]
        ],
    };

    if (showCopy) {
        menu.subMenus.unshift([
            {
                id: 'copy-line',
                title: 'SN-CONTEXTMENU.SCHEMA.COPY',
                onClick: onCopy,
            }
        ]);
    }

    return menu;
};
