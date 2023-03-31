import { LangDto, SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { WidgetTypeDto } from '../../../dto';
import { AppSelectionService } from '../../app-selection/app-selection.service';
import { AppZoomService } from '../../app-zoom/app-zoom.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';
import { PageWidgetService } from '../../page-widget/page-widget.service';
import { PageDragLandmarkService } from '../page-drag-landmark/page-drag-landmark.service';

@Injectable()
export class PageAddWidgetService {

    static readonly VALID_COLOR = '#000000';
    static readonly INVALID_COLOR = '#f44336';

    constructor(
        private pageLandmark: PageDragLandmarkService,
        private pageWidget: PageWidgetService,
        private pageSelection: AppSelectionService,
        private pageUtils: PageUtilsService,
        private pageZoom: AppZoomService) { }

    getX(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[0]);
    }

    getY(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[1]);
    }

    getWidth(element: { template?: SnPageWidgetDto; type?: WidgetTypeDto }) {
        return element.template ? element.template.box.width :
            (element.type.defaultWidth ? element.type.defaultWidth : element.type.minWidth);
    }

    getHeight(element: { template?: SnPageWidgetDto; type?: WidgetTypeDto }) {
        return element.template ? element.template.box.height :
            (element.type.defaultHeight ? element.type.defaultHeight : element.type.minHeight);
    }

    startAddWidget(d3Context, container, app: SnAppDto, element: { template?: SnPageWidgetDto; type?: WidgetTypeDto }) {
        d3Context.element = element;

        d3Context.widgetContainer = d3.select('#left-inspector');

        d3Context.rect = container
            .append('rect')
            .attr('class', 'step-shape')
            .classed('draggable-step', true)
            .attr('x', d3.mouse(container.node())[0] - 10)
            .attr('y', d3.mouse(container.node())[1] - 10)
            .attr('width', this.getWidth(element))
            .attr('height', this.getHeight(element))
            .attr('fill', 'transparent')
            .attr('stroke', 'black')
            .attr('stroke-dasharray', '4, 4')
            .attr('stroke-width', '2px')
            .style('cursor', 'grab');

        d3Context.page = app.pages[0];
        d3Context.valid = false;
    }

    addWidget(d3Context, container, app: SnAppDto, parent?: SnPageWidgetDto) {

        if (d3Context.widgetContainer) {
            d3Context.widgetContainer.style('opacity', 0.3);
        }
        let x = Math.round(d3.mouse(container.node())[0]);
        let y = Math.round(d3.mouse(container.node())[1]);

        const width = this.getWidth(d3Context.element);
        const height = this.getHeight(d3Context.element);

        const preciseBox: SnPageBoxDto = {
            x,
            y,
            width,
            height,
        };

        const intersect = parent ? this.pageUtils.findPage(app, parent) : this.pageUtils.findPageIntersect(app, preciseBox);
        if (!intersect) {
            this.resetDraghover(app);
        }
        if (intersect && d3Context.page !== intersect) {
            this.resetDraghover(app);
            d3Context.page = intersect;
        }
        d3Context.page.displayState.draghover = true;

        if (!parent) {
            preciseBox.x = this.getX(d3Context.page);
            preciseBox.y = this.getY(d3Context.page);
        }
        preciseBox.x -= 10;
        preciseBox.y -= 10;

        const finalBox = {
            x: this.pageUtils.round(preciseBox.x, d3.event.sourceEvent.shiftKey),
            y: this.pageUtils.round(preciseBox.y, d3.event.sourceEvent.shiftKey),
            width,
            height,
        };

        const offsets = this.pageLandmark.calculLandmark(finalBox, preciseBox, app, d3Context.page, parent);
        x = Math.round(offsets.offsetCol + finalBox.x);
        y = Math.round(offsets.offsetRow + finalBox.y);

        finalBox.x = x;
        finalBox.y = y;

        d3Context.valid =
            !this.pageUtils.roundXInsidePage(x, width, parent ? parent.box.width : d3Context.page.pageWidth).outside &&
            !this.pageUtils.roundYInsidePage(y, height, parent ? parent.box.height : d3Context.page.pageHeight).outside;

        d3Context.rect.attr('stroke-width', () => d3Context.valid ? '1px' : '2px');
        d3Context.rect.attr('stroke', () => d3Context.valid ? PageAddWidgetService.VALID_COLOR : PageAddWidgetService.INVALID_COLOR);

        this.pageLandmark.drawPosition(finalBox, d3Context.page, false, parent);

        d3Context.box = finalBox;

        d3Context.rect.attr('x', (x + (parent ? 0 : d3Context.page.canvas.x)));
        d3Context.rect.attr('y', (y + (parent ? 0 : d3Context.page.canvas.y)));
    }

    endAddWidget(d3Context, app: SnAppDto, languages: LangDto[], parent?: SnPageWidgetDto) {
        this.pageLandmark.clearLandmark();
        if (d3Context.widgetContainer) {
            d3Context.widgetContainer.style('opacity', 1);
        }
        d3Context.rect.remove();

        this.resetDraghover(app);

        if (!d3Context.valid) {
            return false;
        }

        let widget = d3Context.element.template ?
            this.pageWidget.buildTemplate(d3Context.element.template, d3Context.box) :
            this.pageWidget.buildWidget(d3Context.element.type.typeKey, d3Context.box, languages);
        if (parent) {
            parent.group = this.pageWidget.buildGroup(
                [
                    ...(parent.group ? parent.group.widgets : []),
                    widget
                ]
            );
            widget = parent.group.widgets[parent.group.widgets.length - 1];
        } else {
            d3Context.page.widgets.push(widget);
        }

        if (d3Context.element.template?.afterTemplatePlaced) {
            this.applyRules(d3Context.element.template, widget, d3Context.page);
        }

        this.pageSelection.select(d3.event, app, { element: widget, type: 'widget' });
        return widget;
    }

    applyRules(template: SnPageWidgetDto, widget: SnPageWidgetDto, page: SnPageDto) {
        if (template.afterTemplatePlaced.box) {
            const allWidgets = [widget, ...this.pageUtils.getChilds(widget, true)];
            const templateWidgets = [template, ...this.pageUtils.getChilds(template, true)];

            template.afterTemplatePlaced.box.forEach((boxUpdate: { widgetName: string; anchors: string[] }) => {
                const widgetToUpdate = allWidgets.find(w => w.name === boxUpdate.widgetName);
                const widgetTemplate = templateWidgets.find((w) => w.name === boxUpdate.widgetName);
                if (!widgetToUpdate || !widgetTemplate) { return; }

                const parent = this.pageUtils.findParentWidgetFromWidgets(widgetToUpdate, allWidgets);
                const parentWidth = parent ? parent.box.width : page.pageWidth;
                const parentTemplate = this.pageUtils.findParentWidgetFromWidgets(widgetTemplate, templateWidgets);

                if (boxUpdate.anchors.includes('right') && boxUpdate.anchors.includes('left')) {
                    widgetToUpdate.box.x = this.getTemplateAnchorDistance(widgetTemplate, 'left', parentTemplate);
                    widgetToUpdate.box.width = parentWidth - widgetToUpdate.box.x -
                        this.getTemplateAnchorDistance(widgetTemplate, 'right', parentTemplate);
                } else if (boxUpdate.anchors.includes('left')) {
                    widgetToUpdate.box.x = this.getTemplateAnchorDistance(widgetTemplate, 'left', parentTemplate);
                } else if (boxUpdate.anchors.includes('right')) {
                    widgetToUpdate.box.x = parentWidth - this.getTemplateAnchorDistance(widgetTemplate, 'right', parentTemplate) -
                        widgetToUpdate.box.width;
                }
            });
        }
    }

    resetDraghover(app: SnAppDto) {
        for (const page of app.pages) {
            page.displayState.draghover = false;
        }
    }

    private getTemplateAnchorDistance(widget: SnPageWidgetDto, direction: string, parent?: SnPageWidgetDto): number {
        if (!parent) {
            return 0;
        }

        switch (direction) {
            case 'left':
                return widget.box.x;
            case 'right':
                return parent.box.width - (widget.box.x + widget.box.width);
            default:
                return 0;
        }
    }

}
