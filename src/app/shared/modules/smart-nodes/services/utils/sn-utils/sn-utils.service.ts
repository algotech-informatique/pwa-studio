import { Injectable } from '@angular/core';
import {
    SnView, SnNode, SnFlow, SnParam, SnSection,
    SnGroup, SnBox, SnElement, SnConnector, SnCanvas
} from '../../../models';
import * as _ from 'lodash';
import { SnDOMService } from '../sn-dom/sn-dom.service';
import { UUID } from 'angular2-uuid';
import { SnCanvasDto } from '@algotech-ce/core';

@Injectable()
export class SnUtilsService {

    constructor(private snDOM: SnDOMService) { }

    public getParamsWithNode(snView: SnView, node?: SnNode): { param: SnParam; node: SnNode }[] {
        if (!snView && !node) {
            return [];
        }

        return _.reduce(node ? [node] : snView.nodes, (results, n: SnNode) => {
            // params in node
            results.push(..._.map(n.params, (param: SnParam) => ({ param, node: n })));

            // params in sections
            results.push(..._.reduce(n.sections, (sectionParams, section: SnSection) => {
                results.push(..._.map(section.params, (param: SnParam) => ({ param, node: n })));
                return sectionParams;
            }, []));

            // params in flows
            results.push(..._.reduce(n.flows, (flowsParams, flow: SnFlow) => {
                results.push(..._.map(flow.params, (param: SnParam) => ({ param, node: n })));
                return flowsParams;
            }, []));

            return results;
        }, []);
    }

    public getNodeParams(node: SnNode): SnParam[] {
        if (!node) {
            return [];
        }
        const params: SnParam[] = [...node.params];
        node.sections.forEach((section: SnSection) => (params.push(...section.params)));
        node.flows.forEach((flow: SnFlow) => (params.push(...flow.params)));
        return params;
    }

    public findParent(snView: SnView, id: string, type: 'flow' | 'param'): SnNode {
        if (type === 'param') {
            return this.getParamsWithNode(snView)?.find((res) => res.param.id === id)?.node;
        }
        return this.getFlowsWithNode(snView)?.find((res) => res.flow.id === id)?.node;
    }

    public getFlowsWithNode(snView: SnView, node?: SnNode): { flow: SnFlow; node: SnNode }[] {
        if (!snView && !node) {
            return [];
        }

        if (node) {
            return _.map(node.flows, (flow: SnFlow) => ({ flow, node }));
        }

        return _.reduce(snView.nodes, (results, n: SnNode) => {
            results.push(..._.map(n.flows, (flow: SnFlow) => ({ flow, node: n })));
            return results;
        }, []);

    }

    public getFlows(snView: SnView, node?: SnNode): SnFlow[] {
        return _.map(this.getFlowsWithNode(snView, node), (p) => p.flow);
    }

    public getParams(snView: SnView, snNode?: SnNode): SnParam[] {
        return _.map(this.getParamsWithNode(snView, snNode), (p) => p.param);
    }

    public getParamByKey(newKey: string, node: SnNode, caseSensitive = true) {
        const params = this.getParams(null, node);
        if (!caseSensitive) {
            return params.find((p) => p.key.toUpperCase() === newKey.toUpperCase());
        }
        return params.find((p) => p.key === newKey);
    }

    public findConnectedParams(snView: SnView, param: SnParam): SnParam[] {
        return (param.direction === 'in') ?
            [this.getParams(snView).find((p) => p.id === param.toward)] :
            this.getParams(snView).filter((p) => param.id === p.toward);
    }

    public findConnectedParam(snView: SnView, param: SnParam): SnParam {
        return (param.direction === 'in') ?
            this.getParams(snView).find((p) => p.id === param.toward) :
            this.getParams(snView).find((p) => param.id === p.toward);
    }

    public findConnectedFlow(snView: SnView, flow: SnFlow): SnFlow {
        return (flow.direction === 'out') ?
            this.getFlows(snView).find((p) => p.id === flow.toward) :
            this.getFlows(snView).find((p) => flow.id === p.toward);
    }

