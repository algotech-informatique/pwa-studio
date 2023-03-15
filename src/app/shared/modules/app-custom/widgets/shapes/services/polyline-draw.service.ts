import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SessionsService } from '../../../../../services';
import {
    AppActionsService, AppSelectionService, AppZoomService, PageAddWidgetService, PageDragLandmarkService,
    PageUtilsService, PageWidgetService
} from '../../../../app/services';
import { polyline } from '../../_data/data';
import * as _ from 'lodash';
import { Subject } from 'rxjs';

@Injectable()
export class PolylineDrawService {
    constructor(
        private appZoom: AppZoomService,
        private appActions: AppActionsService,
        private appSelections: AppSelectionService,
        private pageWidget: PageWidgetService,
        private sessionService: SessionsService,
        private pageUtils: PageUtilsService,
        private pageLandmark: PageDragLandmarkService,
    ) { }


    initialize(app: SnAppDto) {
        if (app) {
            this.selectorHandler(app);
        }
    }

    initializeEdit(app: SnAppDto) {
        if (app) {
            this.polylinePointsDragHandler(app, d3.select('#svg').select('#container'));
        }
    }

    end(app: SnAppDto) {
        // send message for unlock
    }

    private selectorHandler(app: SnAppDto) {
        let drawigArea = null;
        let path = null;

        let page: SnPageDto = null;
        let pageLayout;

        let zone: number[][] = [];
        const self = this;

        let circles = [];

        d3.select('body')
            .on('keydown', () => {
                if (!document.activeElement || (!(document.activeElement as HTMLElement).isContentEditable)) {
                    if (document.activeElement.tagName === 'BODY') {
                        if (d3.event.keyCode === 27) {
                            self.appActions.notifyUpdate(app);
                        }
                        if (d3.event.keyCode === 13) {
                            finishLine();
                        }
                    }
                }
            });

        const subsciption = this.appActions.onUpdate(app).subscribe((data) => {
            subsciption.unsubscribe();
            zone = [];
            if (path) {
                path.remove();
            }
            if (drawigArea) {
                drawigArea.remove();
            }

            this.appZoom.lockZoom('mouse', false);
            _.forEach(circles, c => c.remove());
        });

        const renderCircle = (x, y, g) => g
            .append('circle')
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', '7')
            .style('stroke-width', '4px')
            .style('stroke', 'var(--SN-COLOR-SELECTION)')
            .style('fill', '#fff')
            .style('pointer-events', 'none');

        const renderZoneWithGuide = (data) => {
            if (data.length > 1) {
                if (Math.abs(data[data.length - 1][0] - data[data.length - 2][0]) < 10) {
                    data[data.length - 1][0] = data[data.length - 2][0];
                }
                if (Math.abs(data[data.length - 1][1] - data[data.length - 2][1]) < 10) {
                    data[data.length - 1][1] = data[data.length - 2][1];
                }
                data[data.length - 1][0] = Math.max(0, Math.min(page.pageWidth, data[data.length - 1][0]));
                data[data.length - 1][1] = Math.max(0, Math.min(page.pageHeight, data[data.length - 1][1]));
            }
            return data;
        };

        const finishLine = () => {
            // right click, finish the polyline
            d3.event.stopPropagation();
            d3.event.preventDefault();
            if (zone.length === 0) {
                return;
            }
            self.drawWidget(app, page, zone);
            nextStep.complete();
        };

        this.appZoom.lockZoom('mouse', false);

        drawigArea = d3.select('#svg')
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('cursor', 'crosshair')
            .attr('height', '100%')
            .attr('width', '100%')
            .style('outline', '1px solid var(--DRAWING-COLOR-SELECTION-SHADE, #2c6585)')
            .style('fill', 'transparent');

        const nextStep = new Subject();
        drawigArea.call(
            d3.drag()
                .filter(() => {
                    if (d3.event.button) {
                        return false;
                    }

                    const container = d3.select('#svg').select('#container');
                    const x = Math.round(d3.mouse(container.node())[0]);
                    const y = Math.round(d3.mouse(container.node())[1]);

                    page = this.pageUtils.findPageIntersect(app, {
                        x, y, width: 1, height: 1
                    }) || this.pageUtils.findPageIntersect(app, { x: x + 50, y: y + 50, width: 1, height: 1 });

                    if (!page) {
                        return false;
                    }
                    pageLayout = d3.select(`.page-layout[id*="${page.id}"]`);
                    return true;
                })
                .on('start', () => {

                })
                .on('drag', () => {

                    const x = Math.max(0, Math.min(page.pageWidth, Math.round(d3.mouse(pageLayout.node())[0])));
                    const y = Math.max(0, Math.min(page.pageHeight, Math.round(d3.mouse(pageLayout.node())[1])));

                    if (!path) {
                        zone = [[x, y], [x + 1, y + 1]];
                        zone = renderZoneWithGuide(zone);

                        path = pageLayout
                            .append('path')
                            .attr('d', self.renderLine()(zone))
                            .style('stroke', 'black')
                            .style('stroke-dasharray', '5')
                            .style('stroke-width', '4px')
                            .style('fill', 'transparent')
                            .style('pointer-events', 'none');

                        circles = [renderCircle(x, y, pageLayout), renderCircle(x + 1, y + 1, pageLayout)];
                    } else {
                        zone[1] = [x, y];
                        zone = renderZoneWithGuide(zone);
                        circles[1]
                            .attr('cx', zone[1][0])
                            .attr('cy', zone[1][1]);

                        path.attr('d', self.renderLine()(zone));
                    }

                })
                .on('end', () => {

                    if (path) {
                        const x = Math.round(d3.mouse(pageLayout.node())[0]);
                        const y = Math.round(d3.mouse(pageLayout.node())[1]);

                        path.attr('d', self.renderLine()(zone));
                        zone[1] = [x, y];
                        zone = renderZoneWithGuide(zone);
                        circles[1]
                            .attr('cx', zone[1][0])
                            .attr('cy', zone[1][1]);

                        circles.push(renderCircle(x, y, pageLayout));

                        drawigArea.call(
                            d3.drag()
                                .on('start', null)
                                .on('drag', null)
                                .on('end', null)
                        );
                        nextStep.next(null);
                    }
                })
        );

        nextStep.subscribe(() => {
            drawigArea.on('mousemove', () => {
                if (zone.length > 1) {

                    const x = Math.round(d3.mouse(pageLayout.node())[0]);
                    const y = Math.round(d3.mouse(pageLayout.node())[1]);

                    const guidedZone = renderZoneWithGuide([...zone, [x, y]]);
                    circles[circles.length - 1]
                        .attr('cx', guidedZone[guidedZone.length - 1][0])
                        .attr('cy', guidedZone[guidedZone.length - 1][1]);
                    path.attr('d', self.renderLine()(guidedZone));
                }
            })
                .on('dblclick', finishLine)
                .on('contextmenu', finishLine)
                .on('click', () => {
                    d3.event.stopPropagation();
                    if (zone.length === 0) {
                        return;
                    }

                    const x = Math.round(d3.mouse(pageLayout.node())[0]);
                    const y = Math.round(d3.mouse(pageLayout.node())[1]);
                    if (x !== zone[zone.length - 1][0] || y !== zone[zone.length - 1][1]) {
                        zone.push([x, y]);
                        circles.push(renderCircle(zone[zone.length - 1][0], zone[zone.length - 1][1], pageLayout));
                    }
                    zone = renderZoneWithGuide(zone);
                    path.attr('d', self.renderLine()(zone));

                });
        });
    }

