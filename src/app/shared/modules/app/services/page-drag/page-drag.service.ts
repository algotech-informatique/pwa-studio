import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { templatesLibrary } from '../../../app-custom/widgets/templates/templates';
import { AppSettings } from '../../dto';
import { AppActionsService } from '../app-actions/app-actions.service';
import { AppSelectionService } from '../app-selection/app-selection.service';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { ResizeOrientation } from '../page-utils/resize-orientation.enum';
import { AppDragPageService } from './app-drag-page/app-drag-page.service';
import { AppResizePageService } from './app-resize-page/app-resize-page.service';
import { AppSelectorService } from './app-selector/app-selector.service';
import { PageAddWidgetService } from './page-add-widget/page-add-widget.service';
import { PageDragWidgetService } from './page-drag-widget/page-drag-widget.service';
import { PageResizeWidgetService } from './page-resize-widget/page-resize-widget.service';
@Injectable()
export class PageDragService {


    constructor(
        private appActions: AppActionsService,
        private appSelector: AppSelectorService,
        private appSelection: AppSelectionService,
        private appDragPage: AppDragPageService,
        private pageUtils: PageUtilsService,
        private pageAddWidget: PageAddWidgetService,
        private pageDragWidget: PageDragWidgetService,
        private pageResizeWidget: PageResizeWidgetService,
        private appResizePage: AppResizePageService
    ) { }

    initializeDrag(app: SnAppDto, container) {
        this.initHandlers(app);

        this.dragPageHandler(app, container);
        this.dragWidgetHandler(app, container);
        this.resizeWidgetHandler(app, container);
        this.resizePageHandler(app, container);
    }

    initializeSelector(app: SnAppDto, container) {
        this.selectorHandler(app, container);
    }

    initializeAddWidget(app: SnAppDto, container, settings: AppSettings) {
        this.addWidgetHandler(app, container, settings);
        this.initializeSharedWidget(app, container, settings);
    }

    initializeSharedWidget(app: SnAppDto, container, settings: AppSettings) {
        this.addSharedWidgetHandler(app, container, settings);
    }

    private selectorHandler(app: SnAppDto, container) {
        const self = this;
        d3.select('#svg')
            .call(
                d3.drag()
                    .filter(() => !d3.event.button && d3.event.ctrlKey)
                    .on('start', (d, i, nodes) => {
                        self.appSelector.startSelect(nodes[i], app, container);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.appSelector.select(nodes[i], app, container);
                    })
                    .on('end', (d, i, nodes) => {
                        self.appSelector.endSelect(nodes[i], app);
                    })
            );
    }

