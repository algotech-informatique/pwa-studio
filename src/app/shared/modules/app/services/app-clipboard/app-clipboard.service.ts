import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { AppSelectionService } from '../app-selection/app-selection.service';
import { AppClipboardDto, AppSelectionEvent } from '../../dto';
import { AppActionsService } from '../app-actions/app-actions.service';
import * as d3 from 'd3';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { PageWidgetService } from '../page-widget/page-widget.service';
import { from } from 'rxjs';
import { Clipboard } from '@angular/cdk/clipboard';

@Injectable()
export class AppClipboardService {

    clipboard: AppClipboardDto = {
        key: null,
        pages: [],
        widgets: [],
        styles: [],
        x: null,
        y: null,
    };

    constructor(
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private pageWidget: PageWidgetService,
        private pageUtils: PageUtilsService,
        private clipboardService: Clipboard,
    ) {
        window.addEventListener('focus', () => {
            if (!navigator.clipboard?.readText) {
                return;
            }
            from(navigator.clipboard.readText()).subscribe((text) => {
                try {
                    const object = JSON.parse(atob(text));
                    if (object?.key === 'at-app') {
                        this.clipboard = object;
                    }
                } catch (e) {
                }
                return null;
            });
        });
    }

    canCopy() {
        return this.appSelection.hasSelections('widget') || this.appSelection.hasSelections('page');
    }

    canCopyStyle() {
        if (!this.appSelection.hasSelections('widget')) {
            return false;
        };
        const uniq: SnPageWidgetDto[] =_.uniqBy(this.appSelection.selections.widgets, (widget: SnPageWidgetDto) => widget.typeKey);
        if (uniq.length !== 1) {
            return false;
        }
        return true;
    }

    isDisplayMatching(widget: SnPageWidgetDto, snApp: SnAppDto): boolean {
        return !PageWidgetService.getType(widget).display || PageWidgetService.getType(widget).display.length === 0 ||
            PageWidgetService.getType(widget).display.includes(snApp.environment);
    }

    canPasteStyle(app: SnAppDto) {

        if (this.clipboard.styles.length === 0) {
            return false;
        }
        const widget = this.clipboard.styles[0];

        if (!this.appSelection.hasSelections('widget')) {
            return false;
        }

        const elements: SnPageWidgetDto[] = this.appSelection.selections.widgets;
        if (!elements || elements.length === 0) {
            return false;
        }

        if (_.some(elements, (ele: SnPageWidgetDto) => ele.id === widget.id)) {
            return false;
        }

        if (!_.some(elements, (ele: SnPageWidgetDto) => ele.typeKey === widget.typeKey)) {
            return false;
        }

        return true;
    }

    canPaste(element: AppSelectionEvent, app: SnAppDto) {

        if (!element) {
            return this.clipboard.pages.length > 0;
        }

        if (element.type === 'widget') {
            const widget = element.element as SnPageWidgetDto;

            if (!widget.group) {
                return false;
            }
            const wid = this.clipboard.widgets.filter((w: SnPageWidgetDto) => this.isDisplayMatching(w, app));
            if (wid.length === 0) {
                return false;
            }
            // if every widgets accept parent
            return this.clipboard.widgets.every((w) => {
                if (PageWidgetService.getType(w).strictParents?.length > 0) {
                    return PageWidgetService.getType(w).strictParents.includes(widget.typeKey);
                } else {
                    return !this.pageWidget.listOfStrictParents().includes(widget.typeKey);
                }
            });
        } else {
            const page = element.element as SnPageDto;
            if (this.clipboard.widgets.some((w) => PageWidgetService.getType(w).strictParents &&
                PageWidgetService.getType(w).strictParents.length > 0)) {
                return false;
            }
            const wid = this.clipboard.widgets.filter((w: SnPageWidgetDto) => this.isDisplayMatching(w, app));
            if (wid.length === 0) {
                return false;
            }
            return (page && this.clipboard.widgets.length > 0) || (!page && this.clipboard.pages.length > 0);
        }
    }

    copy() {
        if (!this.canCopy()) {
            return;
        }
        this.clipboard = {
            key: 'at-app',
            pages: this.appSelection.selections.pages ? _.cloneDeep(this.appSelection.selections.pages) : [],
            widgets: this.appSelection.selections.widgets ? _.cloneDeep(this.appSelection.selections.widgets) : [],
            styles: [],
            x: null,
            y: null,
        };

        const boxes = this.clipboard.pages.length > 0 ?
            _.map(this.clipboard.pages, 'canvas') : _.map(this.clipboard.widgets, 'box');

        // find origin
        for (const box of boxes) {
            if (this.clipboard.x === null || this.clipboard.x > box.x) {
                this.clipboard.x = box.x;
            }
            if (this.clipboard.y === null || this.clipboard.y > box.y) {
                this.clipboard.y = box.y;
            }
        }
        this.clipboardService.copy(btoa(JSON.stringify(this.clipboard)));
    }