    private renderLine() {
        return d3.line()
            .x((d) => d[0])
            .y((d) => d[1]);
    }

    private drawWidget(app: SnAppDto, page: SnPageDto, zone) {
        if (zone?.length === 0) {
            return;
        }

        const box: SnPageBoxDto = this.calculBox(zone);

        const widget: SnPageWidgetDto = this.pageWidget.buildWidget(polyline.typeKey, box,
            this.sessionService.active.datas.read.customer.languages);
        widget.custom = {
            d: this.renderLine()(zone)
        };
        page.widgets.push(widget);
        this.appActions.notifyUpdate(app);
        setTimeout(() => {
            this.appSelections.select(d3.event, app, {
                element: widget, type: 'widget'
            });
        }, 100);
    }

    private calculBox(zone) {
        const box: SnPageBoxDto = { x: zone[0][0], y: zone[0][1], height: 0, width: 0 };

        let maxX = zone[0][0];
        let maxY = zone[0][1];

        for (const element of zone) {
            if (element[0] < box.x) {
                box.x = element[0];
            }
            if (element[0] > maxX) {
                maxX = element[0];
            }
            if (element[1] < box.y) {
                box.y = element[1];
            }
            if (element[1] > maxY) {
                maxY = element[1];
            }
        }
        for (const element of zone) {
            element[0] -= box.x;
            element[1] -= box.y;
        }
        box.width = Math.max(20, maxX - box.x);
        box.height = Math.max(20, maxY - box.y);

        return box;
    }