    public findInOut(connectorA: SnConnector, connectorB: SnConnector): { in: SnConnector; out: SnConnector } {
        const connectin = connectorA.direction === 'in' ? connectorA : connectorB;
        const connectout = connectorA.direction === 'out' ? connectorA : connectorB;
        return { in: connectin, out: connectout };
    }

    public getConnectorsWithNode(snView, snNode?: SnNode): { connector: SnConnector; node: SnNode; type: 'param' | 'flow' }[] {
        const res: { connector: SnConnector; node: SnNode; type: 'param' | 'flow' }[] = [];
        res.push(..._.map(this.getFlowsWithNode(snView, snNode), (r) => ({
            connector: r.flow,
            node: r.node,
            type: 'flow'
        })));
        res.push(..._.map(this.getParamsWithNode(snView, snNode), (r) => ({
            connector: r.param,
            node: r.node,
            type: 'param'
        })));

        return res;
    }

    public getConnectors(snView, snNode?: SnNode): SnConnector[] {
        return [
            ...this.getFlows(snView, snNode),
            ...this.getParams(snView, snNode),
        ];
    }

    getArrayOfParam(snView: SnView, param: SnParam): SnParam[] {
        const findNode = this.getParamsWithNode(snView).find((elt) => elt.param === param);
        if (!findNode) {
            return [];
        }
        const node = findNode.node;
        const array: SnParam[][] = [node.params];

        array.push(..._.map(node.sections, 'params'));
        array.push(..._.map(node.flows, 'params'));

        for (const params of array) {
            if (params.indexOf(param) > -1) {
                return params;
            }
        }

        return [];
    }

    getDataNodes(snView: SnView, node: SnNode, nodes: SnNode[] = []): SnNode[] {
        const results: SnNode[] = [];

        const allParams = this.getParamsWithNode(snView);
        const params = this.getParams(snView, node);

        results.push(...
            _.reduce(params, (r, param: SnParam) => {
                const findParams = allParams.filter((p) => p.param.id === param.toward);

                // all data nodes
                _.each(findParams, (findParam) => {
                    if (findParam && findParam.node.flows.length === 0 && nodes.indexOf(findParam.node) === -1) {
                        r.push(...this.getDataNodes(snView, findParam.node, r));
                        r.push(findParam.node);
                    }
                });

                return r;
            }, []),
        );

        return _.uniqBy(results, 'id');
    }

    getAttachedNodes(snView: SnView, node: SnNode): SnNode[] {

        const results: SnNode[] = [];

        const params = this.getParams(snView, node);

        const allParams = this.getParamsWithNode(snView);
        const allFlows = this.getFlowsWithNode(snView);

        const flowIn = node.flows.find((f) => f.direction === 'in');
        const findFlows = !flowIn ? null : allFlows.filter((f) => f.flow.toward === flowIn.id);

        results.push(node);
        if (findFlows) {
            results.push(..._.map(findFlows, (f) => f.node));
        }

        results.push(...
            _.reduce(params, (r, param: SnParam) => {
                const findParams = allParams.filter((p) => p.param.toward === param.id);
                r.push(..._.map(findParams, (f) => f.node));
                return r;
            }, []),
        );

        return _.uniqBy(results, 'id');
    }

    getContainerById(snView: SnView, id: string): SnElement {
        return _.find([...snView.groups, ...snView.box], (g) => g.id === id);
    }

    getContainerBox(snView: SnView, box: SnBox) {
        const findGroup = snView.groups.find((g) => g.id === box.parentId);
        if (findGroup) {
            return findGroup;
        }
    }

    getContainer(snView: SnView, node: SnNode | SnBox) {
        const findGroup = snView.groups.find((g) => g.id === node.parentId);
        if (findGroup) {
            return findGroup;
        }
        const findBox = snView.box.find((u) => u.id === node.parentId);
        if (findBox) {
            return findBox;
        }
        return null;
    }

    getNodesByContainer(snView: SnView, container: SnElement, allNodes = false): SnNode[] {
        return _.reduce(snView.nodes, (results, node: SnNode) => {
            if (node.parentId) {
                if (node.parentId === container.id) {
                    results.push(node);
                } else if (allNodes) {
                    const findParent = this.getContainer(snView, node);
                    if ((findParent as SnBox).parentId === container.id) {
                        results.push(node);
                    }
                }
            }
            return results;
        }, []);
    }

