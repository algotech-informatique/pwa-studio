import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { AppLinksService } from '../../app-links/app-links.service';
import { AppSelectionService } from '../../app-selection/app-selection.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';
import { PageWidgetService } from '../../page-widget/page-widget.service';
import { PageDragLandmarkService } from '../page-drag-landmark/page-drag-landmark.service';

@Injectable()
export class PageDragWidgetService {

    constructor(
        private appLinks:  AppLinksService,
        private pageUtils: PageUtilsService,
        private pageWidget: PageWidgetService,
        private pageLandmark: PageDragLandmarkService,
        private pageSelections: AppSelectionService) { }

    clicked(d3Context, app: SnAppDto) {
        const widget = this.pageUtils.findWidget(app, d3.select(d3Context).attr('id'))?.widget;
        if (!widget.custom.locked) {
            this.pageSelections.select(d3.event, app, { element: widget, type: 'widget' });
        }
    }

    clickedChild(d3Context, app: SnAppDto) {
        const widget = this.pageUtils.findWidget(app, d3.select(d3Context).attr('id'))?.widget;
        if (this.pageSelections.isSelected(app, widget, ['brother', 'master', 'childs', 'uncle'])) {
            this.clicked(d3Context, app);
            return true;
        }
        if (widget.custom.locked) {
            return true;
        }
        return false;
    }