    private polylinePointsDragHandler(app: SnAppDto, container) {
        const self = this;
        container.selectAll('.polyline>.handle:not(.dragevent-done)')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.drawPolyLine(nodes, container, app,
                            nodes[i], i > 0 ? nodes[i - 1] : null, i < nodes.length ? nodes[i + 1] : null);
                        self.appSelections.unselect(app);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.dragPolylinePoint(container, app, nodes[i], i);
                    })
                    .on('end', (d, i, nodes) => {
                        self.endDragPolylinePoint(nodes[i], i, container, app);
                        self.appActions.notifyUpdate(app);
                    })
            );
    }

    private drawPolyLine(nodes, container, app: SnAppDto, node, previous?, next?) {
        const box: SnPageBoxDto = {
            x: Math.round(d3.mouse(container.node())[0]),
            y: Math.round(d3.mouse(container.node())[1]),
            width: 7,
            height: 7,
        };
        const c = (n, type: 'cx' | 'cy'): number => (Number(d3.select(n).attr(type)));
        const pushPoint = (cx, cy, dx, dy) => {
            node.points.push(`${cx + dx},${cy + dy}`);
        };
        node.nodes = [];
        for (const n of nodes) {
            node.nodes.push([c(n, 'cx'), c(n, 'cy')]);
        }

        node.points = [];
        node.page = this.pageUtils.findPageIntersect(app, box);
        node.origin = {
            x: d3.mouse(container.node())[0],
            y: d3.mouse(container.node())[1]
        };
        node.deltaX = Math.abs(Math.round(d3.select(node).attr('cx') - d3.mouse(container.node())[0]));
        node.deltaY = Math.abs(Math.round(d3.select(node).attr('cy') - d3.mouse(container.node())[1]));

        if (previous) {
            pushPoint(c(previous, 'cx'), c(previous, 'cy'), node.deltaX, node.deltaY);
        }
        pushPoint(d3.mouse(container.node())[0], d3.mouse(container.node())[1], 0, 0);

        if (next) {
            pushPoint(c(next, 'cx'), c(next, 'cy'), node.deltaX, node.deltaY);
        }

        node.line = container.append('polyline')
            .attr('points', node.points.join(', '))
            .attr('class', 'step-shape')
            .classed('draggable-step', true)
            .attr('stroke', PageAddWidgetService.VALID_COLOR)
            .attr('stroke-dasharray', '4, 4')
            .attr('stroke-width', '2px')
            .style('fill', 'none')
            .style('cursor', 'grab');
    }

    private dragPolylinePoint(container, app: SnAppDto, node, index) {
        const box: SnPageBoxDto = {
            x: Math.round(d3.mouse(container.node())[0]),
            y: Math.round(d3.mouse(container.node())[1]),
            width: 7,
            height: 7,
        };
        const pos = (index > 0) ? 1 : 0;
        node.points[pos] = `${box.x},${box.y}`;
        box.x = this.getX(node.page);
        box.y = this.getY(node.page);

        this.pageLandmark.clearLandmark();
        this.pageLandmark.drawPosition(box, node.page, false);

        node.valid =
            !this.pageUtils.roundXInsidePage(box.x, 7, node.page.pageWidth).outside &&
            !this.pageUtils.roundYInsidePage(box.y, 7, node.page.pageHeight).outside;

        node.line
            .attr('points', node.points.join(', '))
            .attr('stroke', () => node.valid ? PageAddWidgetService.VALID_COLOR : PageAddWidgetService.INVALID_COLOR)
            .attr('stroke-width', () => node.valid ? '2px' : '3px');
    }

    private endDragPolylinePoint(node, i, container, app: SnAppDto) {
        const renderLine = () => (d3.line()
            .x((d) => d[0])
            .y((d) => d[1]));


        this.pageLandmark.clearLandmark();
        const n = d3.select(node);
        const zone = node.nodes.map((p, index) => {
            if (i === index) {
                const dx = d3.mouse(container.node())[0] - node.origin.x;
                const dy = d3.mouse(container.node())[1] - node.origin.y;
                return [p[0] + dx, p[1] + dy];
            } else {
                return [p[0], p[1]];
            }
        });
        node.line.remove();
        const widget = this.pageUtils.getWidgets(app).find(w => w.id === n.attr('id'));
        if (widget) {
            const findReplace = (widgets) => {
                const index = widgets.findIndex(w => widget.id === w.id);
                if (index !== -1) {
                    widgets.splice(index, 1, _.cloneDeep(widget));
                }
            };
            // absolute zone
            for (const p of zone) {
                p[0] += widget.box.x;
                p[1] += widget.box.y;
            }
            widget.box = this.calculBox(zone);
            widget.custom.d = renderLine()(zone);

            const parent = this.pageUtils.findParentWidget(app, widget);
            if (parent?.group) {
                findReplace(parent.group.widgets);
            } else {
                findReplace((node.page as SnPageDto).widgets);
            }

        }
    }

    private getX(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[0]);
    }

    private getY(page: SnPageDto) {
        return Math.round(d3.mouse(d3.select(`.page-layout[id*="${page.id}"]`).node())[1]);
    }
}
