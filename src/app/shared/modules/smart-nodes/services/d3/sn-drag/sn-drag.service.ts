import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SnView } from '../../../models';
import * as _ from 'lodash';
import { SnSettings } from '../../../dto/sn-settings';
import { SnDragNodesService } from './sn-drag-nodes/sn-drag-nodes.service';
import { SnDragContainersService } from './sn-drag-containers/sn-drag-containers.service';
import { SnDragConnectorsService } from './sn-drag-connectors/sn-drag-connectors.service';
import { SnSelectorService } from './sn-selector/sn-selector.service';

@Injectable()
export class SnDragService {

    constructor(
        private snDragNodes: SnDragNodesService,
        private snDragContainers: SnDragContainersService,
        private snDragConnectos: SnDragConnectorsService,
        private snSelector: SnSelectorService) { }

    public drag(snView: SnView, container, settings: SnSettings) {

        this.dragFlowHandler(snView, container, settings);
        this.dragParamHandler(snView, container, settings);
        this.dragNodeHandler(snView, container);
        this.dragContainerHandler(snView, container);
        this.selectorHandler(snView, container);
    }

    private selectorHandler(snView: SnView, container) {
        const self = this;
        d3.select('#svg')
            .call(
                d3.drag()
                    .filter(() => {
                        if (d3.event.button || !d3.event.ctrlKey) {
                            return false;
                        }
                        // disable selector when hover node-content|link
                        const hover: Element[] = Array.prototype.slice.call(document.querySelectorAll(':hover'));
                        return !hover.some((ele) => ele.classList.contains('node-content') || ele.classList.contains('select'));
                    })
                    .on('start', (d, i, nodes) => {
                        self.snSelector.startSelect(nodes[i], snView, container);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snSelector.select(nodes[i], snView, container);
                    })
                    .on('end', (d, i, nodes) => {
                        self.snSelector.endSelect(nodes[i], snView);
                    })
            );
    }

    private dragFlowHandler(snView: SnView, container, settings: SnSettings) {
        const self = this;

        container.selectAll('.flow-connect.flow-out')
            .classed('flow-out-dragevent-done', false)
            .classed('flow-in-dragevent-done', false)
            .attr('opacity', '1')
            .attr('transform', 'scale(1)')
            .on('mouseover', null)
            .on('mouseout', null)
            .on('.drag', null);

        // drop
        container.selectAll('.flow-disconnect, .flow-connect.flow-in')
            .on('mouseover', (d, i, nodes) => {
                self.snDragConnectos.connectorsMouseOver(nodes[i], snView, [
                    { key: 'opacity', value: '0.5' },
                    { key: 'transform', value: 'scale(1.5)' }
                ]);
            })
            .on('mouseout', (d, i, nodes) => {
                self.snDragConnectos.connectorsMouseOut(nodes[i], snView, [
                    { key: 'opacity', value: '1' },
                    { key: 'transform', value: 'scale(1)' }
                ]);
            });


        // drag
        d3.selectAll('.flow-out.flow-disconnect:not(.flow-out-dragevent-done)')
            .classed('flow-out-dragevent-done', true)
            .classed('flow-in-dragevent-done', false)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragConnectos.startDragFlow(nodes[i], snView, 'out', settings.filterFlows);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragConnectos.dragFlow(nodes[i], snView, 'out');
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragConnectos.endDragFlow(nodes[i], snView, 'out', settings);
                    })
            );

        d3.selectAll('.flow-in:not(.flow-in-dragevent-done)')
            .classed('flow-out-dragevent-done', false)
            .classed('flow-in-dragevent-done', true)
            .call(
                d3.drag()
                    .on('start', (d, i, nodes) => {
                        self.snDragConnectos.startDragFlow(nodes[i], snView, 'in', settings.filterFlows);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragConnectos.dragFlow(nodes[i], snView, 'in');
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragConnectos.endDragFlow(nodes[i], snView, 'in', settings);
                    })
            );

    }

    private dragParamHandler(snView: SnView, container, settings: SnSettings) {
        const self = this;

        // drop
        container.selectAll('.param-connect.param-in')
            .classed('param-out-dragevent-done', false)
            .classed('param-in-dragevent-done', false)
            .attr('transform', 'scale(1)')
            .on('mouseover', null)
            .on('mouseout', null)
            .on('.drag', null);

        container.selectAll('.param-disconnect, .param-connect.param-out')
            .on('mouseover', (d, i, nodes) => {
                self.snDragConnectos.connectorsMouseOver(nodes[i], snView, [
                    { key: 'transform', value: 'scale(1.5)' }
                ]);
            })
            .on('mouseout', (d, i, nodes) => {
                self.snDragConnectos.connectorsMouseOut(nodes[i], snView, [
                    { key: 'transform', value: 'scale(1)' }
                ]);
            });

        d3.selectAll('.param-out:not(.param-out-dragevent-done)')
            .classed('param-out-dragevent-done', true)
            .classed('param-in-dragevent-done', false)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragConnectos.startDragParam(nodes[i], snView, 'out', settings.filterParams);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragConnectos.dragParam(nodes[i], snView, 'out');
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragConnectos.endDragParam(nodes[i], snView, 'out', settings);
                    })
            );

        d3.selectAll('.param-disconnect.param-in:not(.param-in-dragevent-done)')
            .classed('param-out-dragevent-done', false)
            .classed('param-in-dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragConnectos.startDragParam(nodes[i], snView, 'in', settings.filterParams);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragConnectos.dragParam(nodes[i], snView, 'in');
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragConnectos.endDragParam(nodes[i], snView, 'in', settings);
                    })
            );
    }

    private dragNodeHandler(snView: SnView, container) {
        const self = this;
        container.selectAll('.draggable-node')
            .on('click', (d, i, nodes) => {
                self.snDragNodes.clicked(nodes[i], snView);
                d3.event.stopPropagation();
            });

        d3.selectAll('.draggable-node:not(.dragevent-done)')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragNodes.startDragNode(nodes[i], snView);
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragNodes.dragNode(nodes[i], snView);
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragNodes.endDragNode(nodes[i], snView);
                    })
            );
    }

    private dragContainerHandler(snView: SnView, container) {
        container.selectAll('.draggable-group, .draggable-box')
            .on('click', (d, i, nodes) => {
                d3.event.stopPropagation();
            });

        const self = this;
        d3.selectAll('.draggable-group:not(.dragevent-done)')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragContainers.startDragContainer(nodes[i], snView, 'group');
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragContainers.dragContainer(nodes[i], snView, false);
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragContainers.endDragContainer(nodes[i], snView);
                    })
            );

        d3.selectAll('.draggable-box:not(.dragevent-done)')
            .classed('dragevent-done', true)
            .call(
                d3.drag()
                    .filter(() => !d3.event.button)
                    .on('start', (d, i, nodes) => {
                        self.snDragContainers.startDragContainer(nodes[i], snView, 'box');
                    })
                    .on('drag', (d, i, nodes) => {
                        self.snDragContainers.dragContainer(nodes[i], snView, true);
                    })
                    .on('end', (d, i, nodes) => {
                        self.snDragContainers.endDragContainer(nodes[i], snView);
                    })
            );
    }

}
