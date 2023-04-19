import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LangDto, SnAppDto, SnPageDto, SnPageEventDto, SnPageWidgetDto } from '@algotech-ce/core';
import { AppMessageService } from '../app-message/app-message.service';
import { AppSelectionService } from '../app-selection/app-selection.service';
import { PageWidgetService } from '../page-widget/page-widget.service';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { UUID } from 'angular2-uuid';
import { SnTranslateService } from '../../../smart-nodes/services/lang/sn-translate/sn-translate.service';
import { AppSelectionType, OpenInspectorType } from '../../dto/app-selection.dto';
import * as _ from 'lodash';
import { setLockedProperties } from '../../../app-custom/widgets/_data/inspector-sections';
import { tap } from 'rxjs/operators';

@Injectable()
export class AppActionsService extends AppMessageService {

    update = 0;

    constructor(
        private pageUtils: PageUtilsService,
        private pageWidget: PageWidgetService,
        private appSelection: AppSelectionService,
        private translate: SnTranslateService) {
        super();
    }

    initializeDisplayStates(app: SnAppDto) {
        const widgets = this.pageUtils.getWidgets(app);
        if (!app.displayState) {
            app.displayState = {};
        }
        for (const elt of [...app.pages, ...widgets, ...app.shared]) {
            if (!elt.displayState) {
                elt.displayState = {};
            }
        }
    }

    canRemove() {
        if (this.appSelection.hasSelections('widget')) {
            return true;
        }
        if (this.appSelection.hasSelections('page')) {
            return this.appSelection.selections.pages.every((p) => !p.main);
        }
        return false;
    }

    canGroup() {
        const allWidgetsCanGroup = this.appSelection.selections.widgets.every(widget => {
            const type = PageWidgetService.getType(widget);
            return !type.ungroupable;
        });
        return this.appSelection.selections.widgets.length > 1 && allWidgetsCanGroup;
    }

    canUngroup() {
        return this.appSelection.selections.widgets.length > 0 &&
            this.appSelection.selections.widgets.every((w) => w.group && this.pageUtils.isStandardGroup(w));
    }

    canChangeZIndex(app: SnAppDto, type: '++' | '+' | '--' | '-') {
        if ((type === '++' || type === '--') && this.appSelection.selections.widgets.length > 1) {
            return false;
        }
        return this.appSelection.selections.widgets.every((w) => {
            const page = this.pageUtils.findPage(app, w);
            const parent = this.pageUtils.findParentWidget(app, w);

            const array = parent?.group ? parent.group.widgets : page.widgets;
            const index = array.indexOf(w);

            switch (type) {
                case '++':
                case '+': {
                    return index < array.length - 1;
                }
                case '--':
                case '-': {
                    return index > 0;
                }
            }
        });
    }

    /**
     * Determines if moved widgets will stay in the page boundaries
     */
    canMoveXY(app: SnAppDto, deltaX: number, deltaY: number): boolean {
        return this.appSelection.selections.widgets.every((widget) => {
            const page = this.pageUtils.findPage(app, widget);
            return widget.box.x + deltaX >= 0
                && widget.box.x + widget.box.width + deltaX <= page.pageWidth
                && widget.box.y + deltaY >= 0
                && widget.box.y + widget.box.height + deltaY <= page.pageHeight;
        });
    }

    addPage(app: SnAppDto, languages: LangDto[]) {

        const events: SnPageEventDto[] = [
            {
                id: UUID.UUID(),
                eventKey: 'onLoad',
                pipe: [],
            }
        ];
        const pageMostOnTheRight = this.pageUtils.findPageMostOnTheRight(app);
        const newPage: SnPageDto = {
            id: UUID.UUID(),
            canvas: {
                x: pageMostOnTheRight.canvas.x + pageMostOnTheRight.pageWidth + 50,
                y: pageMostOnTheRight.canvas.y,
            },
            css: {
                'background-color': app.pages[app.pages.length - 1]?.css['background-color']
            },
            pageWidth: app.pageWidth,
            pageHeight: app.pageHeight,
            displayName: this.translate.initializeLangs('', languages) as LangDto[],
            dataSources: [],
            variables: [],
            widgets: [],
            events,
            custom: {}
        };
        app.pages.push(newPage);

        this.select(app, newPage, 'page');
        this.notifyAddPage(app, newPage);
    }

