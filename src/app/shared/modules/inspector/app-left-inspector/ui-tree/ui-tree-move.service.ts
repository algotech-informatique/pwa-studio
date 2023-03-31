import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { UITreeMoveData } from './models/ui-tree-move-data.interface';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../app/services';
import { WidgetListService } from '../../../app-custom/widgets';

@Injectable()
export class UITreeMoveService {
    constructor(
        private pageUtils: PageUtilsService,
        private pageWidget: PageWidgetService,
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,) { }

    public move(snApp: SnAppDto, data: UITreeMoveData) {
        const resize: SnPageWidgetDto[] = [];
        const old: SnPageWidgetDto[] = [];

        if (data.type === 'widget') {
            resize.push(...this.pageUtils.getTree(snApp, data.destination as SnPageWidgetDto));
        }

        // sort selection for insert multiple
        const widgets = [...this.appSelection.selections.widgets].sort((a, b) =>
            this.pageUtils.getBrothers(snApp, b).indexOf(b) - this.pageUtils.getBrothers(snApp, a).indexOf(a));

        // insert
        for (const widget of widgets) {
            if (this.pageUtils.getParent(snApp, widget) === data.destination) {
                const index = this.pageUtils.getBrothers(snApp, widget).indexOf(widget);
                if (data.index === index || data.index === index + 1) {
                    continue;
                }
            }

            const parent = this.pageUtils.findParentWidget(snApp, widget);
            if (parent) {
                resize.push(...this.pageUtils.getTree(snApp, parent));
            }
            old.push(this.insert(snApp, data, widget));
        }

        // remove old
        this.pageWidget.remove(snApp, old);

        // resize
        const allWidgets = this.pageUtils.getWidgets(snApp);
        this.pageWidget.resizeAnyGroup(['custom'], resize.filter((w) => allWidgets.includes(w)).reverse());

        // update & refresh selection
        this.appActions.notifyUpdate(snApp);
        this.appSelection.selections.widgets = [...this.appSelection.selections.widgets];
    }

    public checkAccept(snApp: SnAppDto, data: UITreeMoveData) {
        return this.appSelection.selections.widgets.every((widget) => {
            if (data.type === 'page') {
                return !PageWidgetService.getType(widget).strictParents || PageWidgetService.getType(widget).strictParents?.length === 0;
            }
            if (PageWidgetService.getType(widget).ungroupable) {
                return false;
            }
            const target = data.destination as SnPageWidgetDto;
            if(this.pageUtils.getTree(snApp, target).includes(widget)) {
                return false;
            }
            if (PageWidgetService.getType(widget).strictParents && PageWidgetService.getType(widget).strictParents.length > 0) {
                return PageWidgetService.getType(widget).strictParents.includes(target.typeKey);
            } else if (PageWidgetService.getType(target).unstrictGroup) {
                return true;
            } else {
                return !this.pageWidget.listOfStrictParents().includes(target.typeKey);
            };
        });
    }

    private insert(snApp: SnAppDto, data: UITreeMoveData, widget: SnPageWidgetDto) {
        // save absolute
        const absWidget = this.pageUtils.transformAbsolute(snApp, widget);
        const absDestination = data.type === 'widget' ? this.pageUtils.transformAbsolute(snApp, data.destination as SnPageWidgetDto) : null;

        // copy old
        const brothers = this.pageUtils.getBrothers(snApp, widget);
        const index = brothers.indexOf(widget);
        brothers[index] = Object.assign(_.cloneDeep(widget), { id: UUID.UUID() });
        const old = brothers[index];

        // // new position
        if (!PageWidgetService.getType(widget).strictParents || PageWidgetService.getType(widget).strictParents?.length === 0) {
            widget.box.x = absWidget.box.x - (absDestination ? absDestination.box.x : 0);
            widget.box.y = absWidget.box.y - (absDestination ? absDestination.box.y : 0);
        }

        // insert new
        data.brothers.splice(data.index, 0, widget);

        // return old
        return old;
    }
}