    private addWidgetHandler(app: SnAppDto, container, settings: AppSettings) {
        const self = this;
        const templates: SnPageWidgetDto[] = _.flatMap(_.flatMap(templatesLibrary, 'subCategories'), 'widgets');

        d3.select('#widget-selector').selectAll('.template .widget')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.pageAddWidget.startAddWidget(nodes[i], container, app,
                            { template: templates.find((template) => template.id === d3.select(nodes[i]).attr('id')) });
                        self.appSelection.unselect(app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.pageAddWidget.addWidget(nodes[i], container, app);
                    })
                    .on('end', (d, i, nodes) => {
                        const widget = self.pageAddWidget.endAddWidget(nodes[i], app, settings.languages);
                        if (widget) {
                            self.appActions.notifyUpdate(app, widget);
                        }
                    })
            );
    }

    private addSharedWidgetHandler(app: SnAppDto, container, settings: AppSettings) {
        const self = this;

        d3.select('#shared-widgets').selectAll('.master')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(function (d, i, nodes) {
                        if (d3.event.button) {
                            return false;
                        }
                        return d3.select(this).classed('draggable');
                    })
                    .on('start', (d, i, nodes) => {
                        self.pageAddWidget.startAddWidget(nodes[i], container, app,
                            { template: app.shared.find((t) => t.sharedId === d3.select(nodes[i]).attr('id')) });
                        self.appSelection.unselect(app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.pageAddWidget.addWidget(nodes[i], container, app);
                    })
                    .on('end', (d, i, nodes) => {
                        const widget = self.pageAddWidget.endAddWidget(nodes[i], app, settings.languages);
                        if (widget) {
                            self.appActions.notifyUpdate(app, widget);
                        }
                    })
            );
    }

    private dragPageHandler(app: SnAppDto, container) {
        const self = this;

        container.selectAll('.page-selector')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button && !d3.event.ctrlKey)
                    .on('start', (d, i, nodes) => {
                        self.appDragPage.startDragPage(nodes[i], app, container);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.appDragPage.dragPage(nodes[i], app, container);
                    })
                    .on('end', (d, i, nodes) => {
                        if (self.appDragPage.endDragPage(nodes[i], app)) {
                            self.appActions.notifyUpdate(app);
                        }
                    })
            );
    }

    private dragWidgetHandler(app: SnAppDto, container) {
        const self = this;

        container.selectAll('.widget-child')
            .on('click', (d, i, nodes) => {
                if (self.pageDragWidget.clickedChild(nodes[i], app)) {
                    d3.event.stopPropagation();
                }
            });

        container.selectAll('.widget')
            .on('click', (d, i, nodes) => {
                if (d3.event.defaultPrevented) {
                    return;
                }
                self.pageDragWidget.clicked(nodes[i], app);
                d3.event.stopPropagation();
            });

        container.selectAll('.widget, .widget-child')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter((d, i, nodes) => {
                        const widget = self.pageUtils.findWidget(app, d3.select(nodes[i]).attr('id'))?.widget;
                        if (!widget || (d3.select(nodes[i]).attr('class').includes('widget-child') &&
                            !self.appSelection.isSelected(app, widget, ['brother']))) {

                            return false;
                        }
                        return !d3.event.button && !d3.event.ctrlKey;
                    })
                    .on('start', (d, i, nodes) => {
                        self.pageDragWidget.startDragWidget(nodes[i], app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.pageDragWidget.dragWidget(nodes[i], app);
                    })
                    .on('end', (d, i, nodes) => {
                        if (self.pageDragWidget.endDragWidget(nodes[i], app)) {
                            self.appActions.notifyUpdate(app);
                        }
                    })
            );
    }

    private resizeWidgetHandler(app: SnAppDto, container) {
        const self = this;

        container.selectAll('.resize')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.pageResizeWidget.startResizeWidget(nodes[i], app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.pageResizeWidget.resizeWidget(nodes[i], app);
                    })
                    .on('end', (d, i, nodes) => {
                        if (self.pageResizeWidget.endResizeWidget(nodes[i], app)) {
                            self.appActions.notifyUpdate(app);
                        }
                    })
            );
    }

    private initHandlers(app: SnAppDto) {
        d3.selectAll('.page-size-handler')
            .on('mouseenter', (d, i, nodes) => {
                const handler = this.pageUtils.getHandlerInfo(d3.select(nodes[i]).attr('id'));
                const page = this.pageUtils.findPageById(app, handler.pageId);

                // TODO we need to implement logic for when not to trigger hover (like when adding or resizing a widget, drawing a polyline)
                page.displayState.hovered = true;
                if (!page.displayState?.showHelper) {
                    page.displayState.showHelper = {
                        horizontal: false,
                        vertical: false
                    };
                }
                if (handler.orientation === ResizeOrientation.horizontal) {
                    page.displayState.showHelper.horizontal = true;
                } else if (handler.orientation === ResizeOrientation.vertical) {
                    page.displayState.showHelper.vertical = true;
                } else if (handler.orientation === ResizeOrientation.diagonal) {
                    page.displayState.showHelper.horizontal = true;
                    page.displayState.showHelper.vertical = true;
                }
            })
            .on('mouseleave', (d, i, nodes) => {
                const handler = this.pageUtils.getHandlerInfo(d3.select(nodes[i]).attr('id'));
                const page = this.pageUtils.findPageById(app, handler.pageId);

                page.displayState.hovered = false;
                page.displayState.showHelper.horizontal = false;
                page.displayState.showHelper.vertical = false;
            });
    }

    private resizePageHandler(app: SnAppDto, container) {
        const self = this;

        container.selectAll('.page-size-handler')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.appResizePage.startResizePage(nodes[i], app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.appResizePage.resizePage(nodes[i], app);
                    })
                    .on('end', (d, i, nodes) => {
                        if (self.appResizePage.endResizePage(nodes[i], app)) {
                            self.appActions.notifyUpdate(app);
                        }
                    })
            );
    }
}
