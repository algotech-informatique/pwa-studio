import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppMessageService } from '../app-message/app-message.service';
import * as _ from 'lodash';
import { AppSelectionEvent } from '../../dto';
import { AppSelectionType } from '../../dto/app-selection.dto';
import { PageUtilsService } from '../page-utils/page-utils.service';

@Injectable()
export class AppSelectionService extends AppMessageService {

    selections: {
        pages: SnPageDto[];
        widgets: SnPageWidgetDto[];
        sharedWidgets: SnPageWidgetDto[];
    } = {
            pages: [],
            widgets: [],
            sharedWidgets: [],
        };

    constructor(private pageUtils: PageUtilsService) {
        super();
    }

    unselect(app: SnAppDto) {
        for (const page of app.pages) {
            if (page.displayState) {
                page.displayState.activeZone = null;
            }
        };
        this.selections = {
            pages: [],
            widgets: [],
            sharedWidgets: [],
        };
        this.notifySelect(app, null);
    }

    select($event, app: SnAppDto, event: AppSelectionEvent) {
        const selections = {
            pages: [],
            widgets: [],
            sharedWidgets: [],
        };

        const collection = `${event.type}s`;
        if ($event && (($event.sourceEvent && $event.sourceEvent.ctrlKey) || $event.ctrlKey)) {

            // ctrlKey
            if (this.selections[collection].includes(event.element) && !event.ignoreUnselect) {
                // unselect widget
                this.selections[collection] = _.reject(this.selections[collection], { id: event.element.id });
                const ev = Object.assign(_.cloneDeep(event), {
                    element: this.selections[collection].length > 0 ?
                        this.selections[collection][this.selections[collection].length - 1] : null
                });
                this.notifySelect(app, ev);
                return;
            }

            selections[collection] = _.uniqBy([...this.selections[collection], event.element], 'id');
            if (event.type === 'widget') {
                const findChild = selections[collection].find((widget) => !this.pageUtils.isMasterWidget(app, widget));

                if (findChild) {
                    // keep only child of group
                    const parent = this.pageUtils.findParentWidget(app, findChild);
                    this.selections[collection] = _.filter(selections[collection], ((widget) =>
                        this.pageUtils.findParentWidget(app, widget) === parent
                    ));
                    const ev = Object.assign(_.cloneDeep(event), {
                        element: this.selections[collection].length > 0 ?
                            this.selections[collection][this.selections[collection].length - 1] : null
                    });
                    this.notifySelect(app, ev);
                    return;
                }
            }
        } else {
            if (event.ignoreUnselect && this.selections[collection].includes(event.element)) {
                this.notifySelect(app, event);
                return;
            }

            // normal
            selections[collection] = [event.element];
        }

        this.selections = selections;
        this.notifySelect(app, event);
    }

    selectElts(app: SnAppDto, elts: (SnPageWidgetDto | SnPageDto)[], type: 'widget' | 'page', notify = true) {
        this.selections = {
            pages: type === 'page' ? [...elts as SnPageDto[]] : [],
            widgets: type === 'widget' ? [...elts as SnPageWidgetDto[]] : [],
            sharedWidgets: [],
        };
        if (!notify || elts.length === 0) {
            return;
        }
        this.notifySelect(app, { type, element: elts[0] });
    }

    selectAll(app: SnAppDto) {
        if (!this.hasSelections('page') && !this.hasSelections('widget')) {
            // select all pages
            this.selections = {
                pages: [...app.pages],
                widgets: [],
                sharedWidgets: [],
            };
            this.notifySelect(app, { type: 'page', element: app.pages[0] });
            return;
        }

        // select all widgets
        const pages = this.hasSelections('page') ? this.selections.pages :
            _.uniqBy(this.selections.widgets.map((w) => this.pageUtils.findPage(app, w)), 'id');

        const widgets = pages.reduce((results: SnPageWidgetDto[], p) => {
            results.push(...p.widgets);
            return results;
        }, []);

        if (widgets.length === 0) {
            return;
        }

        this.selections = {
            pages: [],
            widgets: [...widgets],
            sharedWidgets: [],
        };
        this.notifySelect(app, { type: 'widget', element: widgets[0] });
    }

    isSelected(app: SnAppDto, widget: SnPageWidgetDto, types: ('master' | 'widget' | 'childs' | 'brother' | 'uncle')[]) {
        const parent = this.pageUtils.findParentWidget(app, widget);

        if (types.includes('widget') && this.selections.widgets.includes(widget)) {
            return true;
        }

        if (types.includes('childs') && widget.group && _.intersectionBy(this.selections.widgets, widget.group.widgets, 'id').length > 0) {
            return true;
        }

        if (types.includes('brother') && this.selections.widgets.some((w) => this.pageUtils.findParentWidget(app, w) === parent)) {
            return true;
        }

        if (types.includes('master') && this.selections.widgets.includes(parent)) {
            return true;
        }

        if (types.includes('uncle')) {
            if (this.selections.widgets.some((w) => {
                const tree = this.pageUtils.getTree(app, w);
                return tree.includes(this.pageUtils.findParentWidget(app, widget));
            })) {
                return true;
            }
        }

        return false;
    }

    hasSelections(type: AppSelectionType) {
        return this.selections && this.selections[`${type}s`].length > 0;
    }

    hasOnlyMasterWidgets(app: SnAppDto) {
        return _.every(this.selections.widgets, w => this.pageUtils.isMasterWidget(app, w));
    }

    hasOnlySharedWidgets(app: SnAppDto) {
        return _.every(this.selections.widgets, w => this.pageUtils.isWidgetShared(app, w));
    }

    hasPageWithNoRef(app: SnAppDto) {
        return _.every((this.selections.sharedWidgets.length > 0) ? this.selections.sharedWidgets : this.selections.widgets,
            (w: SnPageWidgetDto) => app.pages
                .find((p: SnPageDto) => _.every(p.widgets, (pw: SnPageWidgetDto) => pw.sharedId !== w.sharedId)));
    }

    onSelect(app: SnAppDto): Observable<AppSelectionEvent> {
        return this._get('app.select', app); // todo
    }

    private notifySelect(app: SnAppDto, event: AppSelectionEvent) {
        this._send('app.select', app, event);
    }
}
