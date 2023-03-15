import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import * as _ from 'lodash';
import { SnView, SnConnector, SnFlow, SnParam, SnElement } from '../../../../models';
import { SnCustomFilterConnector } from '../../../../dto';
import { SnSettings } from '../../../../dto/sn-settings';
import { SnDOMService, SnUtilsService, SnSmartConnectionsService } from '../../../utils';
import { SnActionsService, SnCalculService } from '../../../view';
import { SnLinksService } from '../../sn-links/sn-links.service';
import { SnDragUtilsService } from '../sn-drag-utils/sn-drag-utils.service';
import { SnZoomService } from '../../sn-zoom/sn-zoom.service';

@Injectable()
export class SnDragConnectorsService {

    constructor(
        private snUtils: SnUtilsService,
        private snAction: SnActionsService,
        private snCalcul: SnCalculService,
        private snZoom: SnZoomService,
        private snDOM: SnDOMService,
        private snLinks: SnLinksService,
        private snDragUtils: SnDragUtilsService,
        private snSmartConnections: SnSmartConnectionsService
    ) {
    }

    startDragFlow(d3Context, snView: SnView, direction: 'in' | 'out', filterConnectors: SnCustomFilterConnector<SnConnector>) {
        this.startDragConnector(d3Context, snView, direction, filterConnectors);
    }

    startDragParam(d3Context, snView: SnView, direction: 'in' | 'out', filterConnectors: SnCustomFilterConnector<SnConnector>) {
        this.startDragConnector(d3Context, snView, direction, filterConnectors);
    }

    dragFlow(d3Context, snView: SnView, direction: 'in' | 'out') {
        this.dragConnector(d3Context, snView, direction);
    }

    dragParam(d3Context, snView: SnView, direction: 'in' | 'out') {
        this.dragConnector(d3Context, snView, direction);
    }

    endDragFlow(d3Context, snView: SnView, direction: 'in' | 'out', settings: SnSettings) {
        if (!this.endDragConnector(d3Context, snView, direction)) {
            return ;
        }

        const mirrorFlow: SnFlow = this.snUtils.getMirrorFlow(d3Context.connector);

        if (this.linkConnector(d3Context, snView, 'flow')) {
            return;
        }

        if (!this.snDragUtils.filterSchema(snView, d3Context.connector, settings, 'flow')) {
            this.snCalcul.calculateConnection(snView);
            this.snAction.notifyRefresh(snView);
            return;
        }
        this.snAction.createNewNodeFromFlow(snView, d3Context.newParent, d3Context.canvas, mirrorFlow, d3Context.connector);
    }

    endDragParam(d3Context, snView: SnView, direction: 'in' | 'out', settings: SnSettings) {
        if (!this.endDragConnector(d3Context, snView, direction)) {
            return ;
        }

        const mirrorParam: SnParam = this.snUtils.getMirrorParam(d3Context.connector);

        if (this.linkConnector(d3Context, snView, 'param')) {
            return;
        }

        if (!this.snDragUtils.filterSchema(snView, d3Context.connector, settings, 'param')) {
            this.snCalcul.calculateConnection(snView);
            this.snAction.notifyRefresh(snView);
            return;
        }
        this.snAction.createNewNodeFromParam(snView, d3Context.newParent, d3Context.canvas, mirrorParam, d3Context.connector);
    }

    connectorsMouseOver(d3Context, snView: SnView, attributes: { key: string; value: string }[]) {
        const connectors = this.snUtils.getConnectors(snView);
        const connector = _.find(connectors, (c) => c.id === d3.select(d3Context).attr('id'));

        if (connector.displayState.droppable === false) {
            return;
        }

        connector.displayState.dragHover = true;
        d3.select(d3Context).style('cursor', connector.displayState.droppable === true ? 'grabbing' : 'pointer');
        const node = d3.select(d3Context).transition().duration('50');

        for (const attr of attributes) {
            node.attr(attr.key, attr.value);
        }
    }

    connectorsMouseOut(d3Context, snView: SnView, attributes: { key: string; value: string }[]) {
        const connectors = this.snUtils.getConnectors(snView);
        const connector = _.find(connectors, (c) => c.id === d3.select(d3Context).attr('id'));
        connector.displayState.dragHover = false;

        d3.select(d3Context).style('cursor', 'inherit');
        const node = d3.select(d3Context).transition().duration('50');

        for (const attr of attributes) {
            node.attr(attr.key, attr.value);
        }
    }

