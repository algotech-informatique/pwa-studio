import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SnView, SnCanvas, SnNode, SnElement } from '../../../../models';
import { SnDragUtilsService } from '../sn-drag-utils/sn-drag-utils.service';
import { SnLinksService } from '../../sn-links/sn-links.service';
import { SnUtilsService } from '../../../utils';
import { SnActionsService, SnSelectionService } from '../../../view';

@Injectable()
export class SnDragContainersService {

    constructor(
        private snUtils: SnUtilsService,
        private snAction: SnActionsService,
        private snSelection: SnSelectionService,
        private snDragUtils: SnDragUtilsService,
        private snLinksService: SnLinksService,
    ) {
    }

    startDragContainer(d3Context, snView: SnView, type: 'group' | 'box') {
        const current = d3.select(d3Context);
        d3Context.container = this.snUtils.getContainerById(snView, current.attr('id'));

        this.snSelection.select(d3.event, snView, { element: d3Context.container, type });

        d3Context.nodes = this.snUtils.getNodesByContainer(snView, d3Context.container, true);
        d3Context.canvas = [
            ..._.map(d3Context.nodes, (e) => e.canvas),
            ..._.map(this.snUtils.getBoxByContainer(snView, d3Context.container), (e) => e.canvas),
            ..._.reduce(snView.comments, (canvas, comment) => {
                if ((comment.parentId === d3Context.container.id) ||
                    snView.box.find(b => b.id === comment.parentId && b.parentId === d3Context.container.id)) {
                    canvas.push(comment.canvas);
                }
                return canvas;
            }, [])
        ];

        d3Context.deltaX = d3Context.container.canvas.x - d3.event.x;
        d3Context.deltaY = d3Context.container.canvas.y - d3.event.y;
        d3Context.container.canvas.x = d3.event.x + d3Context.deltaX;
        d3Context.container.canvas.y = d3.event.y + d3Context.deltaY;
        d3Context.parent = this.snUtils.getContainer(snView, d3Context.container);
        d3Context.dragged = false;
    }

    dragContainer(d3Context, snView: SnView, searchParent: boolean) {
        if (!d3Context.dragged) {
            _.each(d3Context.nodes, (node: SnNode) => {
                this.snLinksService.rmTransitions(node?.id);
            });
        }

        d3Context.dragged = true;
        d3Context.container.displayState.bringToFront = true;

        const x = d3.event.x + d3Context.deltaX;
        const y = d3.event.y + d3Context.deltaY;

        const deltaX = d3Context.container.canvas.x - x;
        const deltaY = d3Context.container.canvas.y - y;

        _.each(d3Context.canvas, (canvas: SnCanvas) => {
            canvas.x = canvas.x - deltaX;
            canvas.y = canvas.y - deltaY;
        });

        d3Context.container.canvas.x = x;
        d3Context.container.canvas.y = y;

        if (searchParent) {
            this.snDragUtils.dragSearchParent(d3Context, snView, d3Context.container, 'container');
        }
    }

    endDragContainer(d3Context, snView: SnView) {
        if (!d3Context.dragged) {
            return;
        }

        d3Context.container.displayState.bringToFront = false;
        if (d3Context.newParent) {
            (d3Context.newParent as SnElement).displayState.dragHover = false;
        }
        d3Context.container.parentId = (d3Context.newParent && d3Context.newParent.id !== d3Context.container.id) ?
            d3Context.newParent.id : null;
        this.snAction.notifyContainerMove(snView, d3Context.container);
    }
}
