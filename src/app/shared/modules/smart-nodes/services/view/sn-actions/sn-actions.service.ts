import { Injectable } from '@angular/core';
import { SnMessageService } from '../sn-message/sn-message.service';
import { SnView, SnNode, SnParam, SnFlow, SnElement, SnGroup, SnBox, SnConnector, SnLang, SnSection } from '../../../models';
import * as _ from 'lodash';
import { UUID } from 'angular2-uuid';
import { SnNodeSchema, SnClickView, SnSelectionEvent, SnSelectionType } from '../../../dto';
import { Observable } from 'rxjs';
import { SnNodeMergeService } from '../sn-node-merge/sn-node-merge.service';
import { SnDOMService, SnUtilsService, SnEntryComponentsService } from '../../utils';
import { SnCalculService } from '../sn-calcul/sn-calcul.service';
import { SnSettings } from '../../../dto/sn-settings';
import { SnTranslateService } from '../../lang';
import { SnSelectionService } from '../sn-selection/sn-selection.service';
import { SnRemoveService } from '../sn-remove/sn-remove.service';
import { SnComment } from '../../../models/sn-comment';
import { SnUpDownService } from '../sn-up-down/sn-up-down.service';
import { OpenInspectorType } from 'src/app/shared/modules/app/dto/app-selection.dto';

@Injectable()
export class SnActionsService extends SnMessageService {

    constructor(
        private snRemove: SnRemoveService,
        private snNodeMerge: SnNodeMergeService,
        private snCalcul: SnCalculService,
        private snTranslate: SnTranslateService,
        private snSelection: SnSelectionService,
        private snUpDown: SnUpDownService,
        private snDOM: SnDOMService,
        private snEntryComponents: SnEntryComponentsService,
        private snUtils: SnUtilsService) {
        super();
    }

    initializeView(snView: SnView, settings: SnSettings) {

        this.initializeDisplayStates(snView);
        this.snSelection.applySelect(snView, false);
        this.snCalcul.calculateConnection(snView);

        /*
        Merge all nodes
        */
        const nodes = _.reduce(snView.nodes, (results, node: SnNode) => {
            if (node.type) {
                const entryComponent = this.snEntryComponents.findEntryComponent(snView, settings, node);
                if (entryComponent) {
                    if (this.snNodeMerge.mergedNode(node, entryComponent.schema)) {
                        results.push(node);
                    }
                }
            }

            return results;
        }, []);

        /*
        Repair broken links
        */
        const connectors = this.snUtils.getConnectors(snView);
        for (const connector of connectors) {
            if (connector.toward && !connectors.find((c) => c.id === connector.toward)) {
                connector.toward = null;
            }
        }
    }

    initializeDisplayStates(snView: SnView) {
        this.initializeDisplayState([snView]);
        this.initializeDisplayState(snView.groups);
        this.initializeDisplayState(snView.box);
        this.initializeDisplayState(snView.nodes);
        this.initializeDisplayState(this.snUtils.getParams(snView));
        this.initializeDisplayState(this.snUtils.getFlows(snView));
    }

    createNewGroup(snView: SnView, canvas: { x: number; y: number }, languages: SnLang[], name = '', color?: string) {
        const group: SnGroup = {
            id: UUID.UUID(),
            canvas,
            color: color ? color : this.snDOM.getValue('--SN-GROUP-COLOR'),
            displayName: this.snTranslate.initializeLangs(name, languages),
            displayState: {},
            open: true,
        };

        snView.groups.push(group);
        this.select(snView, group, 'group');
        this.notifyContainer('add', snView, group);

        return group;
    }

    createNewBox(snView: SnView, parent: SnElement, canvas: { x: number; y: number }, languages: SnLang[]) {
        const newBox: SnBox = {
            id: UUID.UUID(),
            parentId: parent ? parent.id : null,
            canvas: this.snCalcul.calculateCanvas(snView, parent, canvas),
            displayName: this.snTranslate.initializeLangs('', languages),
            open: true,
            displayState: {},
        };
        snView.box.push(newBox);
        this.select(snView, newBox, 'box');
        this.notifyContainer('add', snView, newBox);
    }

    createNewNodeFromScratch(snView: SnView, parent: SnElement, canvas: { x: number; y: number }) {
        const node: SnNode = this.createNewNode(snView, parent, canvas);
        snView.nodes.push(node);
        this.select(snView, node, 'node');
        this.notifyNode('add', snView, node);
    }

    createNewNodeFromFlow(snView: SnView, parent: SnElement, canvas: { x: number; y: number },
        flow: SnFlow, flowOrigin: SnFlow) {

        const node: SnNode = this.createNewNode(snView, parent, canvas, flow);

        if (flowOrigin.direction === 'out') {
            flowOrigin.toward = flow.id;
        }

        snView.nodes.push(node);
        this.select(snView, node, 'node');
        this.notifyNode('add', snView, node);
    }

