import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { SnView, SnNode, SnCanvas, SnBox, SnGroup, SnConnector } from '../../../models';
import * as _ from 'lodash';
import { SnLinkMatrice } from '../../../dto/sn-link-matrice';
import { SnDOMService, SnUtilsService } from '../../utils';
import { SnSelectionService } from '../../view';

const RADIUS = 25;
const LINK_STROKE_SELECT = 3.5;
const LINK_STROKE_MOUSEOVER = 30;
const LINK_DASH = 5;
const CIRCLE_R = 8;
const CIRCLE_STROKE = 2;

@Injectable()
export class SnLinksService {

    // static
    constructor(private snDOMService: SnDOMService, private snUtils: SnUtilsService, private snSelection: SnSelectionService) { }

    draw(m: SnLinkMatrice, state: 'no-clickable' | 'clickable' | 'selected',
        transitionGroup, onClick?: () => void, onContextMenu?: () => void) {
        let offset;
        const self = this;
        const data = [];
        const line = d3.line()
            .defined(function (d) { return d[1] !== null; })
            .curve(d3.curveBasis);

        data.push([m.x1, m.y1]);
        if (m.x2 < m.x1) {
            offset = ((Math.abs(m.x2 - m.x1) < RADIUS) ? Math.abs(m.x2 - m.x1) : RADIUS);
            if (m.y1 < m.y2) {
                data.push([m.x1 + offset, m.y1 + offset * 2]);
                data.push([m.x2 - offset, m.y2 - offset * 2]);
            } else {
                data.push([m.x1 + offset, m.y1 - offset * 2]);
                data.push([m.x2 - offset, m.y2 + offset * 2]);
            }
        } else {
            offset = ((m.x2 - m.x1) < RADIUS * 2) ? (m.x2 - m.x1) / 2 : RADIUS;
            data.push([m.x1 + offset, m.y1]);
            data.push([m.x2 - offset, m.y2]);
        }

        data.push([m.x2, m.y2]);
        const path = transitionGroup.append('path')
            .classed('link', true)
            .attr('id', m.link.id)
            .attr('d', line(data))
            .style('stroke', 'var(--SN-COLOR-FONT)')
            .style('stroke-width', `${m.link.lineSize}px`)
            .style('fill', 'transparent');

        if (m.link.style === 'dash') {
            path
                .attr('stroke-dasharray', LINK_DASH);
        }

        if (m.link.style === 'animate') {
            path
                .style('stroke', 'var(--SN-COLOR-SUCCESS)')
                .transition()
                .delay(function (d, i) { return i * 400; })
                .on('start', function repeat() {
                    path
                        .attr('stroke-dashoffset', LINK_DASH)
                        .attr('stroke-dasharray', LINK_DASH)
                        .transition()
                        .attr('stroke-dashoffset', '0')
                        .attr('stroke-dasharray', LINK_DASH)
                        .transition()
                        .on('start', repeat);
                });
        }

        if (state === 'no-clickable') {
            path
                .attr('pointer-events', 'none');
        } else {
            let pathClick = null;

            if (state === 'selected') {
                pathClick = path
                    .style('stroke-width', `${LINK_STROKE_SELECT}px`)
                    .style('stroke', 'var(--SN-COLOR-SELECTION)');
            } else {
                pathClick = transitionGroup.append('path')
                    .classed('select', true)
                    .attr('id', m.link.id)
                    .attr('d', line(data))
                    .style('stroke', 'transparent')
                    .style('fill', 'transparent')
                    .style('stroke-width', `${LINK_STROKE_MOUSEOVER}px`)
                    .on('mouseover', function (d) {
                        path.style('stroke-width', `${LINK_STROKE_SELECT}px`);
                        d3.select(this).style('cursor', 'pointer');
                    })
                    .on('mouseout', function (d) {
                        path.style('stroke-width', `${m.link.lineSize}px`);
                        d3.select(this).style('cursor', 'unset');
                    });
            }

            if (onClick) {
                pathClick
                    .attr('pointer-events', 'visibleStroke')
                    .on('click', function (d) {
                        onClick();
                    })
                    .on('contextmenu', function (d) {
                        onContextMenu();
                    });
            }
        }
        if (m.circles) {
            for (const circle of m.circles) {
                const circleElt = transitionGroup.append('circle')
                    .classed('circle', true)
                    .attr('id', m.link.id)
                    .attr('cx', circle.x)
                    .attr('cy', circle.y)
                    .attr('r', () => {
                        if (circle.r) {
                            return circle.r;
                        }
                        return CIRCLE_R;
                    })
                    .attr('fill', 'var(--SN-NODE-PARAM-COLOR-CONNECT)');

                if (circle.stroke) {
                    circleElt.attr('stroke-width', CIRCLE_STROKE);
                    circleElt.attr('stroke', circle.stroke);
                }
            }
        }
    }