    select(app: SnAppDto, element: SnPageDto | SnPageWidgetDto, type: AppSelectionType, openInspector?: OpenInspectorType) {
        this.appSelection.select(null, app, { element, type, openInspector });
    }

    remove(app: SnAppDto) {
        if (!this.canRemove()) {
            return;
        }

        const select = this.pageWidget.remove(app, this.appSelection.selections.widgets);

        for (const page of this.appSelection.selections.pages) {
            app.pages.splice(app.pages.indexOf(page), 1);
        }
        if (select) {
            this.select(app, select, 'widget');
        } else {
            this.appSelection.unselect(app);
        }
        this.notifyUpdate(app);
    }

    group(app: SnAppDto) {
        if (!this.canGroup()) {
            return;
        }
        const widget = this.pageWidget.group(app, this.appSelection.selections.widgets, false);
        this.select(app, widget, 'widget');
        this.notifyUpdate(app);
    }

    ungroup(app: SnAppDto) {
        if (!this.canUngroup()) {
            return;
        }
        const widgets = this.pageWidget.ungroup(app, this.appSelection.selections.widgets);
        this.appSelection.selectElts(app, widgets, 'widget', true);
        this.notifyUpdate(app);
    }

    changeZIndex(app: SnAppDto, type: '++' | '+' | '--' | '-') {
        if (!this.canChangeZIndex(app, type)) {
            return;
        }

        const sortSelections = _.orderBy(this.appSelection.selections.widgets.map((widget) => {
            const page = this.pageUtils.findPage(app, widget);
            const parent = this.pageUtils.findParentWidget(app, widget);
            const array = parent ? parent.group.widgets : page.widgets;
            const index = array.indexOf(widget);

            return {
                widget,
                array,
                index
            };
        }), ['index'], [type.includes('+') ? 'desc' : 'asc']);

        for (const elt of sortSelections) {
            // rm
            elt.array.splice(elt.index, 1);

            let newIndex = 0;
            switch (type) {
                case '++':
                    newIndex = elt.array.length;
                    break;
                case '+': {
                    newIndex = elt.index + 1;
                    break;
                }
                case '--':
                    newIndex = 0;
                    break;
                case '-':
                    newIndex = elt.index - 1;
                    break;
            }

            // insert
            elt.array.splice(newIndex, 0, elt.widget);
        }

        this.notifyUpdate(app);
    }

    translateXY(app: SnAppDto, deltaX: number, deltaY: number) {
        if (this.canMoveXY(app, deltaX, deltaY)) {
            const extras = [];
            this.appSelection.selections.widgets.forEach((widget) => {
                widget.box.x += deltaX;
                widget.box.y += deltaY;
            });
            this.notifyUpdate(app);
        }
    }

    resetHighlight(snApp: SnAppDto) {
        for (const ele of this.pageUtils.getAllElements(snApp).filter((e) => e.displayState)) {
            ele.displayState.highlight = false;
        }
    }

    applyHighlight(snApp: SnAppDto, element: SnPageWidgetDto | SnPageDto, sharedItems?: boolean) {
        this.resetHighlight(snApp);
        if (sharedItems) {
            this.pageUtils.getWidgets(snApp).forEach(w => {
                if (w.sharedId && w.sharedId === (element as SnPageWidgetDto).sharedId) {
                    w.displayState.highlight = true;
                }
            });
        }
        element.displayState.highlight = true;
    }

