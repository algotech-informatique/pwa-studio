import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable, ElementRef } from '@angular/core';
import { SnCanvas } from '../../../smart-nodes/models/sn-canvas';
import * as _ from 'lodash';
import { AppSelectionEvent } from '../../dto';
import ResizeHandlerInfo from './resize-handler-info';
import { ResizeOrientation } from './resize-orientation.enum';

@Injectable()
export class PageUtilsService {

    readonly GRID_SIZE = 10;
    readonly GRID_BLOCK_SIZE = 40;
    readonly RESIZE_THICKNESS = 14;

    isWidgetShared(app: SnAppDto, widget: SnPageWidgetDto): boolean {
        return widget.sharedId != null &&
            app.shared.find(w => w.sharedId === widget.sharedId) != null;
    }

    isMasterWidget(app: SnAppDto, widget: SnPageWidgetDto): boolean {
        return _.some(app.pages, (p: SnPageDto) => p.widgets.includes(widget));
    }

    isStandardGroup(widget: SnPageWidgetDto) {
        return widget.typeKey === 'custom';
    }

    findParentWidget(app: SnAppDto, widget: SnPageWidgetDto, page?: SnPageDto) {
        return this.findParentWidgetFromWidgets(widget, this.getWidgets(app, page));
    }

    findParentWidgetFromWidgets(widget: SnPageWidgetDto, widgets: SnPageWidgetDto[]) {
        return widgets.find((w) => w.group?.widgets?.some((gw) => gw.id === widget.id));
    }

    findMainListWidget(app: SnAppDto, widget: SnPageWidgetDto, page: SnPageDto): SnPageWidgetDto | undefined {
        const parent = this.findParentWidget(app, widget, page);
        if (parent?.typeKey === 'list') {
            return parent;
        } else if (!parent) {
            return undefined;
        }
        return this.findMainListWidget(app, parent, page);
    }

    findMasterWidget(page: SnPageDto, widget: SnPageWidgetDto) {
        const tree = this.getTree(null, widget, page);
        if (tree[0] !== widget) {
            return tree[0];
        }
        return null;
    }

    findPage(app: SnAppDto, widget: SnPageWidgetDto): SnPageDto {
        return _.find(app.pages, (p: SnPageDto) => this.getWidgets(null, p).some((w) => w.id === widget.id));
    }

    findPageById(app: SnAppDto, pageId: string): SnPageDto {
        return _.find(app.pages, (page: SnPageDto) => page.id === pageId);
    }

    findPageAtPosition(app: SnAppDto, position: { x: number; y: number }): SnPageDto {
        return app.pages.find((page) =>
            _.inRange(position.x, page.canvas.x, page.canvas.x + page.pageWidth + 1)
            && _.inRange(position.y, page.canvas.y, page.canvas.y + page.pageHeight + 1)
        );
    }

    /**
     * Returns the page that is placed the most on the right in the canvas
     */
    findPageMostOnTheRight(app: SnAppDto): SnPageDto {
        // FIXME there is probably a more compact way of doing this using lodash
        let higherX = 0;
        let pageOnTheRight: SnPageDto;
        for (const page of app.pages) {
            if (!pageOnTheRight || page.canvas.x > higherX) {
                higherX = page.canvas.x;
                pageOnTheRight = page;
            }
        }
        return pageOnTheRight;
    }

    /**
     * Returns the page that is placed the most on the bottom in the canvas
     */
    findPageMostOnTheBottom(app: SnAppDto): SnPageDto {
        // FIXME there is probably a more compact way of doing this using lodash
        let higherY = 0;
        let pageOnTheBottom: SnPageDto;
        for (const page of app.pages) {
            if (!pageOnTheBottom || page.canvas.y > higherY) {
                higherY = page.canvas.y;
                pageOnTheBottom = page;
            }
        }
        return pageOnTheBottom;
    }

    findWidget(app: SnAppDto, id: string): { page: SnPageDto; widget: SnPageWidgetDto } {
        const widget: SnPageWidgetDto = _.find(this.getWidgets(app), (w: SnPageWidgetDto) => w.id === id);
        return {
            page: this.findPage(app, widget),
            widget,
        };
    }