    getNodesByContainers(snView: SnView, containers: SnElement[], allNodes = false) {
        return _.flatten(containers.map((c) => this.getNodesByContainer(snView, c, allNodes)));
    }

    containerIsEmpty(snView: SnView, container: SnElement) {
        return !snView.nodes.find((n) => n.parentId === container.id) && !snView.box.find((n) => n.parentId === container.id);
    }

    getBoxByContainer(snView: SnView, container: SnElement) {
        return _.reduce(snView.box, (result, box: SnBox) => {
            if (box.parentId) {
                if (box.parentId === container.id) {
                    result.push(box);
                }
            }
            return result;
        }, []);
    }

    getMirrorFlow(flowOrigin: SnFlow): SnFlow {
        const flow: SnFlow = {
            id: UUID.UUID(),
            direction: (flowOrigin.direction === 'out') ? 'in' : 'out',
            params: [],
            displayState: {}
        };
        if (flow.direction === 'out') {
            flow.toward = flowOrigin.id;
        }
        return flow;
    }

    getMirrorParam(paramOrigin: SnParam): SnParam {
        const param: SnParam = {
            id: UUID.UUID(),
            direction: (paramOrigin.direction === 'out') ? 'in' : 'out',
            displayName: undefined,
            types: [],
            multiple: undefined,
            pluggable: true,
            master: true,
            displayState: {},
        };
        if (param.direction === 'in') {
            param.toward = paramOrigin.id;
        }
        return param;
    }

    getParent(element: SnElement | SnCanvas, snView: SnView, type: 'node' | 'connector' | 'container') {
        let canvas: SnCanvas = (element as SnElement).canvas ? (element as SnElement).canvas : element as SnCanvas;

        switch (type) {
            case 'node':
                canvas = this.snDOM.getNodeCanvas(element as SnNode);
                break;
            case 'connector':
                return this.getEndpointContainer(canvas.x, canvas.y, snView);
        }

        return this.getEndpointContainer(canvas.x, canvas.y, snView, canvas.width, canvas.height,
            type === 'container');
    }

    getEndpointContainer(x: number, y: number, snView: SnView, width = 0, height = 0, onlyGroup = false) {
        const group: SnGroup = _.find(snView.groups, (grp: SnGroup) => this.intersectCanvas(grp.canvas, { x, y, width, height }));

        if (onlyGroup) {
            return group;
        }

        const box: SnBox = _.find(snView.box, (unbxd: SnBox) => {
            const insideCanvas = this.intersectCanvas(unbxd.canvas, { x, y, width, height });
            return group ?
                insideCanvas && unbxd.parentId === group.id :
                insideCanvas;
        });
        return box ? box : group;
    }

    intersectCanvas(canvas: SnCanvas, canvasCompare: SnCanvas): boolean {
        const inX = (canvasCompare.x + canvasCompare.width >= canvas.x) &&
            (canvasCompare.x <= canvas.x + canvas.width);
        const inY = (canvasCompare.y + canvasCompare.height >= canvas.y) &&
            (canvasCompare.y <= canvas.y + canvas.height);
        return inX && inY;
    }

    nodesExpanded(nodes: SnNode[]) {
        if (nodes.length === 0) {
            return true;
        }
        return nodes[0].expanded;
    }