    unsetDroppable(snView: SnView) {
        const connectors = this.snUtils.getConnectors(snView);
        for (const connector of connectors) {
            connector.displayState.droppable = null;
        }

        d3.selectAll('.flow-in, .flow-out, .param-in, .param-out').classed('undroppable', false);
    }

    setDroppable(snView: SnView, element: SnConnector, type: 'param' | 'flow',
        customFilter: SnCustomFilterConnector<SnConnector>) {
        const params = this.snUtils.getParams(snView);
        const flows = this.snUtils.getFlows(snView);

        if (!element) {
            return;
        }

        for (const flow of flows) {
            flow.displayState.droppable = false;
        }
        for (const param of params) {
            param.displayState.droppable = false;
        }
        d3.selectAll('.flow-in, .flow-out, .param-in, .param-out').classed('undroppable', true);

        switch (type) {
            case 'flow':
                element.displayState.droppable = null;
                _.each(this.snSmartConnections.getConnectorsDroppable(snView, element, type, customFilter), (flow: SnFlow) => {
                    flow.displayState.droppable = true;
                    d3.selectAll(`.flow-in[id="${flow.id}"], .flow-out[id="${flow.id}"]`).classed('undroppable', false);
                });
                break;
            case 'param':
                element.displayState.droppable = null;
                _.each(this.snSmartConnections.getConnectorsDroppable(snView, element, type, customFilter), (param: SnParam) => {
                    param.displayState.droppable = true;
                    d3.selectAll(`.param-in[id="${param.id}"], .param-out[id="${param.id}"]`).classed('undroppable', false);
                });
        }
    }

    private linkConnector(d3Context, snView: SnView, type: 'param' | 'flow') {
        const connector = this.snUtils.getConnectors(snView).find((c) => c.displayState.dragHover);
        if (connector) {
            connector.displayState.dragHover = false;

            if (d3Context.connector !== connector) {
                this.snAction.linkConnector(snView, d3Context.connector, connector, type);
                return true;
            }
        }

        return false;
    }

    private startDragConnector(d3Context, snView: SnView, direction: 'in' | 'out',
        filterConnectors: SnCustomFilterConnector<SnConnector>) {

        const current = d3.select(d3Context);

        const connectorsAndNode = this.snUtils.getConnectorsWithNode(snView);
        const connectorAndNode = _.find(connectorsAndNode, (c) => c.connector.id === current.attr('id'));

        d3Context.connector = connectorAndNode.connector;
        this.setDroppable(snView, d3Context.connector, connectorAndNode.type, filterConnectors);

        d3Context.node = connectorAndNode.node;

        d3Context.containerLink = d3.select('#container-links');
        d3Context.parent = this.snUtils.getContainer(snView, d3Context.node);
        d3Context.canvas = this.snDOM.getConnectorCanvas(d3Context.node, d3Context.connector, direction);
        d3Context.dragged = false;
    }

    private dragConnector(d3Context, snView: SnView, direction: 'in' | 'out') {
        if (!d3Context.canvas) {
            return ;
        }
        d3Context.dragged = true;
        d3Context.connector.displayState.connected = true;
        const subWidth = direction === 'out' ? d3Context.canvas.width : 0;

        d3Context.containerLink.selectAll('#tmp').remove();
        d3Context.canvasOut = {
            x: Math.round(d3.event.x / this.snZoom.transform.k) + d3Context.canvas.x - subWidth,
            y: Math.round(d3.event.y / this.snZoom.transform.k) + d3Context.canvas.y - d3Context.canvas.height / 2,
        };

        const linkMatrice = direction === 'in' ? this.snDragUtils.getLinkMatrice(d3Context.canvasOut, d3Context.canvas) :
            this.snDragUtils.getLinkMatrice(d3Context.canvas, d3Context.canvasOut);

        this.snDragUtils.dragSearchParent(d3Context, snView, d3Context.canvasOut, 'connector');
        this.snLinks.drawTransition(linkMatrice, snView, d3Context.containerLink);
    }

    private endDragConnector(d3Context, snView: SnView, direction: 'in' | 'out') {
        this.unsetDroppable(snView);
        if (!d3Context.dragged) {
            return false;
        }

        if (d3Context.newParent) {
            (d3Context.newParent as SnElement).displayState.dragHover = false;
        }

        d3Context.canvas = {
            x: d3Context.canvasOut.x - (direction === 'in' ? this.snDOM.nodeWith : 0),
            y: d3Context.canvasOut.y - this.snDOM.selector,
        };
        this.snLinks.drawTransitions(snView);
        return true;
    }

}