    getX(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[0]);
    }

    getY(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[1]);
    }

    startDragWidget(d3Context, app: SnAppDto) {
        const current = d3.select(d3Context);

        const findWidget =  this.pageUtils.findWidget(app, current.attr('id'));
        d3Context.widget = findWidget?.widget;
        const page = this.setPage(app, findWidget?.page);
        d3Context.page = page;

        d3Context.deltaX = this.getX(d3Context.page);
        d3Context.deltaY = this.getY(d3Context.page);

        // bring to front
        // d3Context.page.widgets.splice(d3Context.page.widgets.indexOf(d3Context.widget), 1);
        // d3Context.page.widgets.push(d3Context.widget);

        d3Context.dragged = false;
    }

    dragWidget(d3Context, app: SnAppDto) {
        if ((d3Context.widget as SnPageWidgetDto).custom.locked ||
           (this.pageWidget.isYLocked(d3Context.widget) && this.pageWidget.isXLocked(d3Context.widget))) { return; }

         // initialize selections and context
         if (!d3Context.dragged) {
            d3Context.page.displayState.hovered = true;
            this.pageSelections.select(d3.event, app, { element: d3Context.widget, type: 'widget', ignoreUnselect: true });
            d3Context.widgets = this.pageSelections.selections.widgets.filter((w) =>
                this.pageUtils.getWidgets(app, d3Context.page).includes(w));
            d3Context.originParent = d3Context.widgets.length > 0 ? this.pageUtils.findParentWidget(app, d3Context.widgets[0]) : null;
            d3Context.parent = this.pageUtils.transformAbsolute(app, d3Context.originParent);
            d3Context.minWidth = d3Context.parent ? -d3Context.parent.box.x : 0;
            d3Context.minHeight = d3Context.parent ? -d3Context.parent.box.y : 0;
            d3Context.maxWidth = d3Context.parent ? d3Context.page.pageWidth - d3Context.parent.box.x : d3Context.page.pageWidth;
            d3Context.maxHeight = d3Context.parent ? d3Context.page.pageHeight - d3Context.parent.box.y : d3Context.page.pageHeight;
            d3Context.freePosition = app.pages.length > 1 && !d3Context.parent;

            for (const widget of d3Context.widgets) {
                widget.displayState.draghover = true;
            }
        }

        const originBox = this.pageUtils.calculBox(d3Context.widgets);
        if (!d3Context.dragged) {
            d3Context.deltaX = originBox.x - d3Context.deltaX;
            d3Context.deltaY = originBox.y - d3Context.deltaY;
        }
        d3Context.page.displayState.draghover = true;
        d3Context.dragged = true;

        const preciseBox: SnPageBoxDto = this.calculateBox(d3Context, app, {
            x: this.pageWidget.isXLocked(d3Context.widget) ? originBox.x : this.getX(d3Context.page) + d3Context.deltaX,
            y: this.pageWidget.isYLocked(d3Context.widget) ? originBox.y : this.getY(d3Context.page) + d3Context.deltaY,
            width: originBox.width,
            height: originBox.height,
        }, false);

        const finalBox: SnPageBoxDto = this.calculateBox(d3Context, app, preciseBox, true);

        const offsets = this.pageLandmark.calculLandmark(finalBox, preciseBox, app, d3Context.page, d3Context.parent);
        const deltaCol = Math.round(offsets.offsetCol + finalBox.x) - originBox.x;
        const deltaRow = Math.round(offsets.offsetRow + finalBox.y) - originBox.y;

        finalBox.x += offsets.offsetCol;
        finalBox.y += offsets.offsetRow;

        for (const widget of d3Context.widgets) {
            widget.box.x += deltaCol;
            widget.box.y += deltaRow;
        }

        d3Context.outside =
            this.pageUtils.roundXInsidePage(finalBox.x, finalBox.width, d3Context.page.pageWidth).outside ||
            this.pageUtils.roundYInsidePage(finalBox.y, finalBox.height, d3Context.page.pageHeight).outside;

        // check box intersect new page
        if (!d3Context.originParent) {
            this.changePage(d3Context, app, finalBox, d3Context.widgets);
        }

        // todo calcul box
        this.pageLandmark.drawPosition(finalBox, d3Context.page, false, d3Context.parent);
        this.appLinks.drawTransitions(app);
    }

    changePage(d3Context, app: SnAppDto, box: SnPageBoxDto, widgets: SnPageWidgetDto[]) {
        const absBox:  SnPageBoxDto = {
            x: box.x + d3Context.page.canvas.x,
            y: box.y + d3Context.page.canvas.y,
            height: box.height,
            width: box.width,
        };

        const intersect = this.pageUtils.findPageIntersect(app, absBox);
        if (intersect && intersect !== d3Context.page) {
            // intersect new page
            const oldPage = this.pageUtils.findPageById(app, d3Context.page.id);
            oldPage.displayState.hovered = false;
            _.remove(d3Context.page.widgets, ((w) => widgets.includes(w)));

            for (const w of widgets) {
                w.box.x += (d3Context.page.canvas.x - intersect.canvas.x);
                w.box.y += (d3Context.page.canvas.y - intersect.canvas.y);
            }
            intersect.widgets.push(...widgets);
            const newPage = this.setPage(app, intersect);
            newPage.displayState.hovered = true;
            d3Context.page = newPage;
            d3Context.maxWidth = d3Context.parent ? d3Context.page.pageWidth - d3Context.parent.box.x : d3Context.page.pageWidth;
            d3Context.maxHeight = d3Context.parent ? d3Context.page.pageHeight - d3Context.parent.box.y : d3Context.page.pageHeight;
            return ;
        }
        return null;
    }

    setPage(app: SnAppDto, page: SnPageDto): SnPageDto {
        this.resetDraghover(app.pages);

        if (!page) {
            return null;
        }

        // bring to front
        app.pages.splice(app.pages.indexOf(page), 1);
        app.pages.push(page);

        return page;
    }

    endDragWidget(d3Context, app: SnAppDto) {
        if (!d3Context.dragged) {
            return false;
        }

        // redraw widget inside page
        if (d3Context.outside && !d3Context.parent) {
            d3Context.freePosition = false;
            this.dragWidget(d3Context, app);
        }

        this.pageWidget.resizeStandardGroup(app, d3Context.widget);

        const page = this.pageUtils.findPageById(app, d3Context.page.id);
        page.displayState.hovered = false;

        this.resetDraghover(app.pages);
        this.resetDraghover(d3Context.widgets);

        this.pageLandmark.clearLandmark(d3Context.page);
        return true;
    }

    private calculateBox(d3Context, app: SnAppDto, box: SnPageBoxDto, round: boolean) {
        const x = round ? this.pageUtils.round(box.x, d3.event.sourceEvent.shiftKey) : box.x;
        const y = round ? this.pageUtils.round(box.y, d3.event.sourceEvent.shiftKey) : box.y;

        return {
            x: d3Context.freePosition ? x : this.pageUtils.roundXInsidePage(x, box.width, d3Context.maxWidth, d3Context.minWidth).value,
            y: d3Context.freePosition ? y : this.pageUtils.roundYInsidePage(y, box.height, d3Context.maxHeight, d3Context.minHeight).value,
            width: box.width,
            height: box.height,
        };
    }

    private resetDraghover(elts: (SnPageDto|SnPageWidgetDto)[]) {
        for (const page of elts) {
            page.displayState.draghover = false;
        }
    }
}