    findEleIntersect(app: SnAppDto, absBox: SnPageBoxDto, checkWidgets: boolean): AppSelectionEvent {
        const pageIntersect = this.findPageIntersect(app, absBox);
        if (!pageIntersect) {
            return null;
        }

        if (checkWidgets) {
            const findWidget = (widgets: SnPageWidgetDto[]) => {
                for (const widget of widgets) {
                    const absWidget = this.transformAbsolute(app, widget);
                    if (!this.roundXInsidePage(absBox.x - pageIntersect.canvas.x - absWidget.box.x, absBox.width, absWidget.box.width)
                        .outside &&
                        !this.roundXInsidePage(absBox.y - pageIntersect.canvas.y - absWidget.box.y, absBox.height, absWidget.box.height)
                            .outside) {

                        if (widget.group) {
                            const findChild = findWidget(widget.group.widgets);
                            if (findChild) {
                                return findChild;
                            }
                        }
                        return widget;
                    }
                }
                return null;
            };

            const widgetIntersect = findWidget(pageIntersect.widgets);
            if (widgetIntersect) {
                return { element: widgetIntersect, type: 'widget' };
            }
        }

        return { element: pageIntersect, type: 'page' };
    }

    findPageIntersect(app: SnAppDto, absBox: SnPageBoxDto) {
        return app.pages.reduce((result, page) => {
            if (!this.roundXInsidePage(absBox.x - page.canvas.x, absBox.width, page.pageWidth).outside &&
                !this.roundXInsidePage(absBox.y - page.canvas.y, absBox.height, page.pageHeight).outside) {

                result = page;
            }
            return result;
        }, null);
    }

    transformAbsolute(app: SnAppDto, widget: SnPageWidgetDto, byClone = true) {
        if (!widget) {
            return null;
        }
        const tree = this.getTree(app, widget);
        const copy: SnPageWidgetDto = byClone ? _.cloneDeep(widget) : widget;
        copy.group = widget.group;
        copy.box.x = 0;
        copy.box.y = 0;
        for (const item of tree) {
            copy.box.x += item.box.x;
            copy.box.y += item.box.y;
        }
        return copy;
    }

    transformLocal(app: SnAppDto, widget: SnPageWidgetDto, byClone = true) {
        if (!widget) {
            return null;
        }
        const tree = this.getTree(app, widget).reverse();
        tree.shift();
        const copy: SnPageWidgetDto = byClone ? _.cloneDeep(widget) : widget;
        copy.group = widget.group;
        for (const item of tree) {
            copy.box.x -= item.box.x;
            copy.box.y -= item.box.y;
        }

        return copy;
    }

    getTree(app: SnAppDto, widget: SnPageWidgetDto, page?: SnPageDto) {
        if (!widget) {
            return [];
        }
        const widgets = this.getWidgets(app, page);
        const tree = [widget];

        let current: SnPageWidgetDto;
        do {
            current = widgets.find((w) => w.group && w.group.widgets.some((child) => child.id === tree[0].id));
            if (current) {
                tree.unshift(current);
            }
        } while (current);
        return tree;
    }

    getFamilly(app: SnAppDto, widget: SnPageWidgetDto, page?: SnPageDto): SnPageWidgetDto[] {
        const tree: SnPageWidgetDto[] = this.getTree(app, widget, page);
        const res = [];
        for (const w of tree) {
            res.push(...(w.group ? w.group.widgets : []));
            res.push(w);
        }
        return res;
    }

    getParentsPosition(app: SnAppDto, widget: SnPageWidgetDto, position: {x: number; y: number}): {x: number; y: number}  {
        const parentWidget = this.getParent(app, widget);
        if (parentWidget) {
            if ((parentWidget as SnPageWidgetDto).box) {
                position.x += (parentWidget as SnPageWidgetDto)?.box?.x;
                position.y += (parentWidget as SnPageWidgetDto)?.box?.y;
                return this.getParentsPosition(app, parentWidget as SnPageWidgetDto, position);
            }
            return position;
        }
        return position;

    }

    getParent(app: SnAppDto, widget: SnPageWidgetDto): SnPageWidgetDto | SnPageDto {
        const parent = this.findParentWidget(app, widget);
        if (parent) {
            return parent;
        }
        return this.findPage(app, widget);
    }

    getBrothers(app: SnAppDto, widget: SnPageWidgetDto): SnPageWidgetDto[] {
        const parent = this.findParentWidget(app, widget);
        if (parent) {
            return parent.group.widgets;
        }
        return this.findPage(app, widget).widgets;
    }

    getTreeWidgetOrderer(widget: SnPageWidgetDto, page?: SnPageDto): SnPageWidgetDto[] {
        return _.uniq(
            [...this.getFamilly(null, widget, page), ...page?.widgets, ...this.getWidgets(null, page)]
            , 'id');
    }

