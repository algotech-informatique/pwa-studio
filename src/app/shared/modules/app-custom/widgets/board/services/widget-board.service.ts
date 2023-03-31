import { SnAppDto, SnPageBoxDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SessionsService } from '../../../../../services';
import { AppContextmenuActionExtension } from '../../../../app/dto';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../app/services';
import { boardZone, magnets } from '../../_data/data';
import * as _ from 'lodash';

@Injectable()
export class WidgetBoardService {
    constructor(
        private appActions: AppActionsService,
        private appSelections: AppSelectionService,
        private pageWidget: PageWidgetService,
        private sessionService: SessionsService,
        private pageUtils: PageUtilsService,
    ) { }

    extendedContextMenu(snApp: SnAppDto): AppContextmenuActionExtension[] {
        const drawZone: AppContextmenuActionExtension = {
            filter: () => {
                return this.appSelections.selections.widgets.length === 1 &&
                    this.appSelections.selections.widgets[0].typeKey === 'board';
            },
            onClick: () => {
                this.start(snApp, this.appSelections.selections.widgets[0].id);
            },
            title: 'SN-CONTEXTMENU.DRAW-ZONE',
            icon: 'fa-solid fa-draw-polygon',
        };

        const addMagnet: AppContextmenuActionExtension = {
            filter: () => {
                return this.appSelections.selections.widgets.length === 1 &&
                    this.appSelections.selections.widgets[0].typeKey === 'board';
            },
            onClick: (position) => {
                const board = this.pageUtils.getWidgets(snApp).find((w) => w.id === this.appSelections.selections.widgets[0].id);
                const page = this.pageUtils.findPage(snApp, board);

                const x = position.x - page.canvas.x - board.box.x;
                const y = position.y - page.canvas.y - board.box.y;

                const box: SnPageBoxDto = {
                    x: (x > board.box.width || x < 0) ? 0 : x,
                    y: (y > board.box.height || y < 0) ? 0 : y,
                    height: magnets.defaultHeight,
                    width: magnets.defaultWidth,
                };
                const magnet = this.pageWidget.buildWidget(magnets.typeKey, box, this.sessionService.active.datas.read.customer.languages);
                board.group = this.pageWidget.buildGroup(
                    [
                        ...(board.group ? board.group.widgets : []),
                        magnet
                    ]
                );

                this.appActions.notifyUpdate(snApp);
                this.appSelections.select(d3.event, snApp, {
                    element: board.group.widgets[board.group.widgets.length - 1], type: 'widget' });
            },
            title: 'SN-CONTEXTMENU.ADD-MAGNET',
            icon: 'fa-solid fa-magnet',
        };

        const showMagnets: AppContextmenuActionExtension = {
            filter: () => {
                return this.appSelections.selections.widgets.length === 1 &&
                    this.appSelections.selections.widgets[0].typeKey === 'board';
            },
            onClick: () => {
                Object.assign(this.appSelections.selections.widgets[0].displayState, {
                    hideMagnets: !this.appSelections.selections.widgets[0].displayState.hideMagnets,
                });
                showMagnets.icon = this.appSelections.selections.widgets[0].displayState.hideMagnets ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash';
                showMagnets.title = this.appSelections.selections.widgets[0].displayState.hideMagnets ?
                    'SN-CONTEXTMENU.SHOW-MAGNETS' : 'SN-CONTEXTMENU.HIDE-MAGNETS';
            },
            title: 'SN-CONTEXTMENU.HIDE-MAGNETS',
            icon: 'fa-solid fa-eye-slash',
        };


        return [
            drawZone,
            addMagnet,
            showMagnets
        ];
    }

    start(app: SnAppDto, boardId: string) {
        // send message for lock
        this.selectorHandler(app, boardId);
    }

    end(app: SnAppDto) {
        // send message for unlock
    }