    rmTransitions(id?: string) {
        const container = d3.select('#container-links');
        container.selectAll(id ? `.link[id*="${id}"]` : '.link').remove();
        container.selectAll(id ? `.circle[id*="${id}"]` : '.circle').remove();
        container.selectAll(id ? `.select[id*="${id}"]` : '.select').remove();
    }

    drawTransition(transition: SnLinkMatrice, snView: SnView, container) {
        const state = !transition.link.connector ?
            'no-clickable' :
            (transition.link.connector.displayState?.selectedLink ? 'selected' : 'clickable');
        this.draw(transition, state, container, () => {
            this.snSelection.select(d3.event, snView, { element: transition.link.connector, type: 'link' });
        }, () => {
            this.snSelection.select(d3.event, snView, { element: transition.link.connector, type: 'link', rightClickMode: true });
        });
    }

    drawTransitions(snView: SnView, node?: SnNode) {
        const container = d3.select('#container-links');
        this.rmTransitions(node?.id);
        const nodes = node ? this.snUtils.getAttachedNodes(snView, node) : snView.nodes;

        const matrices = _.reduce(nodes, (results, n: SnNode) => {
            results.push(...this.getMatrices(snView, node, n));
            return results;
        }, []);

        for (const tr of matrices) {
            this.drawTransition(tr, snView, container);
        }
    }

    private getMatrices(snView: SnView, baseNode: SnNode, inputNode: SnNode) {
        const matrices: SnLinkMatrice[] = [];
        const connectors = this.snUtils.getConnectorsWithNode(snView);

        for (const connector of this.snUtils.getConnectors(snView, inputNode)) {
            if (connector.toward) {
                const output = connectors.find((p) => p.connector.id === connector.toward);
                const outsider = baseNode && baseNode !== inputNode && output.node !== baseNode;
                if (!outsider && output && inputNode) {

                    let lineSize = 0;
                    let nodeFrom: SnNode;
                    let nodeTo: SnNode;
                    let canvasFrom: SnCanvas;
                    let canvasTo: SnCanvas;
                    const isNewNode = !inputNode.type || !output.node.type;
                    switch (output.type) {
                        case 'flow': {
                            // in toward out
                            nodeFrom = inputNode;
                            nodeTo = output.node;
                            canvasFrom = this.snDOMService.getConnectorCanvas(nodeFrom, connector, 'out');
                            canvasTo = this.snDOMService.getConnectorCanvas(nodeTo, output.connector, 'in');
                            lineSize = isNewNode ? 3 : 2;
                        }
                            break;
                        case 'param': {
                            // out toward in
                            nodeFrom = output.node;
                            nodeTo = inputNode;
                            canvasFrom = this.snDOMService.getConnectorCanvas(nodeFrom, output.connector, 'out');
                            canvasTo = this.snDOMService.getConnectorCanvas(nodeTo, connector, 'in');
                            lineSize = isNewNode ? 2 : 1;
                        }
                            break;
                    }

                    const link = {
                        connector: connector,
                        id: `${inputNode.id}-${output.node.id}`,
                        style: isNewNode ? 'dash' : connector.displayState.style,
                        lineSize,
                    };

                    let matrice: SnLinkMatrice;

                    // container (from) - connector
                    if (!canvasFrom && canvasTo) {
                        matrice = this.getMatriceContainerWithConnector(canvasTo, snView, nodeFrom, link);
                    }

                    // container (to) - connector
                    if (!canvasTo && canvasFrom) {
                        matrice = this.getMatriceContainerWithConnector(canvasFrom, snView, nodeTo, link);
                    }

                    // container - container
                    if (!canvasTo && !canvasFrom) {
                        matrice = this.getMatriceContainers(snView, inputNode, output.node);
                    }

                    if (connector && connector.displayState.style === 'animate') {
                        link.lineSize = 6;
                    }

                    if (canvasFrom && canvasTo) {
                        matrice = {
                            x1: canvasFrom.x,
                            y1: canvasFrom.y,
                            x2: canvasTo.x,
                            y2: canvasTo.y,
                            link,
                            circles: []
                        };
                    }

                    if (matrice) {
                        if (!nodeFrom.displayState.hidden && !nodeFrom.open) {
                            matrice.circles.push({
                                x: matrice.x1,
                                y: matrice.y1,
                                stroke: this.snDOMService.getColorNode(nodeFrom),
                                r: 6
                            });
                        }
                        if (!nodeTo.displayState.hidden && !nodeTo.open) {
                            matrice.circles.push({
                                x: matrice.x2,
                                y: matrice.y2,
                                stroke: this.snDOMService.getColorNode(nodeTo),
                                r: 6
                            });
                        }
                        matrices.push(matrice);
                    }
                }
            }
        }

        return matrices;
    }