    createNewNodeFromParam(snView: SnView, parent: SnElement, canvas: { x: number; y: number },
        param: SnParam, paramOrigin: SnParam) {
        const node: SnNode = this.createNewNode(snView, parent, canvas, null, param);

        if (paramOrigin.direction === 'in') {
            paramOrigin.toward = param.id;
        }

        snView.nodes.push(node);

        this.select(snView, node, 'node');
        this.notifyNode('add', snView, node);
    }

    expandNodes(snView: SnView, containers?: SnElement[]) {
        const nodes = containers ? this.snUtils.getNodesByContainers(snView, containers, true) : snView.nodes;
        if (nodes.length === 0) {
            return;
        }
        const state = !this.snUtils.nodesExpanded(nodes);
        for (const node of nodes) {
            node.expanded = state;
        }
        this.notifyHide(snView);
    }

    select(snView: SnView, element: SnElement | SnNode | SnConnector | SnParam, type: SnSelectionType) {
        this.snSelection.select(null, snView, { element, type });
    }

    closeContainer(snView: SnView, container: SnElement) {
        // center
        container.open = !container.open;
        if (!container.open) {
            container.canvas.x = container.canvas.x + ((container.canvas.width - this.snDOM.containerSize) / 2);
            container.canvas.y = container.canvas.y + ((container.canvas.height - this.snDOM.containerSize) / 2);
        }

        this.notifyHide(snView);
    }

    mergedNode(snView: SnView, node: SnNode, schema: SnNodeSchema) {
        if (this.snNodeMerge.mergedNode(node, schema)) {
            this.notifyNode('chg', snView, node);
        }
    }

    linkConnector(snView: SnView, connectorA: SnConnector, connectorB: SnConnector, type: 'param' | 'flow') {
        const connectors = this.snUtils.findInOut(connectorA, connectorB);

        const connectorsAndNode = this.snUtils.getConnectorsWithNode(snView);
        const nodeIn = connectorsAndNode.find((c) => c.connector.id === connectors.in.id);
        const nodeOut = connectorsAndNode.find((c) => c.connector.id === connectors.out.id);

        if (!nodeIn || !nodeOut) {
            return;
        }

        switch (type) {
            case 'param':
                connectors.in.toward = connectors.out.id;
                break;
            case 'flow':
                connectors.out.toward = connectors.in.id;
                break;
        }
        this.notifyLink(snView, [nodeIn.node, nodeOut.node]);
    }

    addParam(snView: SnView, node: SnNode, param: SnParam | SnParam[], params: SnParam[], index?: number) {
        if (Array.isArray(param)) {
            this.initializeDisplayState(param);
            params.push(...param.map((p) => {
                this.snNodeMerge.initializeParamValue(p);
                return p;
            }));
            this.notifyNode('chg', snView, node);
            return;
        }
        this.initializeDisplayState([param]);
        if (index === undefined) {
            params.push(param);
        } else {
            params.splice(index, 0, param);
        }
        this.snNodeMerge.initializeParamValue(param);
        this.notifyParam('add', snView, node, param, params);
    }

    editParam(snView: SnView, node: SnNode, param: SnParam, params: SnParam[], propKey: string, propValue: any) {
        if (JSON.stringify(param[propKey]) === JSON.stringify(propValue)) {
            return;
        }
        param[propKey] = propValue;
        if (param.direction === 'in' && propKey === 'types') {
            this.snNodeMerge.initializeParamValue(param);
        }
        this.notifyParam('chg', snView, node, param, params);
    }

    moveUpDown(snView: SnView, direction: 'up' | 'down') {
        this.snUpDown.moveUpDown(snView, direction);
        this.notifyMove(snView);
    }

    addFlow(snView: SnView, node: SnNode, flows: SnFlow[], languages: SnLang[],
        notifyParam: boolean = false, connectedParam?: SnParam, section?: SnSection) {

        const uuid = UUID.UUID();
        const flow: SnFlow = {
            id: uuid,
            key: uuid,
            direction: 'out',
            displayName: this.snTranslate.initializeLangs('', languages),
            params: [],
        };

        if (notifyParam) {
            flow.custom = { linkedParam: UUID.UUID() };
        }

        this.initializeDisplayState([flow]);
        flows.push(flow);
        if (notifyParam) {
            this.addFlowParam(flow, connectedParam, section);
        }
        this.notifyFlow('add', snView, node, flow, flows);
    }

    addFlowParam(flow: SnFlow, connectedParam: SnParam, section: SnSection) {
        const param: SnParam = {
            id: UUID.UUID(),
            direction: 'in',
            key: flow.key,
            types: connectedParam?.types,
            multiple: connectedParam?.multiple,
            displayName: flow.displayName,
            pluggable: true,
            display: 'input',
            displayState: {},
            custom: {
                linkedParam: flow.custom?.linkedParam,
            },
        };
        section.params.push(param);
    }