    private selectorHandler(app: SnAppDto, boardId: string) {

        let group = null;
        let path = null;

        let zone = [];
        const self = this;
        const widget = this.pageUtils.getWidgets(app).find((w) => w.id === boardId);

        let circles = [];

        d3.select('body')
            .on('keydown', function () {
                if (!document.activeElement || (!(document.activeElement as HTMLElement).isContentEditable)) {
                    if (document.activeElement.tagName === 'BODY') {
                        if (d3.event.keyCode === 27) {
                            self.appActions.notifyUpdate(app);
                        }
                    }
                }
            });

        widget.displayState.drawingZone = true;
        const subsciption = this.appActions.onUpdate(app).subscribe((data) => {
            subsciption.unsubscribe();

            widget.displayState.drawingZone = false;

            zone = [];
            circles = [];

            if (path) {
                path.remove();
            }
            if (group) {
                group.remove();
            }
        });

        const renderCircle = (x, y, g) => {
            return g
                .append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', '7')
                .style('stroke-width', '4px')
                .style('stroke', 'var(--SN-COLOR-SELECTION)')
                .style('fill', '#fff')
                .style('pointer-events', 'none');
        };

        const renderZoneWithGuide = (data) => {
            if (data.length > 1) {
                if (Math.abs(data[data.length - 1][0] - data[data.length - 2][0]) < 10) {
                    data[data.length - 1][0] = data[data.length - 2][0];
                }
                if (Math.abs(data[data.length - 1][1] - data[data.length - 2][1]) < 10) {
                    data[data.length - 1][1] = data[data.length - 2][1];
                }
            }
            return data;
        };

        group = d3.select('#svg').select(`#container`).select(`.widgets[id*="${boardId}"]`)
            .append('g');
        const container = d3.select('#svg').select(`#container`).select(`.widget[id*="${boardId}"]`)
            .call(
                d3.drag()
                    .filter(function () {
                        return !d3.event.button;
                    })
                    .on('start', function () {
                        if (!group) {
                            group = d3.select('#svg').select(`#container`).select(`.widgets[id*="${boardId}"]`)
                                .append('svg');
                        }
                    })
                    .on('drag', function () {
                        const x = Math.round(d3.mouse(container.node())[0]);
                        const y = Math.round(d3.mouse(container.node())[1]);

                        if (!path) {
                            zone = [[x, y], [x + 1, y + 1]];
                            path = group
                                .append('path')
                                .attr('d', self.renderLine()(zone))
                                .style('stroke', 'blue')
                                .style('stroke', 'var(--SN-COLOR-SELECTION)')
                                .style('stroke-dasharray', '5')
                                .style('stroke-width', '4px')
                                .style('fill', 'transparent')
                                .style('pointer-events', 'none');

                            circles = [renderCircle(x, y, group), renderCircle(x + 1, y + 1, group)];

                        } else {
                            zone[1] = [x, y];
                            zone = renderZoneWithGuide(zone);
                            circles[1]
                                .attr('cx', zone[1][0])
                                .attr('cy', zone[1][1]);

                            path.attr('d', self.renderLine()(zone));
                        }

                    })
                    .on('end', function () {
                        if (path) {
                            const x = Math.round(d3.mouse(container.node())[0]);
                            const y = Math.round(d3.mouse(container.node())[1]);

                            path.attr('d', self.renderLine()(zone));
                            zone[1] = [x, y];
                            zone = renderZoneWithGuide(zone);
                            circles[1]
                                .attr('cx', zone[1][0])
                                .attr('cy', zone[1][1]);

                            circles.push(renderCircle(x, y, group));
                            container.call(
                                d3.drag()
                                    .on('start', null)
                                    .on('drag', null)
                                    .on('end', null)
                            );
                        }
                    })
            );

        container.on('mousemove', function () {
            if (zone.length > 1) {

                const x = Math.round(d3.mouse(container.node())[0]);
                const y = Math.round(d3.mouse(container.node())[1]);

                if (Math.abs(zone[0][0] - x) < 10 && Math.abs(zone[0][1] - y) < 10) {
                    circles[0]
                        .attr('r', '12')
                        .style('stroke-width', '5px');
                } else {
                    circles[0].attr('r', '7')
                        .style('stroke-width', '4px');
                }

                const guidedZone = renderZoneWithGuide([...zone, [x, y]]);

                circles[circles.length - 1]
                    .attr('cx', guidedZone[guidedZone.length - 1][0])
                    .attr('cy', guidedZone[guidedZone.length - 1][1]);
                path.attr('d', self.renderLine()(guidedZone));
            }
        }).on('click', function () {
            if (zone.length === 0) {
                return;
            }

            const x = Math.round(d3.mouse(container.node())[0]);
            const y = Math.round(d3.mouse(container.node())[1]);

            if (Math.abs(zone[0][0] - x) < 10 && Math.abs(zone[0][1] - y) < 10) {
                self.drawZone(app, widget, zone);
            } else {
                zone.push([x, y]);
                zone = renderZoneWithGuide(zone);
                circles.push(renderCircle(zone[zone.length - 1][0], zone[zone.length - 1][1], group));
                path.attr('d', self.renderLine()(zone));
            }

        });
    }

    renderLine() {
        return d3.line()
            .x(function (d) { return d[0]; })
            .y(function (d) { return d[1]; });
    }

    drawZone(app: SnAppDto, board: SnPageWidgetDto, zone) {
        if (!zone || zone.length < 3) {
            return;
        }

        // when zone draw
        const box = { x: zone[0][0], y: zone[0][1], height: 0, width: 0 };

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
        box.width = maxX - box.x;
        box.height = maxY - box.y;
        box.x -= board.box.x;
        box.y -= board.box.y;

        const newZone = this.pageWidget.buildWidget(boardZone.typeKey, box,
            this.sessionService.active.datas.read.customer.languages);
        newZone.custom = {
            d: this.renderLine()(zone) + 'Z',
            key: this.createZoneKey(app),
            overlay: false,
            grid: null,
        };
        board.group = this.pageWidget.buildGroup(
            [
                ...(board.group ? board.group.widgets : []),
                newZone
            ]
        );

        this.appActions.notifyUpdate(app);
        setTimeout(() => {
            this.appSelections.select(d3.event, app, {
                element: board.group.widgets[board.group.widgets.length - 1], type: 'widget' });
        }, 100);
    }

    private createZoneKey(app: SnAppDto): string {
        const zones: SnPageWidgetDto[] = this.pageUtils.getWidgets(app).filter((w) => w.typeKey === 'zone');
        let increment = zones?.length + 1;
        let key = zones?.length === 0 ? 'zone' : `zone${increment}`;
        while (_.find(zones, (zone: SnPageWidgetDto) => zone.custom?.key === key)) {
            increment++;
            key = `zone${increment}`;
        }
        return key;
    }

}
