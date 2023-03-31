import { SnAppDto, SnPageBoxDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { AppSelectionService } from '../../app-selection/app-selection.service';
import * as _ from 'lodash';
import { AppZoomService } from '../../app-zoom/app-zoom.service';

interface LandmarkBox {
    color: string;
    strokeWidth: number;
    box: SnPageBoxDto;
    landmarks: {
        col: number;
        row: number;
        percents: number[];
    }[];
}

interface LandmarkLine {
    color: string;
    strokeWidth: number;
    box: SnPageBoxDto;
    position: number;
    preciseOffset: number;
    offset: number;
}

@Injectable()
export class PageDragLandmarkService {

    // page
    readonly GRP_LANDMARK_COLOR = '#27AE60';
    readonly PAGE_LANDMARK_COLOR = '#E05C23';
    readonly PAGE_LANDMARK_STROKE_WIDTH = 1;
    percentsPage = [{
        value: 0,
        compare: [0]
    }, {
        value: 100,
        compare: [100]
    }, {
        value: 25,
        compare: [50]
    }, {
        value: 75,
        compare: [50]
    }, {
        value: 50,
        compare: [50]
    }];

    // widget
    readonly WIDGET_LANDMARK_COLOR = '#1e88e5';
    readonly WIDGET_LANDMARK_STROKE_WIDTH = 1;
    percentsWidgets = [{
        value: 0,
        compare: [0, 100]
    }, {
        value: 100,
        compare: [0, 100]
    }, {
        value: 50,
        compare: [50]
    }];

    constructor(
        private pageSelection: AppSelectionService,
        private pageZoom: AppZoomService) {
    }

    getContainer(page: SnPageDto) {
        return d3.select(`.container-landmarks[id*="${page.id}"]`);
    }

    clearLandmark(page?: SnPageDto) {
        d3.selectAll('.container-landmarks').selectAll('.landmark').remove();
        d3.selectAll('.container-landmarks').selectAll('.position').remove();
    }

    absBox(box: SnPageBoxDto, master?: SnPageWidgetDto): SnPageBoxDto {
        if (!master) {
            return box;
        }
        return {
            x: box.x + master.box.x,
            y: box.y + master.box.y,
            width: box.width,
            height: box.height,
        };
    }

    calculLandmark(rect: SnPageBoxDto, preciseRect: SnPageBoxDto, app: SnAppDto, page: SnPageDto,
        master?: SnPageWidgetDto, resizeDirection?) {
        // draw all intersections

        this.clearLandmark();
        const _rect = this.absBox(rect, master);
        const _preciseRect = this.absBox(preciseRect, master);

        const widgets = (master ? (master.group ? master.group.widgets : []) : page.widgets).filter((w) =>
            this.pageSelection.selections.widgets.indexOf(w) === -1);

        const boxPage: SnPageBoxDto = {
            x: 0,
            y: 0,
            width: app.pageWidth,
            height: app.pageHeight,
        };

        const boxes: LandmarkBox[] = _.compact([...widgets.map((widget) => ({
                color: this.WIDGET_LANDMARK_COLOR,
                strokeWidth: this.WIDGET_LANDMARK_STROKE_WIDTH,
                box: this.absBox(widget.box, master),
                landmarks: this.calculLandmarks(this.absBox(widget.box, master), 'widget'),
            })), {
            color: this.PAGE_LANDMARK_COLOR,
            strokeWidth: this.PAGE_LANDMARK_STROKE_WIDTH,
            box: boxPage,
            landmarks: this.calculLandmarks(boxPage, 'page'),
        }, master ? {
            color: this.GRP_LANDMARK_COLOR,
            strokeWidth: this.PAGE_LANDMARK_STROKE_WIDTH,
            box: master.box,
            landmarks: this.calculLandmarks(master.box, 'page'),
        } : null]);

        let landmarkLineCol: LandmarkLine = null;
        let landmarkLineRow: LandmarkLine = null;

        for (const box of boxes) {
            for (const landmark of box.landmarks) {
                for (const percent of landmark.percents) {
                    landmarkLineCol = this.calculateLandmarkLine(landmarkLineCol, _preciseRect,
                        _rect, landmark.col, percent, box, resizeDirection?.col, 'col');

                    landmarkLineRow = this.calculateLandmarkLine(landmarkLineRow, _preciseRect,
                        _rect, landmark.row, percent, box, resizeDirection?.row, 'row');
                }
            }
        }

        const newRect: SnPageBoxDto = {
            x: landmarkLineCol ? Math.round(landmarkLineCol.offset + _rect.x) : _rect.x,
            y: landmarkLineRow ? Math.round(landmarkLineRow.offset + _rect.y) : _rect.y,
            width: _rect.width,
            height: _rect.height,
        };

        if (landmarkLineCol) {
            this.drawLandmarkLine(landmarkLineCol, newRect, 'col', page);
        }
        if (landmarkLineRow) {
            this.drawLandmarkLine(landmarkLineRow, newRect, 'row', page);
        }

        return {
            offsetCol: landmarkLineCol ? landmarkLineCol.offset : 0,
            offsetRow: landmarkLineRow ? landmarkLineRow.offset : 0
        };
    }

    drawPosition(rect: SnPageBoxDto, page: SnPageDto, resizing: boolean = false, master?: SnPageWidgetDto) {
        const width = 60;
        const height = 30;
        const offset = 10 * this.pageZoom.scaleZoom;

        const _rect = this.absBox(rect, master);

        const x = (_rect.x + (_rect.width / 2)) - (width / 2);
        const y = _rect.y + _rect.height + offset;

        const varA = resizing ? rect.width : rect.x;
        const varB = resizing ? rect.height : rect.y;

        // draw vertical line
        this.getContainer(page).append('foreignObject')
            .classed('position', true)
            .attr('x', x)
            .attr('y', y)
            .attr('width', width)
            .attr('height', height)
            .style('overflow', 'visible')
            .html(() =>
                `<b' style='display: block; background-color: #FFF; text-align: center; font-size: 12px; padding: 5px;
                    transform: scale(${this.pageZoom.scaleZoom}); width: 60px;
                    box-shadow: inset 0 0 3px #000; border-radius: 4px'>
                    ${varA}, ${varB}
                </b>`
            );
    }

    private calculateLandmarkLine(current: LandmarkLine, preciseRect: SnPageBoxDto, rect: SnPageBoxDto, position: number,
        percent: number, box: LandmarkBox, resizeDirection: number, direction: 'col' | 'row') {

        const offsetMax = d3.event.sourceEvent.shiftKey ? 1 : 5;

        const preciseOffset = Math.round(position - this.calculLandmarksByPercent(preciseRect, percent)[direction]);
        const offset = Math.round(position - this.calculLandmarksByPercent(rect, percent)[direction]);

        let result: LandmarkLine = current;
        let anchoring = false;

        if ((Math.abs(preciseOffset) < offsetMax) && (!current || Math.abs(preciseOffset) <= Math.abs(current.preciseOffset))) {
            anchoring = true;
            if (resizeDirection) {
                switch (percent) {
                    case (resizeDirection === -1 ? 100 : 0): {
                        anchoring = false;
                        break;
                    }
                    case 50: {
                        anchoring = false;
                        break;
                    }
                }
            }
        }

        if (anchoring) {
            result = {
                color: box.color,
                strokeWidth: box.strokeWidth,
                box: box.box,
                position,
                preciseOffset,
                offset
            };
        }

        return result;
    }

    private drawLandmarkLine(line: LandmarkLine, rect: SnPageBoxDto, direction: 'col' | 'row', page: SnPageDto) {
        const position = line.position;
        const yMin = _.min([line.box.y, rect.y]);
        const yMax = _.max([line.box.y + line.box.height, rect.y + rect.height]);
        const xMin = _.min([line.box.x, rect.x]);
        const xMax = _.max([line.box.x + line.box.width, rect.x + rect.width]);

        const strokeWidth = line.strokeWidth * this.pageZoom.scaleZoom;
        const offset = strokeWidth / 2;
        // draw vertical line
        this.getContainer(page).append('rect')
            .classed('landmark', true)
            .attr('x', (direction === 'col' ? position : xMin) - offset)
            .attr('y', (direction === 'col' ? yMin : position) - offset)
            .attr('width', (direction === 'col' ? strokeWidth : xMax - xMin) + offset)
            .attr('height', (direction === 'col' ? yMax - yMin : strokeWidth) + offset)
            .style('fill', line.color);
    }

    private calculLandmarks(box: SnPageBoxDto, type: 'page' | 'widget') {
        return (type === 'page' ? this.percentsPage : this.percentsWidgets)
                    .map((p) => Object.assign(this.calculLandmarksByPercent(box, p.value), { percents: p.compare }));
    }

    private calculLandmarksByPercent(box: SnPageBoxDto, percent: number) {
        return {
            col: Math.round(box.x + (box.width * (percent / 100))),
            row: Math.round(box.y + (box.height * (percent / 100))),
        };
    }
}