    remove(snView: SnView, settings: SnSettings, cascade = true) {
        const elementsToRemove = this.snRemove.getElementsToRemove(snView);
        if (!elementsToRemove) {
            return;
        }

        if (settings.removeConfirmation) {
            settings.removeConfirmation(elementsToRemove, () => {
                this.snRemove.remove(snView, elementsToRemove, cascade);
                this.snSelection.unselect(snView);
                this.notifyRemove(snView);
            });

            return;
        }

        this.snRemove.remove(snView, elementsToRemove, cascade);
        this.snSelection.unselect(snView);
        this.notifyRemove(snView);
    }

    removeParams(snView: SnView, paramsToRemove: SnParam[], params: SnParam[]) {
        this.snRemove.removeParams(snView, paramsToRemove, params);
        this.notifyRemove(snView);
    }

    removeComment(snView: SnView, commentToRemove: SnComment) {
        _.remove(snView.comments, { id: commentToRemove.id });
        this.notifyRemove(snView);
    }

    changeId(elements: {
        groups: SnGroup[];
        box: SnBox[];
        nodes: SnNode[];
    }) {// update ids (groups, box, nodes, params, sections, flows) and save a mapping array oldId <=> newId
        const uuidMapping = [];

        const changeUuid = (element) => {
            const newID = UUID.UUID();
            const oldID = element.id;

            uuidMapping.push({ oldID, newID });

            element.id = newID;

            return element;
        };

        elements.groups.map(changeUuid);
        elements.box.map(changeUuid);

        elements.nodes.map((node) => {

            this.snUtils.getParams(null, node).map(changeUuid);
            node.flows.map(changeUuid);
            node.sections.map(changeUuid);

            return changeUuid(node);
        });

        // re-route toward and parentId to correct element
        _.each(elements.box, (box) => {

            const findOldParentId = _.find(uuidMapping, { oldID: box.parentId });
            if (findOldParentId) {
                box.parentId = findOldParentId.newID;
            } else {
                box.parentId = null;
            }
        });

        _.each(elements.nodes, (node) => {

            const findOldParentId = _.find(uuidMapping, { oldID: node.parentId });
            if (findOldParentId) {
                node.parentId = findOldParentId.newID;
            } else {
                node.parentId = null;
            }

            const findOldKey = _.find(uuidMapping, { oldID: node.key });
            if (findOldKey) {
                node.key = findOldKey.newID;
            }

            // re route connectors
            _.each(this.snUtils.getConnectors(null, node), (connector: SnConnector) => {
                const findOldId = _.find(uuidMapping, { oldID: connector.toward });
                if (findOldId) {
                    connector.toward = findOldId.newID;
                } else {
                    connector.toward = null;
                }
            });
        });
    }

    renameNode(snView: SnView, node: SnNode, value?: string) {
        if (value) {
            if (_.isArray(node.displayName)) {
                node.displayName = this.snTranslate.setValue(value, node.displayName as SnLang[]);
            } else {
                node.displayName = value;
            }
        }
        node.displayState.edit = false;
        this.notifyNode('chg', snView, node);
    }

    openComment(snView: SnView, container: SnElement) {
        const comment: SnComment = snView.comments.find((c) => c.parentId === container.id);
        if (comment) {
            comment.open = true;
        } else {
            snView.comments.push({
                id: UUID.UUID(),
                parentId: container.id,
                open: true,
                comment: '',
                canvas: {
                    x: container.canvas.x + this.snDOM.commentSpace,
                    y: container.canvas.y - this.snDOM.commentSpace
                }
            });
        }

        this.notifyHide(snView);
    }

    /*
     MESSAGE
    */

    onGroupUpdate(snView: SnView, cmd?: 'add' | 'rm' | 'chg'): Observable<{ group: SnGroup }> {
        return this._get(`sn.update.group${cmd ? '.' + cmd : ''}`, snView);
    }

    onNodeUpdate(snView: SnView, cmd?: 'add' | 'rm' | 'chg'): Observable<{ node: SnNode }> {
        return this._get(`sn.update.node${cmd ? '.' + cmd : ''}`, snView);
    }

    onParamUpdate(snView: SnView, cmd?: 'add' | 'rm' | 'chg'):
        Observable<{ node: SnNode; param: SnParam; params: SnParam[] }> {
        return this._get(`sn.update.param${cmd ? '.' + cmd : ''}`, snView);
    }

    onFlowUpdate(snView: SnView, cmd?: 'add' | 'rm' | 'chg'):
        Observable<{ node: SnNode; flow: SnFlow; flows: SnFlow[] }> {
        return this._get(`sn.update.flow${cmd ? '.' + cmd : ''}`, snView);
    }

