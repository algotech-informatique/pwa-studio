import { SnAppDto, SnPageBoxDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { AppContextmenuActionExtension, AppShortCutExtension } from '../../../../app/dto';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../app/services';
import * as _ from 'lodash';

@Injectable()
export class WidgetListService {
    constructor(
        private appSelection: AppSelectionService,
        private pageWidget: PageWidgetService,
        private pageUtils: PageUtilsService,
        private appActions: AppActionsService) { }

    public extendedContextMenu(snApp: SnAppDto): AppContextmenuActionExtension[] {
        const makeList: AppContextmenuActionExtension = {
            filter: () => this.canMakeList(),
            onClick: () => this.makeList(snApp),
            title: 'SN-CONTEXTMENU.SCHEMA.MAKE-LIST',
            content: 'SN-CONTEXTMENU.SCHEMA.MAKE-LIST.SHORTCUT',
            icon: 'fa-solid fa-list-ul',
        };

        const undoList: AppContextmenuActionExtension = {
            filter: () => this.canUndoList(),
            onClick: () => this.undoList(snApp),
            title: 'SN-CONTEXTMENU.SCHEMA.UNDO-LIST',
            content: 'SN-CONTEXTMENU.SCHEMA.MAKE-LIST.SHORTCUT',
            icon: 'fa-solid fa-list-ul',
        };

        const mergeList: AppContextmenuActionExtension = {
            filter: () => this.canMergeList(),
            onClick: () => this.mergeList(snApp),
            title: 'SN-CONTEXTMENU.SCHEMA.MERGE-LIST',
            content: 'SN-CONTEXTMENU.SCHEMA.MAKE-LIST.SHORTCUT',
            icon: 'fa-solid fa-list-ul',
        };
        return [
            makeList,
            undoList,
            mergeList
        ];
    }

    public extendedShortcut(snApp: SnAppDto): AppShortCutExtension[] {
        const makeList: AppShortCutExtension = {
            key: 'l',
            filter: () => this.canMakeList(),
            onShortCut: () => this.makeList(snApp),
            ctrlKey: true,
        };

        const undoList: AppShortCutExtension = {
            key: 'l',
            filter: () => this.canUndoList(),
            onShortCut: () => this.undoList(snApp),
            ctrlKey: true,
        };

        const mergeList: AppShortCutExtension = {
            key: 'l',
            filter: () => this.canMergeList(),
            onShortCut: () => this.mergeList(snApp),
            ctrlKey: true,
        };

        return [
            makeList,
            undoList,
            mergeList
        ];
    }

    public resize(snApp: SnAppDto, tree: SnPageWidgetDto | SnPageWidgetDto[]) {
        const items = Array.isArray(tree) ? tree : this.pageUtils.getTree(snApp, tree).reverse();

        this.pageWidget.resizeAnyGroup(['custom', 'list'], items,
            (widget: SnPageWidgetDto, box: SnPageBoxDto) => {
                if (widget.typeKey === 'list') {
                    box.height = this.getHeight(widget, box);
                }
            }
        );
    }

    private getHeight(widget: SnPageWidgetDto, box: SnPageBoxDto) {
        return (box.height * 3) + (this.extractGap(widget) * 2);
    }

    private widgetCanMakeList(widget: SnPageWidgetDto) {
        return widget.custom.iterable;
    }

    private isList(widget: SnPageWidgetDto) {
        return widget.typeKey === 'list';
    }

    private canMakeList() {
        return this.appSelection.selections.widgets.length > 0 &&
            this.appSelection.selections.widgets.every((w) => this.widgetCanMakeList(w));
    }

    private canUndoList() {
        return this.appSelection.selections.widgets.length > 0 &&
            this.appSelection.selections.widgets.every((w) => this.isList(w) && w.group?.widgets.length > 0);
    }

    private canMergeList() {
        const widgetsList = this.appSelection.selections.widgets.filter((w) => this.isList(w));
        const others = _.pull([...this.appSelection.selections.widgets], ...widgetsList);
        return widgetsList.length === 1 && others.length > 0 && others.every((w) => this.widgetCanMakeList(w));

    }

    private extractGap(list: SnPageWidgetDto) {
        const gap = list.css.layout?.gap;
        if (!gap) {
            return 0;
        }
        const res = +gap.replace(/\D+/g, '');
        if (_.isNaN(res)) {
            return 0;
        }
        return res;
    }

    private makeList(snApp: SnAppDto) {
        if (!this.canMakeList()) {
            return;
        }

        const list = this.pageWidget.group(snApp, this.appSelection.selections.widgets, false, 'list');
        list.box.height = this.getHeight(list, list.box);

        this.appSelection.select(null, snApp, { element: list, type: 'widget' });
        this.appActions.notifyUpdate(snApp);
    }

    private undoList(snApp: SnAppDto) {
        if (!this.canUndoList()) {
            return;
        }
        const widgets = this.pageWidget.ungroup(snApp, this.appSelection.selections.widgets);
        this.appSelection.selectElts(snApp, widgets, 'widget', true);

        this.appActions.notifyUpdate(snApp);
    }

    private mergeList(snApp: SnAppDto) {
        if (!this.canMergeList()) {
            return;
        }

        const list = this.pageWidget.group(snApp, this.appSelection.selections.widgets, true, 'list');
        this.resize(snApp, list);
        this.appSelection.select(null, snApp, { element: list, type: 'widget' });

        this.appActions.notifyUpdate(snApp);
    }
}