    getNextFlows(snView: SnView, flowIn: SnFlow[], nextFlows: SnFlow[], stopRecursion?: { type: string; flow: string }): SnFlow[] {
        if (!nextFlows || nextFlows.length === 0) { return []; }
        const result: { recursive: boolean; flow: SnFlow }[] = [];
        _.each(nextFlows, (f: SnFlow) => {
            const flowToward: string = f ? f.toward : null;
            if (flowToward && !(_.find(flowIn, { id: flowToward }))) {
                _.each(snView.nodes, (n: SnNode) => {
                    if (_.find(n.flows, { id: flowToward })) {
                        flowIn.push(_.find(n.flows, { id: flowToward }));
                        result.push(...n.flows
                            .filter((flow) => flow.direction === 'out')
                            .map((flow) => ({
                                flow,
                                recursive: !stopRecursion || n.type !== stopRecursion.type || flow.key !== stopRecursion.flow,
                        })));
                    }
                });
            }
        });
        return _.concat(
            nextFlows,
            result.filter((ele) => !ele.recursive).map((ele) => ele.flow),
            this.getNextFlows(snView, flowIn, _.flatten(
                result.filter((ele) => ele.recursive).map((ele) => ele.flow)
            ), stopRecursion));
    }

    getNextNode(snView: SnView, flowNext: SnFlow): SnNode {
        const find = this.getFlowsWithNode(snView).find((flowAndNode) => flowAndNode.flow.id === flowNext.toward);
        return find ? find.node : null;
    }

    getPreNodes(snView: SnView, node: SnNode): SnNode[] {
        const flowIn = node.flows.find((f) => f.direction === 'in');
        if (!flowIn) {
            return [];
        }
        return _.uniqBy(
            this.getFlowsWithNode(snView).filter((flowAndNode) => flowAndNode.flow.toward === flowIn.id).map((ele) => ele.node)
            , 'id'
        );
    }

    getStartNodes(snView: SnView, nodes: SnNode[]) {
        return _.uniqBy(
            nodes.reduce((result, node) => {
                // data node
                if (node.flows.length === 0) {
                    return result;
                }

                const preNodes = this.getPreNodes(snView, node);
                if (preNodes.length === 0) {
                    result.push(node);
                }
                for (const preNode of preNodes) {
                    if (!nodes.includes(preNode)) {
                        result.push(node);
                    }
                }
                return result;
            }, [])
            , 'id');
    }

    getEndNodes(snView: SnView, nodes: SnNode[]) {
        return _.uniqBy(
            nodes.reduce((result, n) => {
                if (n.flows.length === 0) {
                    return result;
                }

                const outFlows = n.flows.filter((flow) => flow.direction === 'out');
                if (outFlows.length === 0) {
                    result.push(n);
                }
                for (const flow of outFlows) {
                    if (!flow.toward) {
                        continue;
                    }
                    const nextNode = this.getNextNode(snView, flow);
                    if (!nodes.includes(nextNode)) {
                        result.push(n);
                    }
                }
                return result;
            }, [])
            , 'id');
    }

    getCanvasPosition(snView: SnView, nodeWidth: number): SnCanvasDto {
        const listCanvas: SnCanvasDto[] =
            [
                ..._.map(snView.groups, (gr: SnGroup) => gr.canvas),
                ..._.map(snView.box, (bx: SnBox) => bx.canvas),
                ..._.map(snView.nodes, (nd: SnNode) => nd.canvas),
            ];
        const canvas: SnCanvasDto = {
            x: _.max(listCanvas.map((c) => c.x)) + nodeWidth + 50,
            y: _.max(listCanvas.map((c) => c.y))
        };
        return canvas;
    }

    getOutputs(snView: SnView): SnParam[] {
        return _.uniqBy(_.reduce(snView.nodes, (results: SnParam[], n: SnNode) => {
            results.push(..._.reduce(n.flows, (params: SnParam[], flow: SnFlow) => {
                if (flow.direction === 'out') {
                    for (const param of flow.params) {
                        if (param.direction === 'out' && param.display === 'key-edit' && param.key && _.isString(param.types)) {
                            params.push(param);
                        }
                    }
                }
                return params;
            }, []));
            return results;
        }, []), 'key');
    }

    overlap(box1: SnCanvas, box2: SnCanvas) {
        const r1 = { x1: box1.x, x2: box1.x + box1.width, y1: box1.y, y2: box1.y + box1.height };
        const r2 = { x1: box2.x, x2: box2.x + box2.width, y1: box2.y, y2: box2.y + box2.height };

        return !(r1.x1 > r2.x2 ||
            r2.x1 > r1.x2 ||
            r1.y1 > r2.y2 ||
            r2.y1 > r1.y2);
    }
}