    updateRules(snApp: SnAppDto) {
        // recompose rules
        for (const widget of this.pageUtils.getWidgets(snApp)) {
            if (widget.displayState?.rule) {
                const findRule = widget.rules.find((r) => r.id === widget.displayState.rule.rule.id);
                if (!findRule) {
                    // disable rule after rm
                    widget.displayState.rule = null;
                    return;
                }
                if (findRule !== widget.displayState.rule?.rule) {
                    // update properties on rule
                    this.pageWidget.applyRule(findRule, widget);
                }
            }
        }
    }

    lockOrUnlock(): boolean {
        return this.appSelection.selections.widgets.some((widget) => !widget.custom.locked);
    }

    lockUnlock(snApp: SnAppDto, lock: boolean) {
        this.appSelection.selections.widgets.forEach((widget) => {
            widget.custom.locked = lock;
        });
        this.notifyUpdate(snApp);
    }

    lockWidgetProperty(snApp: SnAppDto, section: string, locked: boolean, widgets?: SnPageWidgetDto[]) {
        if (!widgets) {
            widgets = this.appSelection.selections.widgets;
        }
        widgets.forEach((widget: SnPageWidgetDto) => {
            if (section === 'widget') {
                widget.locked = locked;
            } else {
                if (!widget.lockedProperties) {
                    widget.lockedProperties = [];
                }
                const index = widget.lockedProperties.findIndex(prop => prop === section);
                if (locked && index === -1) {
                    widget.lockedProperties.push(section);
                }
                if (!locked && index !== -1) {
                    widget.lockedProperties.splice(index, 1);
                }
            }

        });
        this.notifyUpdate(snApp);
    }

    showOrHide(): boolean {
        return this.appSelection.selections.widgets.some((widget) => !widget.custom.hidden);
    }

    showHide(snApp: SnAppDto, hide: boolean) {
        this.appSelection.selections.widgets.forEach((widget) => {
            widget.custom.hidden = hide;
        });
        this.notifyUpdate(snApp);
    }


    shareSelected(snApp: SnAppDto) {
        if (!snApp.shared) { snApp.shared = []; }
        this.appSelection.selections.widgets.forEach(w => {
            let sharedIndex = -1;
            if (w.sharedId) {
                sharedIndex = _.findIndex(snApp.shared, sw => sw.sharedId === w.sharedId);
            }
            this.pageUtils.processWidgetTree(w, (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                if (root.id !== item.id) {
                    if (!item.sharedId) {
                        item.sharedId = item.id;
                    }
                }
            }, () => {
                const newSW: SnPageWidgetDto = _.cloneDeep(w);
                newSW.id = UUID.UUID();
                newSW.displayState = {};
                if (sharedIndex === -1) {
                    newSW.sharedId = UUID.UUID();
                    w.sharedId = newSW.sharedId;
                    snApp.shared.push(newSW);
                } else {
                    newSW.sharedId = w.sharedId;
                    snApp.shared.splice(sharedIndex, 1, newSW);
                }
                this.notifyUpdate(snApp);
            });

        });
    }

    deleteShared(snApp: SnAppDto) {
        this.appSelection.selections.sharedWidgets.forEach(w => {
            const index = snApp.shared ? snApp.shared.findIndex(sw => w.sharedId === sw.sharedId) : -1;
            this.pageUtils.getWidgets(snApp).forEach(widget => {
                if (widget.sharedId === w.sharedId) {
                    delete widget.sharedId;
                }
            });
            if (index !== -1) { snApp.shared.splice(index, 1); }
        });
        this.notifyUpdate(snApp);
    }

    addsharedtoallPages(snApp: SnAppDto) {
        const selection = this.appSelection.selections.sharedWidgets?.length > 0 ?
            this.appSelection.selections.sharedWidgets : this.appSelection.selections.widgets;
        selection.forEach(master => {
            snApp.pages.forEach(page => {
                const find = this.pageUtils.getWidgets(snApp, page).find((w) => w.sharedId && w.sharedId === master.sharedId);
                if (!find) {
                    const newWidget = _.cloneDeep(master);
                    newWidget.id = UUID.UUID();
                    this.pageUtils.processWidgetTree(newWidget, (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                        if (root.id !== item.id) {
                            item.id = UUID.UUID();
                        }
                    }, () => {
                        page.widgets.push(newWidget);
                        this.notifyUpdate(snApp);
                    });
                }
            });
        });
    }