    overlap(box1: SnPageBoxDto, box2: SnPageBoxDto) {
        const r1 = { x1: box1.x, x2: box1.x + box1.width, y1: box1.y, y2: box1.y + box1.height };
        const r2 = { x1: box2.x, x2: box2.x + box2.width, y1: box2.y, y2: box2.y + box2.height };

        return !(r1.x1 > r2.x2 ||
            r2.x1 > r1.x2 ||
            r1.y1 > r2.y2 ||
            r2.y1 > r1.y2);
    }

    processWidgetTree(root: SnPageWidgetDto,
        process: (root: SnPageWidgetDto, item: SnPageWidgetDto) => void,
        completed: () => void): void {

        process(root, root);
        for (const w of this.getChilds(root, true)) {
            process(root, w);
        }
        completed();
    }

    getWidgets(app: SnAppDto, page?: SnPageDto): SnPageWidgetDto[] {
        return (page ? [page] : app.pages).reduce((results: SnPageWidgetDto[], p) => {
            results.push(...p.widgets);
            if (p.header) {
                results.push(p.header);
            }
            if (p.footer) {
                results.push(p.footer);
            }
            for (const widget of _.compact([p.header, p.footer, ...p.widgets])) {
                results.push(...this.getChilds(widget));
            }
            return results;
        }, []);
    }

    getAllElements(snApp: SnAppDto) {
        return [...snApp.pages, ...this.getWidgets(snApp)];
    }

    getChilds(widget: SnPageWidgetDto, deep = true, byClone = false) {
        if (!widget.group) {
            return [];
        }

        return widget.group.widgets.reduce((childs: SnPageWidgetDto[], child) => {
            childs.push((byClone) ? _.cloneDeep(child) : child);
            if (deep) {
                childs.push(...this.getChilds(child, true, byClone));
            }
            return childs;
        }, []);
    }

    getHTMLContainerCanvas(view: ElementRef) {
        return this.getHTMLElementCanvas(view.nativeElement);
    }

    roundXInsidePage(x: number, width: number, pageWidth: number, minWidth = 0) {
        if (x < minWidth) {
            return {
                value: minWidth,
                outside: true,
            };
        }

        const pageWidthMax = (pageWidth - width);

        if (x > pageWidthMax) {
            return {
                value: pageWidthMax,
                outside: true,
            };
        }
        return {
            value: x,
            outside: false,
        };
    }

    roundYInsidePage(y: number, height: number, pageHeight: number, minHeight = 0) {
        if (y < minHeight) {
            return {
                value: minHeight,
                outside: true,
            };
        }

        const heightMax = (pageHeight - height);

        if (y > heightMax) {
            return {
                value: heightMax,
                outside: true,
            };
        }
        return {
            value: y,
            outside: false,
        };
    }

    calculBox(widgets: SnPageWidgetDto[]): SnPageBoxDto {
        const x = _.min(_.map(widgets, (w: SnPageWidgetDto) => w.box.x));
        const y = _.min(_.map(widgets, (w: SnPageWidgetDto) => w.box.y));
        const columnsSpan = _.map(widgets, (w: SnPageWidgetDto) => (w.box.x - x) + w.box.width);
        const rowsSpan = _.map(widgets, (w: SnPageWidgetDto) => (w.box.y - y) + w.box.height);

        return {
            x,
            y,
            width: _.max(columnsSpan),
            height: _.max(rowsSpan),
        };
    }

    round(x: number, floating: boolean) {
        return !floating ? Math.round(x / this.GRID_SIZE) * this.GRID_SIZE : Math.round(x);
    }

    /**
     * Builds a page resize handler ID
     *
     * @param page to which the handler is attached
     * @param orientation of the handler (vertical, horizontal, diagonal)
     * @returns the ID
     */
    buildPageHandlerId(page: SnPageDto, orientation: ResizeOrientation): string {
        return ['page-size-handler', page.id, orientation].join('.');
    }

    /**
     * Decomposes a page resize handler ID into useful information about the handler itself
     *
     * @param pageHandlerId the ID of the handler to get info from
     * @returns infos of the handler (pageID, handler orientation)
     */
    getHandlerInfo(pageHandlerId: string): ResizeHandlerInfo {
        const bits = pageHandlerId.split('.');
        return {
            pageId: bits[1],
            orientation: ResizeOrientation[bits[2]]
        };
    }

    private getHTMLElementCanvas(element: Element): SnCanvas {
        if (!element) {
            return null;
        }
        const eltRect = element.getBoundingClientRect();
        return {
            x: eltRect.left,
            y: eltRect.top,
            width: eltRect.width,
            height: eltRect.height
        };
    }
}