    onMove(snView: SnView): Observable<{ node: SnNode }> {
        return this._get('sn.update.node.move', snView);
    }

    onLinked(snView: SnView): Observable<{ node: SnNode }> {
        return this._get('sn.update.node.link', snView);
    }

    onRemove(snView: SnView): Observable<any> {
        return this._get('sn.update.remove', snView);
    }

    onHide(snView: SnView): Observable<any> {
        return this._get('sn.update.hide', snView);
    }

    onUpdate(snView: SnView): Observable<any> {
        return this._get('sn.update', snView);
    }

    onCheck(snView: SnView): Observable<any> {
        return this._get('sn.do.check', snView);
    }

    onChecked(snView: SnView): Observable<any> {
        return this._get('sn.checked', snView);
    }

    onRefresh(snView: SnView): Observable<any> {
        return this._get('sn.refresh', snView);
    }

    onClickEvent(snView: SnView): Observable<SnClickView> {
        return this._get('sn.click.event', snView);
    }

    onDrawing(snView: SnView): Observable<{ drawing: boolean }> {
        return this._get('sn.drawing', snView);
    }

    onShowInspector(snView: SnView): Observable<any> {
        return this._get('sn.show.inspector', snView);
    }

    notifyShowInspector(snView: SnView, openInspector: OpenInspectorType) {
        this._send('sn.show.inspector', snView, { openInspector });
    }

    public notifyCheck(view: SnView, type: 'SF' | 'WF' | 'SM') {
        this._send('sn.do.check', view, { type });
    }

    public notifyChecked(view: SnView) {
        this._send('sn.checked', view, {});
    }

    public notifyRefresh(view: SnView) {
        this._send('sn.refresh', view, {});
    }

    public notifyUpdate(view: SnView) {
        this._send('sn.update', view, {});
    }

    public notifyMove(view: SnView, node?: SnNode) {
        this._send('sn.update.move', view, {});
    }

    public notifyHide(view: SnView, node?: SnNode) {
        this._send('sn.update.hide', view, node ? { node } : {});
    }

    public notifyContainerMove(view: SnView, container: SnElement) {
        this._send('sn.update.container.move', view, { container });
    }

    public notifyNodeMove(view: SnView, node?: SnNode) {
        this._send('sn.update.node.move', view, node ? { node } : {});
    }

    public notifyNode(cmd: 'add' | 'rm' | 'chg', view: SnView, node?: SnNode) {
        this._send(`sn.update.node.${cmd}`, view, node ? { node } : {});
    }

    public notifyInspector(view: SnView) {
        this._send(`sn.update.inspector`, view, {});
    }

    public notifyPaste(view: SnView) {
        this._send('sn.update.paste', view, {});
    }

    public notifyComment(view: SnView, comment: SnComment) {
        this._send('sn.update.comment', view, { comment });
    }

    public notifyClickEvent(view: SnView, data: SnClickView) {
        this._send('sn.click.event', view, data);
    }

    public notifyDrawing(view: SnView, drawing: boolean) {
        this._send('sn.drawing', view, { drawing });
    }

    private notifyContainer(cmd: 'add' | 'rm' | 'chg', view: SnView, container: SnElement) {
        this._send(`sn.update.container.${cmd}`, view, { container });
    }

    private notifyParam(cmd: 'add' | 'rm' | 'chg', view: SnView, node: SnNode, param: SnParam, params: SnParam[]) {
        this._send(`sn.update.param.${cmd}`, view, { node, param, params });
    }

    private notifyFlow(cmd: 'add' | 'rm' | 'chg', view: SnView, node: SnNode, flow: SnFlow, flows: SnFlow[]) {
        this._send(`sn.update.flow.${cmd}`, view, { node, flow, flows });
    }

    private notifyLink(view: SnView, nodes: SnNode[]) {
        this._send('sn.update.node.link', view, { nodes });
    }

    private notifyRemove(view: SnView) {
        this._send('sn.update.remove', view, {});
    }

    private initializeDisplayState(array: any[]) {
        for (const node of array) {
            if (!node.displayState) {
                node.displayState = {};
            }
        }
    }

    private createNewNode(snView: SnView, parent: SnElement,
        canvas: { x: number; y: number }, flow?: SnFlow, param?: SnParam) {

        const newNode: SnNode = {
            id: UUID.UUID(),
            parentId: parent ? parent.id : null,
            type: null,
            canvas: this.snCalcul.calculateCanvas(snView, parent, canvas),
            displayName: null,
            icon: null,
            open: true,
            flows: [],
            params: [],
            sections: [],
            displayState: {}
        };

        if (flow) {
            newNode.flows.push(flow);
        }
        if (param) {
            newNode.params.push(param);
        }

        return newNode;
    }

}