    _hardUpdateReferences(widgets: SnPageWidgetDto[], master: SnPageWidgetDto,
        process: (root: SnPageWidgetDto, item: SnPageWidgetDto) => void,
        compeleted: () => void) {
        const refrences: SnPageWidgetDto[] = widgets.filter(w => w.sharedId && w.id !== master.id && w.sharedId === master.sharedId);
        refrences.forEach(ref => {

            Object.entries(master)
                .filter(([key, value]) => key !== 'id' && key !== 'displayState' && key !== 'name')
                .forEach(([key, value]) => {
                    if (value != null) {
                        ref[key] = _.cloneDeep(value);
                    }
                });
            this.pageUtils.processWidgetTree(ref, (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                process(root, item);
            }, () => {
                compeleted();
            });
        });
    }

    _mixedUpdateReferences(app: SnAppDto, references: SnPageWidgetDto[], master: SnPageWidgetDto, compeleted: () => void) {
        references.forEach(ref => {
            if (!ref.locked) {
                const oldRef = _.cloneDeep(ref);
                const oldRefwidgets: SnPageWidgetDto[] = [oldRef,
                    ...this.pageUtils.getChilds(oldRef, true, true)];
                const absoluteBoxes = oldRefwidgets.map(w => ({
                    id: w.id,
                    box: this.pageUtils.transformAbsolute(app, w)?.box
                }));
                const sharedWidgets: SnPageWidgetDto[] = [];
                this._hardUpdateReferences([ref], master,
                    (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                        const index = oldRefwidgets.findIndex((c: SnPageWidgetDto) => item.sharedId && c.sharedId === item.sharedId);
                        //set locked properties of shared widgets between oldRef && the (new) ref && restore ids
                        if (index !== -1) {
                            setLockedProperties(item, oldRefwidgets[index]);
                            sharedWidgets.push(item);
                        } else {
                            //new UUIDs for new widgets in the (new) ref
                            item.id = UUID.UUID();
                        }
                    },
                    () => {
                        //resetting if possible (if parent not deleted) locked children from old ref deleted in the (new) ref
                        this.pageUtils.processWidgetTree(oldRef, (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                            const sw = sharedWidgets.find((c: SnPageWidgetDto) => item.sharedId && c.sharedId === item.sharedId);
                            if (sw && item.group) {
                                if (sw.lockedProperties?.includes('input.table')) {
                                    sw.group?.widgets.splice(0, sw.group.widgets.length);
                                }
                                item.group.widgets
                                    .forEach((w, index) => {
                                        if (w.locked &&
                                            !sw.group?.widgets.find((c: SnPageWidgetDto) => c.sharedId && w.sharedId === c.sharedId)) {
                                            if (sw.group?.widgets) {
                                                sw.group.widgets.splice(index, 0, w);
                                            } else {
                                                sw.group = { widgets: [w] };
                                            }
                                        }
                                        const box = absoluteBoxes.find(b => b.id === w.id);
                                        if (box?.box) {
                                            w.box.x = box.box.x;
                                            w.box.y = box.box.y;
                                            this.pageUtils.transformLocal(app, w, false);
                                        }
                                        this.pageWidget.resizeStandardGroup(app, sw);
                                    });
                            }
                        }, () => {
                            compeleted();
                        });
                    });
            }
        });
    }