    copyStyle() {
        if (!this.canCopyStyle()) {
            return;
        }
        this.clipboard = {
            key: 'at-app',
            pages: [],
            widgets: [],
            styles: this.appSelection.selections.widgets,
            x: null,
            y: null,
        };
        this.clipboardService.copy(btoa(JSON.stringify(this.clipboard)));
    }

    pasteStyle(app: SnAppDto) {
        if (!this.canPasteStyle(app)) {
            return;
        }

        const wid: SnPageWidgetDto[] = this.appSelection.selections.widgets;
        wid.forEach((w: SnPageWidgetDto) => {
            w.css = this.clipboard.styles[0].css;
        });
        this.appActions.notifyUpdate(app);
    }

    paste(app: SnAppDto, data?: { parent: AppSelectionEvent; position }, deepPaste = false) {
        const parent = data ? data.parent : this.findParent(app);
        const position = data ? data.position : this.createPositionEvent(app, parent);

        if (!this.canPaste(parent, app)) {
            // try deep paste
            if (!deepPaste) {
                this.paste(app, null, true);
            }
            return;
        }

        const clipBoardClone: AppClipboardDto = _.cloneDeep(this.clipboard);
        // change uuid
        let changeIds: { oldId: string; newId: string }[];
        if (clipBoardClone.pages.length > 0) {
            changeIds = _.flatten(clipBoardClone.pages.map((p) => {
                const oldId = p.id;
                p.id = UUID.UUID();
                p.main = false;

                return [
                    ...this.changeWidgetsId(p.widgets),
                    { oldId, newId: p.id }
                ];
            }));

            this.changeEventsId(_.flatMap(clipBoardClone.pages, 'widgets'), changeIds);
        } else {
            changeIds = this.changeWidgetsId(clipBoardClone.widgets);
            this.changeEventsId(clipBoardClone.widgets, changeIds);
        }

        let offsetX = 0;
        let offsetY = 0;

        // graphical translation elements
        for (const widget of clipBoardClone.widgets) {
            const x = this.pageUtils.round(widget.box.x + position.x - clipBoardClone.x, true);
            const y = this.pageUtils.round(widget.box.y + position.y - clipBoardClone.y, true);

            const targetPage = parent.type === 'page' ?
                parent.element as SnPageDto :
                this.pageUtils.findPage(app, parent.element as SnPageWidgetDto);

            const insideX = this.pageUtils.roundXInsidePage(x, widget.box.width, targetPage.pageWidth);
            const insideY = this.pageUtils.roundYInsidePage(y, widget.box.height, targetPage.pageHeight);

            if (Math.sign(x - insideX.value) === -1 || Math.sign(y - insideY.value) === -1) {
                return;
            }

            offsetX = Math.max(offsetX, x - insideX.value);
            offsetY = Math.max(offsetY, y - insideY.value);

            widget.box.x = x;
            widget.box.y = y;
        }
        for (const widget of clipBoardClone.widgets) {
            widget.box.x -= offsetX;
            widget.box.y -= offsetY;
        }
        for (const p of clipBoardClone.pages) {
            p.canvas.x += position.x - clipBoardClone.x;
            p.canvas.y += position.y - clipBoardClone.y;
        }

        // push
        if (parent) {
            if (parent.type === 'widget') {
                const widget = parent.element as SnPageWidgetDto;
                widget.group = this.pageWidget.buildGroup(
                    [
                        ...(widget.group ? widget.group.widgets : []),
                        ...clipBoardClone.widgets
                    ]
                );
                this.pageWidget.resizeStandardGroup(app, widget);

                const widgets = _.takeRight(widget.group.widgets, clipBoardClone.widgets.length);
                this.appSelection.selectElts(app, widgets, 'widget');
            } else {
                const page = parent.element as SnPageDto;
                page.widgets.push(...clipBoardClone.widgets);
                this.appSelection.selectElts(app, clipBoardClone.widgets, 'widget');
            }
        } else {
            app.pages.push(...clipBoardClone.pages);
            this.appSelection.selectElts(app, clipBoardClone.pages, 'page');
        }
        this.copy();
        this.appActions.notifyUpdate(app);
    }

    findParent(app: SnAppDto): AppSelectionEvent {

        if (this.clipboard.pages.length !== 0) {
            return null;
        }

        if (this.appSelection.selections.pages.length > 0) {
            return {
                element: this.appSelection.selections.pages[0],
                type: 'page',
            };
        }

        if (this.appSelection.selections.widgets.length > 0) {
            const widget = this.appSelection.selections.widgets[0];
            if (widget.group && this.clipboard.widgets.length > 0 && widget.id !== this.clipboard.widgets[0].id) {
                return {
                    element: this.appSelection.selections.widgets[0],
                    type: 'widget',
                };
            }
            const parent = this.pageUtils.findParentWidget(app, widget);
            if (parent) {
                return {
                    element: parent,
                    type: 'widget',
                };
            }
            return {
                element: this.pageUtils.findPage(app, widget),
                type: 'page',
            };
        }
        if (this.clipboard.widgets.length !== 0) {
            const page = this.pageUtils.findPage(app, this.clipboard.widgets[0]);
            return (page) ?
                {
                    element: page,
                    type: 'page',
                } : null;
        }
        return null;
    }

