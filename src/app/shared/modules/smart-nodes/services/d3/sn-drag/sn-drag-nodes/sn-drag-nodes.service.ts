import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SnView, SnNode, SnElement } from '../../../../models';
import { SnUtilsService } from '../../../utils';
import { SnDragUtilsService } from '../sn-drag-utils/sn-drag-utils.service';
import { SnLinksService } from '../../sn-links/sn-links.service';
import { SnCalculService, SnActionsService, SnSelectionService } from '../../../view';

@Injectable()
export class SnDragNodesService {

    constructor(
        private snUtils: SnUtilsService,
        private snSelection: SnSelectionService,
        private snDragUtils: SnDragUtilsService,
        private snLinksService: SnLinksService,
        private snCalcul: SnCalculService,
        private snAction: SnActionsService,
    ) {
    }

    clicked(d3Context, snView: SnView) {
        const current = d3.select(d3Context);
        const node = _.find(snView.nodes, (n: SnNode) => n.id === current.attr('id'));
        this.snSelection.select(d3.event, snView, { element: node, type: 'node' });
    }

    startDragNode(d3Context, snView: SnView) {
        const current = d3.select(d3Context);

        d3Context.node = _.find(snView.nodes, (n: SnNode) => n.id === current.attr('id'));
        d3Context.parent = this.snUtils.getContainer(snView, d3Context.node);
        d3Context.newParent = undefined;

        d3Context.deltaX = d3Context.node.canvas.x - d3.event.x;
        d3Context.deltaY = d3Context.node.canvas.y - d3.event.y;

        d3Context.node.canvas.x = d3.event.x + d3Context.deltaX;
        d3Context.node.canvas.y = d3.event.y + d3Context.deltaY;
        d3Context.dragged = false;
    }

    dragNode(d3Context, snView: SnView) {
        if (!d3Context.dragged) {
            this.snSelection.select(d3.event, snView, { element: d3Context.node, type: 'node', ignoreUnselect: true });
            d3Context.nodes = snView.nodes.filter((n) => n.displayState.selected);
            for (const node of d3Context.nodes) {
                node.displayState.bringToFront = true;
            }
            this.snAction.notifyRefresh(snView);
        }

        d3Context.dragged = true;
        const offsetX = (d3.event.x + d3Context.deltaX) - d3Context.node.canvas.x;
        const offsetY = (d3.event.y + d3Context.deltaY) - d3Context.node.canvas.y;

        for (const node of d3Context.nodes) {
            node.canvas.x += offsetX;
            node.canvas.y += offsetY;
        }

        // all nodes have same parent
        if (_.uniq(d3Context.nodes.map((n) => n.parentId)).length === 1) {
            for (const node of d3Context.nodes) {
                this.snDragUtils.dragSearchParent(d3Context, snView, node, 'node');
                if (d3Context.newParent !== d3Context.parent) {
                    break;
                }
            }
        }

        this.snLinksService.drawTransitions(snView, d3Context.nodes.length === 1 ? d3Context.node : null);
    }

    endDragNode(d3Context, snView: SnView) {
        if (!d3Context.dragged) {
            return;
        }
        if (d3Context.newParent) {
            (d3Context.newParent as SnElement).displayState.dragHover = false;
        }

        for (const node of d3Context.nodes) {
            const parent = d3Context.newParent !== undefined ? d3Context.newParent : this.snUtils.getContainer(snView, node);
            node.displayState.bringToFront = false;
            node.canvas = this.snCalcul.calculateCanvas(snView, d3Context.nodes.length === 1 ? parent : null, node.canvas);
            node.parentId = parent?.id;
        }

        // remove the dupplicate node
        this.snAction.notifyNodeMove(snView, d3Context.nodes.length === 1 ? d3Context.node : null);
    }
}