    hardUpdateShared(snApp: SnAppDto) {
        const widgets = this.pageUtils.getWidgets(snApp);
        const selection = this.appSelection.selections.sharedWidgets?.length > 0 ?
            this.appSelection.selections.sharedWidgets : this.appSelection.selections.widgets;
        selection.forEach(master => {
            this._hardUpdateReferences(widgets, master,
                (root: SnPageWidgetDto, item: SnPageWidgetDto) => {
                    if (root.id !== item.id) {
                        item.id = UUID.UUID();
                    }
                }, () => {
                    this.shareSelected(snApp);
                    this.notifyUpdate(snApp);
                });
        });
    }

    mixedUpdateShared(snApp: SnAppDto) {
        const widgets = this.pageUtils.getWidgets(snApp);
        const selection = this.appSelection.selections.sharedWidgets?.length > 0 ?
            this.appSelection.selections.sharedWidgets : this.appSelection.selections.widgets;
        selection.forEach(master => {
            const refrences: SnPageWidgetDto[] = widgets.filter(w => w.sharedId && w.id !== master.id && w.sharedId === master.sharedId);
            this._mixedUpdateReferences(snApp, refrences, master, () => {
                this.shareSelected(snApp);
                this.notifyUpdate(snApp);
            });
        });
    }

    /*
        notify
    */

    onUpdate(app: SnAppDto): Observable<any> {
        return this._get('app.update', app).pipe(
            tap(() => {
                this.update++;
            })
        );
    }

    onCheck(app: SnAppDto): Observable<any> {
        return this._get('app.do.check', app);
    }

    onChecked(app: SnAppDto): Observable<any> {
        return this._get('app.checked', app);
    }

    onRenameShared(app: SnAppDto): Observable<any> {
        return this._get('app.rename.shared', app);
    }


    onShowWidgetSelector(app: SnAppDto): Observable<any> {
        return this._get('app.show.widgets-selector', app);
    }

    onShowedWidgetSelector(app: SnAppDto): Observable<any> {
        return this._get('app.showed.widgets-selector', app);
    }

    onAddPage(app: SnAppDto): Observable<any> {
        return this._get('app.update.add-page', app);
    }

    onDrawing(app: SnAppDto): Observable<{ drawing: boolean; showBackdrop: boolean }> {
        return this._get('app.drawing', app);
    }

    onZoomPage(app: SnAppDto): Observable<any> {
        return this._get('app.zoom.page', app);
    }

    onShowLeftInspector(app: SnAppDto): Observable<any> {
        return this._get('app.left.inspector', app);
    }

    public onRefresh(app: SnAppDto): Observable<any> {
        return this._get('app.refresh', app);
    }

    notifyUpdate(app: SnAppDto, widget?) {
        this.updateRules(app);
        this._send('app.update', app, {});
    }

    notifyAddPage(app: SnAppDto, page: SnPageDto) {
        this._send('app.update.add-page', app, { page });
    }

    notifyShowWidgetSelector(app: SnAppDto, show: boolean) {
        this._send('app.show.widgets-selector', app, { show });
    }

    notifyShowedWidgetSelector(app: SnAppDto) {
        this._send('app.showed.widgets-selector', app, {});
    }

    notifyDrawing(app: SnAppDto, drawing: boolean, showBackdrop = false) {
        this._send('app.drawing', app, { drawing, showBackdrop: drawing && showBackdrop });
    }

    notifyCheck(app: SnAppDto) {
        this._send('app.do.check', app, {});
    }

    notifyChecked(app: SnAppDto) {
        this._send('app.checked', app, {});
    }

    public notifyRefresh(app: SnAppDto) {
        this._send('app.refresh', app, {});
    }

    notifyZoomPage(app: SnAppDto, page?: SnPageDto, scale?: number) {
        this._send('app.zoom.page', app, { page, scale });
    }

    notifyShowLeftInspector(app: SnAppDto, openInspector?: OpenInspectorType) {
        this._send('app.left.inspector', app, { openInspector });
    }

    notifyRenameShared(app: SnAppDto) {
        this._send('app.rename.shared', app, { sharedId: this.appSelection.selections.sharedWidgets?.[0]?.sharedId });
    }
}