    createPositionEvent(app: SnAppDto, element: AppSelectionEvent) {
        const pos = {
            x: 0,
            y: 0,
        };

        if (!element) {
            app.pages.forEach((page: SnPageDto) => {
                if (pos.x < (page.canvas.x + page.pageWidth)) {
                    pos.x = page.canvas.x + page.pageWidth;
                }
                if (pos.y < page.canvas.y) {
                    pos.y = page.canvas.y;
                }
            });
            pos.x += 50;
        }

        if (element) {
            const widget = this.pageUtils.getWidgets(app).find((w) => w.id === this.clipboard.widgets[0].id);
            if (element.type === 'page') {
                pos.x = widget ? this.pageUtils.transformAbsolute(app, widget).box.x : this.clipboard.widgets[0].box.x;
                pos.y = widget ? this.pageUtils.transformAbsolute(app, widget).box.y : this.clipboard.widgets[0].box.y;

                if (widget && this.pageUtils.findPage(app, widget)?.id === element.element?.id) {
                    pos.x += 10;
                    pos.y += 10;
                }

            } else {
                pos.x = this.clipboard.widgets[0].box.x;
                pos.y = this.clipboard.widgets[0].box.y;

                if (widget && this.pageUtils.findParentWidget(app, widget)?.id === element.element?.id) {
                    pos.x += 10;
                    pos.y += 10;
                }
            }
        }
        return pos;
    }


    createPosition(app: SnAppDto, element: AppSelectionEvent) {

        if (!element) {
            return this.getAbsPos();
        }

        const page = element.type === 'page' ? element.element : this.pageUtils.findPage(app, element.element as SnPageWidgetDto);
        const container = d3.select(`.page[id*="${page.id}"]`);

        const event = {
            x: Math.round(d3.mouse(container.node())[0]),
            y: Math.round(d3.mouse(container.node())[1]),
        };

        if (element.type === 'widget') {
            event.x -= this.pageUtils.transformAbsolute(app, element.element as SnPageWidgetDto).box.x;
            event.y -= this.pageUtils.transformAbsolute(app, element.element as SnPageWidgetDto).box.y;
        }
        return event;
    }

    getEleIntersection(app: SnAppDto, deepPaste = false): AppSelectionEvent {
        const position = this.getAbsPos();
        if (!position) {
            return null;
        }
        return this.pageUtils.findEleIntersect(app, { x: position.x, y: position.y, width: 1, height: 1 }, deepPaste);
    }

    private getAllWidgets(widgets: SnPageWidgetDto[]) {
        const allWidgets: SnPageWidgetDto[] = widgets.reduce((results, widget) => {
            results.push(widget);
            results.push(...this.pageUtils.getChilds(widget));
            return results;
        }, []);

        return allWidgets;
    }

    private changeWidgetsId(widgets: SnPageWidgetDto[]) {
        // change uuid
        return this.getAllWidgets(widgets).map((widget) => {
            const oldId = _.cloneDeep(widget.id);
            widget.id = UUID.UUID();
            for (const ev of widget.events) {
                const newEventId = UUID.UUID();
                let stringify = JSON.stringify(widget.custom);
                stringify = stringify.replace(new RegExp(ev.id, 'g'), newEventId);
                ev.id = newEventId;

                for (const pipe of ev.pipe) {
                    const newPipeId = UUID.UUID();
                    stringify = stringify.replace(new RegExp(pipe.id, 'g'), newPipeId);
                    pipe.id = newPipeId;
                }
                widget.custom = JSON.parse(stringify);
            }

            for (const rl of widget.rules) {
                for (const rlEv of rl.events) {
                    const newRuleEventId  = UUID.UUID();
                    rlEv.id = newRuleEventId;
                }
                const newRuleId = UUID.UUID();
                let stringify = JSON.stringify(widget.displayState);
                stringify = stringify.replace(new RegExp(rl.id, 'g'), newRuleId);
                stringify = stringify.replace(new RegExp(oldId, 'g'), widget.id);
                widget.displayState = JSON.parse(stringify);
                rl.id = newRuleId;
            }
            return { oldId, newId: widget.id };
        });
    }

    private changeEventsId(widgets: SnPageWidgetDto[], changesIds: { oldId: string; newId: string }[]) {
        for (const widget of this.getAllWidgets(widgets)) {
            let stringify = JSON.stringify(widget.events);
            for (const id of changesIds) {
                stringify = stringify.replace(new RegExp(id.oldId, 'g'), id.newId);
            }
            widget.events = JSON.parse(stringify);
        }
    }

    private getAbsPos() {
        if (!d3.event) {
            return null;
        }
        const container = d3.select(`#container-selector`);
        return {
            x: Math.round(d3.mouse(container.node())[0]),
            y: Math.round(d3.mouse(container.node())[1]),
        };
    }
}
