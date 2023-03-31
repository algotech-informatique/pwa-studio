import { SnAppDto, SnPageBoxDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { AppLinksService } from '../../app-links/app-links.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';
import { PageWidgetService } from '../../page-widget/page-widget.service';
import { PageDragLandmarkService } from '../page-drag-landmark/page-drag-landmark.service';

@Injectable()
export class PageResizeWidgetService {

    constructor(
        private appLinks:  AppLinksService,
        private pageWidget: PageWidgetService,
        private pageUtils: PageUtilsService,
        private pageLandmark: PageDragLandmarkService) { }


    startResizeWidget(d3Context, app: SnAppDto) {
        const current = d3.select(d3Context);
        const idWidget = current.attr('id').split('.')[1];

        d3Context.deltaX = d3.event.x;
        d3Context.deltaY = d3.event.y;

        d3Context.widget = this.pageUtils.findWidget(app, idWidget)?.widget;
        const page = this.pageUtils.findPage(app, d3Context.widget);
        d3Context.page = page;

        d3Context.originParent = this.pageUtils.findParentWidget(app, d3Context.widget);
        d3Context.parent = this.pageUtils.transformAbsolute(app, d3Context.originParent);
        d3Context.maxWidth = d3Context.parent ? page.pageWidth - d3Context.parent.box.x : page.pageWidth;
        d3Context.maxHeight = d3Context.parent ? page.pageHeight - d3Context.parent.box.y : page.pageHeight;
        d3Context.minWidth = d3Context.parent ? -d3Context.parent.box.x : 0;
        d3Context.minHeight = d3Context.parent ? -d3Context.parent.box.y : 0;

        d3Context.dragged = false;
    }

    resizeWidget(d3Context, app: SnAppDto) {
        const current = d3.select(d3Context);
        const resizeFrom = current.attr('id').split('.')[0];

        const originBox = _.cloneDeep(d3Context.widget.box);
        if (!d3Context.dragged) {
            d3Context.box = originBox;
        }
        d3Context.dragged = true;

        let x = d3.event.x;
        let y = d3.event.y;

        const resizeDirection = this.getResizeDirection(resizeFrom);

        const preciseBox = this.getBox(d3Context, resizeDirection, d3Context.widget, x, y);

        x = this.pageUtils.round(x, d3.event.sourceEvent.shiftKey);
        y = this.pageUtils.round(y, d3.event.sourceEvent.shiftKey);

        const finalBox = this.getBox(d3Context, resizeDirection, d3Context.widget, x, y);

        const offsets = this.pageLandmark.calculLandmark(finalBox, preciseBox, app, d3Context.page,
            d3Context.parent, resizeDirection);

        if (d3.event.sourceEvent.ctrlKey) {
            // keep proportions
            const box: SnPageBoxDto = this.getBox(d3Context, resizeDirection, d3Context.widget, x, y, offsets);
            d3Context.widget.box = this.getBoxWithProportions(d3Context, box, d3Context.widget.box, resizeFrom, app);

        } else {
            d3Context.widget.box = this.getBox(d3Context, resizeDirection, d3Context.widget, x, y, offsets);
        }

        // adapt childs (height + width) => ratio
        if (d3Context.widget.group && this.pageUtils.isStandardGroup(d3Context.widget)) {
            for (const child of d3Context.widget.group.widgets) {
                if (child.custom.locked) { continue; }
                // enlarge / reduce
                const ratioHeight = (d3Context.widget.box.height / originBox.height);
                const ratioWidth = (d3Context.widget.box.width / originBox.width);
                child.box.y = this.pageUtils.round(child.box.y * ratioHeight, true);
                child.box.x = this.pageUtils.round(child.box.x * ratioWidth, true);
                child.box.height = this.pageUtils.round(child.box.height * ratioHeight, true);
                child.box.width = this.pageUtils.round(child.box.width * ratioWidth, true);
            }
        }

        this.pageLandmark.drawPosition(d3Context.widget.box, d3Context.page, true, d3Context.parent);
        this.appLinks.drawTransitions(app);
    }

    getResizeDirection(resizeFrom: string) {
        const result = {
            col: null,
            row: null,
        };
        if (resizeFrom === 'top' || resizeFrom === 'ne' || resizeFrom === 'nw') {
            result.row = -1;
        }

        if (resizeFrom === 'bottom' || resizeFrom === 'se' || resizeFrom === 'sw') {
            result.row = 1;
        }

        if (resizeFrom === 'left' || resizeFrom === 'nw' || resizeFrom === 'sw') {
            result.col = -1;
        }

        if (resizeFrom === 'right' || resizeFrom === 'ne' || resizeFrom === 'se') {
            result.col = 1;
        }

        return result;
    }

    getBox(d3Context, resizeDirection, widget: SnPageWidgetDto, x: number, y: number, offsets?) {

        const box = _.cloneDeep(widget.box);
        const _offsets = offsets ? offsets : { offsetRow: 0, offsetCol: 0 };

        x = Math.min(Math.max(d3Context.minWidth, x), d3Context.maxWidth);
        y = Math.min(Math.max(d3Context.minHeight, y), d3Context.maxHeight);

        if (resizeDirection.row === -1 &&
            (box.height + box.y - y - _offsets.offsetRow >= PageWidgetService.getType(widget).minHeight && y >= d3Context.minHeight)) {
            box.height += Math.round(box.y - y - _offsets.offsetRow);
            box.y = Math.round(y + _offsets.offsetRow);
        }

        if (resizeDirection.row === 1 &&
            (y - d3Context.box.y + _offsets.offsetRow >= PageWidgetService.getType(widget).minHeight
                && y <= d3Context.maxHeight)) {
            box.height = Math.round(y - d3Context.box.y + _offsets.offsetRow);
        }

        if (resizeDirection.col === -1 &&
            (box.width + box.x - x - _offsets.offsetCol >= PageWidgetService.getType(widget).minWidth && x >= d3Context.minWidth)) {
            box.width += Math.round(box.x - x - _offsets.offsetCol);
            box.x = Math.round(x + _offsets.offsetCol);
        }

        if (resizeDirection.col === 1 &&
            (x - d3Context.box.x + _offsets.offsetCol >= PageWidgetService.getType(widget).minWidth
                && x <= d3Context.maxWidth)) {
            box.width = Math.round(x - d3Context.box.x + _offsets.offsetCol);
        }

        return box;
    }

    getBoxWithProportions(d3Context, box: SnPageBoxDto, originBox: SnPageBoxDto, resizeFrom: string, app: SnAppDto) {
        if (resizeFrom === 'top' || resizeFrom === 'ne' || resizeFrom === 'bottom' || resizeFrom === 'se') {
            box.width = this.pageUtils.round(d3Context.box.width * (box.height / d3Context.box.height), true);
            if (box.x + box.width > d3Context.maxWidth) {
                // outside page
                box.y = originBox.y;
                box.width = d3Context.maxWidth - box.x;
                box.height = this.pageUtils.round(d3Context.box.height * (box.width / d3Context.box.width), true);
            }
        }
        if (resizeFrom === 'right' || resizeFrom === 'left' || resizeFrom === 'sw') {
            box.height = this.pageUtils.round(d3Context.box.height * (box.width / d3Context.box.width), true);
            if (box.y + box.height > d3Context.maxHeight) {
                // outside page
                box.x = originBox.x;
                box.height = d3Context.maxHeight - box.y;
                box.width = this.pageUtils.round(d3Context.box.width * (box.height / d3Context.box.height), true);
            }
        }
        if (resizeFrom === 'nw') {
            box.width = this.pageUtils.round(d3Context.box.width * (box.height / d3Context.box.height), true);
            box.x = originBox.x - (box.width - originBox.width);
            if (box.x < d3Context.minWidth) {
                // outside page
                return originBox;
            }
        }

        return box;
    }

    endResizeWidget(d3Context, app: SnAppDto) {
        this.pageWidget.resizeStandardGroup(app, d3Context.widget);
        this.pageLandmark.clearLandmark();
        return d3Context.dragged;
    }
}