    getMatriceContainerWithConnector(canvasOpposite: SnCanvas, snView: SnView, node: SnNode, link): SnLinkMatrice {
        if (!node.displayState.hidden) {
            return null;
        }

        const container = this._getContainer(snView, node.parentId);

        if (container) {
            const xCenter = container.canvas.x + (container.canvas.width / 2);
            const yCenter = container.canvas.y + (container.canvas.height / 2);

            const leftSide = xCenter < canvasOpposite.x;

            const containerCanvas = {
                x: leftSide ? container.canvas.x + container.canvas.width : container.canvas.x,
                y: yCenter
            };
            const canvasLeft = leftSide ? containerCanvas : canvasOpposite;
            const canvasRight = leftSide ? canvasOpposite : containerCanvas;

            const matrice: SnLinkMatrice = {
                x1: canvasLeft.x,
                y1: canvasLeft.y,
                x2: canvasRight.x,
                y2: canvasRight.y,
                link,
                circles: [],
            };

            matrice.circles = [{
                x: containerCanvas.x,
                y: containerCanvas.y,
                stroke: (container as SnGroup).color ? (container as SnGroup).color : 'var(--SN-BOX-CONNECTION-COLOR)',
            }];
            return matrice;
        }
        return null;
    }

    getMatriceContainers(snView: SnView, inputNode: SnNode, outputNode: SnNode): SnLinkMatrice {
        if (!inputNode.displayState.hidden || !outputNode.displayState.hidden) {
            return null;
        }

        const inputContainer = this._getContainer(snView, inputNode.parentId);
        const outputContainer = this._getContainer(snView, outputNode.parentId);

        let matrice: SnLinkMatrice = null;

        if (inputContainer && outputContainer && inputContainer !== outputContainer) {

            const xInputCenter = inputContainer.canvas.x + (inputContainer.canvas.width / 2);
            const yInputCenter = inputContainer.canvas.y + (inputContainer.canvas.height / 2);
            const xOutputCenter = outputContainer.canvas.x + (outputContainer.canvas.width / 2);
            const yOutputCenter = outputContainer.canvas.y + (outputContainer.canvas.height / 2);

            const inputOnLeftSide = xInputCenter < xOutputCenter;

            const containerLeft = inputOnLeftSide ? inputContainer : outputContainer;
            const containerRight = inputOnLeftSide ? outputContainer : inputContainer;
            const yLeft = inputOnLeftSide ? yInputCenter : yOutputCenter;
            const yRight = inputOnLeftSide ? yOutputCenter : yInputCenter;

            matrice = {
                x1: containerLeft.canvas.x + containerLeft.canvas.width,
                y1: yLeft,
                x2: containerRight.canvas.x,
                y2: yRight,
                link: {
                    connector: null,
                    id: `${inputNode.id}-${outputNode.id}`,
                    lineSize: 3,
                },
                circles: []
            };
            matrice.circles = [{
                x: matrice.x1,
                y: matrice.y1,
                stroke: (containerLeft as SnGroup).color ? (containerLeft as SnGroup).color : 'var(--SN-BOX-CONNECTION-COLOR)',
            }, {
                x: matrice.x2,
                y: matrice.y2,
                stroke: (containerRight as SnGroup).color ? (containerRight as SnGroup).color : 'var(--SN-BOX-CONNECTION-COLOR)',
            }];
        }
        return matrice;
    }

    _getContainer(snView: SnView, parentId: string) {
        let container = this.snUtils.getContainerById(snView, parentId);
        if (container && container.displayState.hidden) {
            container = (container as SnBox).parentId ?
                this.snUtils.getContainerById(snView, (container as SnBox).parentId) : null;
        }

        return container;
    }
}

