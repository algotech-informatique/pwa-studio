import { PairDto, WorkflowProfilModelDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { SessionsService, SnModelsService } from '../../../../../../services';
import { SnNode, SnParam, SnView } from '../../../../../smart-nodes/models';
import { SnActionsService, SnNodeMergeService, SnUtilsService } from '../../../../../smart-nodes/services';
import { EntryComponentsService } from '../../../entry-components/entry-components/entry-components.service';
import { WorkflowEntryComponentsService } from '../../../entry-components/workflow-entry-components/workflow-entry-components.service';

interface ChangesStack {
    variables: PairDto[];
    nodes: SnNode[];
}
@Injectable()
export class SnPublishFlowSubflowService {
    OFFSET_X = 300;
    OFFSET_Y = 50;

    constructor(
        private sessionsService: SessionsService,
        private snModelService: SnModelsService,
        private snUtils: SnUtilsService,
        private snActions: SnActionsService,
        private entry: EntryComponentsService,
        private workflowEntry: WorkflowEntryComponentsService,
        private snMerge: SnNodeMergeService) { }

    createNode(snView: SnView, changes: ChangesStack, subView: SnView, subViewKey: string) {
        const profileUuid = changes.nodes.find((n) => n.custom?.profile)?.custom.profile;
        const parentId = changes.nodes.find((n) => n.flows.length > 0 && n.parentId)?.parentId;

        // rm flow nodes
        for (const node of changes.nodes) {
            _.remove(snView.nodes, ((n) => n.id === node.id && n.flows.length > 0));
        }

        // create subflow
        const subNode = this._createSubWorkflow(snView, parentId, subView, subViewKey);
        const canvas = changes.nodes.map((n) => n.canvas);
        subNode.canvas.x = _.sumBy(canvas, 'x') / canvas.length;
        subNode.canvas.y = _.sumBy(canvas, 'y') / canvas.length;
        subNode.custom.profile = profileUuid;

        // toward - rebranch
        const newFlows = changes.nodes.reduce((flows, node) => {
            flows.push(...node.flows);
            return flows;
        }, []);
        for (const flow of this.snUtils.getFlows(snView)) {
            if (newFlows.some((f) => f.id === flow.toward)) {
                flow.toward = subNode.flows[0].id;
            }
            if (newFlows.some((f) => f.toward === flow.id)) {
                subNode.flows[1].toward = flow.id;
            }
        }

        // map in
        for (const input of subNode.sections.find((p) => p.key === 'inputs').params) {
            const variable = changes.variables.find((v) => v.key === input.key);
            if (variable) {
                input.toward = variable.value.id;
            }
        }

        // map out
        const outputs = this.snUtils.getOutputs(subView);
        const params = this.snUtils.getParams(snView);
        for (const output of subNode.flows.find((f) => f.key === 'done').params) {
            const outputSubView = outputs.find((p) => p.key === output.value);
            const param = params.find((p) => p.toward === outputSubView?.id);
            if (param) {
                param.toward = output.id; // direct link
            }
            const dataNodes = snView.nodes.filter((n) => n.key === outputSubView.id);
            for (const node of dataNodes) {
                node.key = output.id;    // data node
            }
        }

        // clean
        this.cleanView(snView, changes.nodes);
    }

    exportWorkflow(snView: SnView, nodes: SnNode[], subView: SnView) {
        const offsetX = _.min(nodes.map((n) => n.canvas.x)) - this.OFFSET_X;
        const offsetY = _.min(nodes.map((n) => n.canvas.y)) - this.OFFSET_Y;

        // containers
        subView.box.push(..._.cloneDeep(snView.box));
        subView.groups.push(..._.cloneDeep(snView.groups));

        // nodes
        subView.nodes.push(...nodes.map((node) => {
            return this.exportWorkflow_createNode(node, offsetX, offsetY);
        }));

        // options
        this.exportWorkflow_options(snView, subView);

        // launcher/finisher
        this.exportWorkflow_launcherAndFinisher(snView, subView, nodes);

        // variables
        const changes = this.exportWorkflow_createVariables(snView, subView, nodes, offsetX, offsetY);

        // outputs
        this.exportWorkflow_outputs(snView, subView, nodes);

        // clean
        this.cleanView(subView);

        return changes;
    }

    exportWorkflow_createNode(node: SnNode, offsetX: number, offsetY: number) {
        const copy: SnNode = _.cloneDeep(node);

        copy.parentId = null;
        copy.canvas.x -= offsetX;
        copy.canvas.y -= offsetY;
        copy.parentId = node.parentId;

        return copy;
    }

    exportWorkflow_options(snView: SnView, subView: SnView) {
        // options
        subView.options.iconName = snView.options.iconName;
        subView.options.subWorkflow = true;
        subView.options.tags = [...snView.options.tags];

        const profiles = snView.options.profiles.filter((p: WorkflowProfilModelDto) => {
            return JSON.stringify(subView.nodes).includes(p.uuid);
        });

        if (profiles.length > 1) {
            subView.options.profiles = _.cloneDeep(profiles);
        }
    }

    exportWorkflow_launcherAndFinisher(snView: SnView, subView: SnView, nodes: SnNode[]) {
        // launcher
        const startNodes = this.snUtils.getStartNodes(snView, nodes);
        const flowIn = startNodes.length > 0 ? startNodes[0].flows.find((f) => f.direction === 'in') : null;
        if (flowIn) {
            const launcher = this._createNode(subView, 'SnLauncherNode', null);
            launcher.flows.find((f) => f.direction === 'out').toward = flowIn.id;
            // profil
            if (subView.options.profiles.length > 0) {
                launcher.custom.profile = subView.options.profiles[0].uuid;
            }
            subView.nodes.push(launcher);
        }

        // finisher
        const endFlows = subView.nodes.reduce((result, n) => {
            result.push(...
                n.flows.filter((flow) => flow.direction === 'out' && flow.toward && this.snUtils.getNextNode(subView, flow) === null
                ));
            return result;
        }, []);

        if (endFlows.length > 0) {
            const finisher = this._createNode(subView, 'SnFinisherNode', null);
            finisher.canvas = { x: _.max(subView.nodes.map((n) => n.canvas.x)) + this.OFFSET_X, y: 0 };

            for (const flow of endFlows) {
                flow.toward = finisher.flows.find((f) => f.direction === 'in').id;
            }
            // profil
            if (subView.options.profiles.length > 0) {
                finisher.custom.profile = this.snUtils.getFlowsWithNode(subView)
                    .find((ele) => ele.flow === endFlows[0])?.node.custom.profile;
            }
            subView.nodes.push(finisher);
        }
    }

    exportWorkflow_generateKey(subView: SnView, param: SnParam, node?: SnNode) {
        let key = null;
        if (param.key && (param.display === 'key-edit' || (node?.type === 'SnDataNode' && node?.params[0] === param))
        ) {
            key = param.key;
        } else {
            // beautify generate name
            let type = param.types as string;
            if (type === 'string') {
                type = 'text';
            }
            if (type.includes(':')) {
                type = type.split(':')[1];
            }
            key = type;
            let i = 1;
            const outputs = this.snUtils.getOutputs(subView);
            while (subView.options.variables.some((v) => v.key === key) || outputs.some((p) => p.key === key)) {
                key = `${type}_${i++}`;
            }
        }

        return key;
    }

    exportWorkflow_createVariable(subView: SnView, key: string, type: string, multiple: boolean) {
        let variable: WorkflowVariableModelDto = subView.options.variables.find((v) => v.key === key);
        if (!variable) {
            variable = {
                uuid: UUID.UUID(),
                key,
                multiple,
                type,
            };
            subView.options.variables.push(variable);
        }
        return variable;
    }

    exportWorkflow_outputs(snView: SnView, subView: SnView, nodes: SnNode[]) {
        const subOutputs: SnParam[] = this.snUtils.getFlows(subView)
            .filter((f) => f.direction === 'out' && f.params?.length > 0)
            .reduce((result, f) => {
                result.push(...f.params);
                return result;
            }, [])
            .filter((p) => !p.key);

        const params = this.snUtils.getParamsWithNode(snView);
        for (const output of subOutputs) {
            const attached = params.filter((p) => p.param.toward === output.id);
            if (attached.some((ele) => nodes.indexOf(ele.node) === -1)) {
                output.key = this.exportWorkflow_generateKey(subView, output); // generate name
            }
        }
    }

    exportWorkflow_createVariables(snView: SnView, subView: SnView, nodes: SnNode[], offsetX: number, offsetY: number) {
        const changes: ChangesStack = {
            variables: [],
            nodes: [...nodes],
        };

        // variables
        // get all toward not find
        const outputs = this.snUtils.getOutputs(subView);
        const disconnect = this.snUtils.getParams(subView)
            .filter((param) => param.toward && !this.snUtils.findConnectedParam(subView, param));

        const toTransform = subView.nodes.filter((n) => {
            if (n.type !== 'SnDataNode') {
                return false;
            }
            return !outputs.some((output) => output.id === n.key);
        });

        // transform OUTPUT => INPUT
        for (const node of toTransform) {
            node.displayName = this.entry.initializeLangs('SN-INPUT-VALUE', this.sessionsService.active.datas.read.customer.languages);
            const param = node.params[0];
            const variable = this.exportWorkflow_createVariable(subView, param.key, param.types as string, param.multiple);

            changes.variables.push({ key: variable.key, value: param });
        }

        for (const param of disconnect) {
            const connectMainView = this.snUtils.getParamsWithNode(snView).find(
                (ele) => ele.param === this.snUtils.findConnectedParam(snView, param)
            );

            if (!connectMainView) {
                continue;
            }

            // push missing
            if (connectMainView.node.type === 'SnDataNode' && outputs.find((output) => output.id === connectMainView.node.key)) {
                changes.nodes.push(connectMainView.node);
                subView.nodes.push(this.exportWorkflow_createNode(connectMainView.node, offsetX, offsetY));
                continue;
            }

            // create var
            const key = this.exportWorkflow_generateKey(subView, connectMainView.param, connectMainView.node);
            const variable = this.exportWorkflow_createVariable(subView, key, connectMainView.param.types as string,
                connectMainView.param.multiple);
            changes.variables.push({ key, value: connectMainView.param });

            // create node
            const input = this._createInput(subView, connectMainView.node.parentId,
                variable.key, variable.type, variable.key, variable.multiple);
            const canvas = {
                x: connectMainView.node.canvas.x - offsetX,
                y: connectMainView.node.canvas.y - offsetY,
            };
            // avoid overlap
            while (subView.nodes.some((n) => n.canvas.x === canvas.x && n.canvas.y === canvas.y)) {
                canvas.y += 150;
            }
            input.canvas = canvas;
            subView.nodes.push(input);

            // branch param to node
            param.toward = input.params[0].id;
        }

        return changes;
    }

    cleanView(snView: SnView, filter?: SnNode[]) {
        // clean all data nodes disconnect
        const containers = [];
        const dataNodes = _.uniqBy(
            _.flatten(
                snView.nodes
                    .filter((n) => n.flows.length > 0)
                    .map((n) => this.snUtils.getDataNodes(snView, n)),
            ),
            'id'
        );
        _.remove(snView.nodes, (node) => {
            if (filter && !filter.some((n) => n.id === node.id)) {
                return false;
            }
            if (node.flows.length === 0 && !dataNodes.includes(node)) {
                containers.push(node.parentId);
                return true;
            }
            return false;
        });

        // clean group|box
        for (const container of _.compact(_.uniq(containers))) {
            const ele = this.snUtils.getContainerById(snView, container);
            if (this.snUtils.containerIsEmpty(snView, ele)) {
                _.remove(snView.groups, { id: ele.id });
                _.remove(snView.box, { id: ele.id });
            }
        }
    }

    //
    recompose(snView: SnView): SnView {
        if (!snView.nodes.some(this._isSubWorkflow)) {
            return snView;
        }
        return this._recomposeView(snView, false, [snView.id]);
    }

    _recomposeView(snView: SnView, changeId, stack: string[]) {
        const snViewCopy = _.cloneDeep(snView);

        if (changeId) {
            this.snActions.changeId(snViewCopy);
        }

        for (const subWorkflow of snViewCopy.nodes.filter(this._isSubWorkflow)) {
            this._recomposeNode(snViewCopy, subWorkflow, stack);
        }

        return snViewCopy;
    }

    _recomposeNode(snView: SnView, subViewNode: SnNode, stack: string[]) {
        // find view
        const params = this.snUtils.getParams(snView, subViewNode);
        const workflowKey: SnParam = params.find((p) => p.key === 'workFlow');
        const workflowModel = this.sessionsService.active.datas.write.snModels.find((snModel) => snModel.key === workflowKey?.value
            && snModel.type === 'workflow');

        // unknown
        if (!workflowModel) {
            throw new Error(`workflow model unknown: ${workflowKey?.value}`);
        }
        let subView = this.snModelService.getPublishedView(workflowModel) as SnView;
        if (!subView) {
            throw new Error(`workflow model has no published version: ${workflowKey?.value}`);
        }

        // infinite loop
        if (stack.includes(subView.id)) {
            throw new Error(`circular reference detected: ${workflowModel.key}`);
        }

        subView = this._recomposeView(subView, true, [...stack, subView.id]);

        this._mapProfiles(subView, subViewNode);
        this._mapOutputs(snView, subView, subViewNode, workflowKey?.value);

        // inject subview
        this._injectSubView(snView, subView, subViewNode, workflowKey?.value);
    }

    _mapProfiles(subView: SnView, subViewNode: SnNode) {
        const section = subViewNode.sections.find((s) => s.key === 'profiles');
        if (!section) {
            return;
        }

        const pair: { old: string, new: string }[] = section.params.map((param) => {
            return {
                old: subView.options.profiles.find((profile) => profile.name === param.key)?.uuid,
                new: param.value,
            };
        });

        for (const node of subView.nodes) {
            if (node.custom?.profile) {
                const findPair = pair.find((p) => p.old === node.custom?.profile);
                if (findPair) {
                    node.custom.profile = findPair.new;
                } else {
                    node.custom.profile = subViewNode.custom.profile;
                }
            } else if (node.custom) {
                node.custom.profile = subViewNode.custom.profile;
            }
        }
    }

    _mapOutputs(snView: SnView, subView: SnView, subViewNode: SnNode, key: string) {
        const nodeOutputs = subViewNode.flows.find((f) => f.key === 'done')?.params;
        if (!nodeOutputs) {
            return;
        }

        const subOutputs = _.flatten(
            this.snUtils.getFlows(subView)
                .filter((f) => f.direction === 'out' && f.params?.length > 0)
                .map((f) => f.params)
        );

        for (const nodeOutput of nodeOutputs) {
            const subOutputsFilter = subOutputs.filter((output: SnParam) => output.key === nodeOutput.value);
            if (subOutputsFilter.length === 0) {
                continue;
            }

            for (const subOutput of subOutputsFilter) {
                const name = nodeOutput.key ? nodeOutput.key : subOutput.key;
                subOutput.key = name;

                // new output
                const nextParams = this.snUtils.getParams(snView).filter((p) => nodeOutput.id === p.toward);
                for (const nextParam of nextParams) {
                    const out = this._createOutput(snView, subViewNode.parentId, nodeOutput.id, nodeOutput.types as string, name,
                        nodeOutput.multiple);
                    snView.nodes.push(out);
                    nextParam.toward = out.params[0].id;
                }

                // old output
                const nodes = [...snView.nodes, ...subView.nodes].filter((n) => n.type === 'SnDataNode' && n.key === nodeOutput.id ||
                    n.key === subOutput.id);
                for (const node of nodes) {
                    node.params[0].key = name;
                }
            }
        }
    }

    _injectSubView(snView: SnView, subView: SnView, subViewNode: SnNode, key: string) {
        const flowIn = subViewNode.flows.find((f) => f.direction === 'in');
        const flowOut = subViewNode.flows.find((f) => f.direction === 'out');
        const inputs = subViewNode.sections.find((s) => s.key === 'inputs');

        // first node
        const launchNode = subView.nodes.find((n) => n.type === 'SnLauncherNode');

        // last node
        const finisherNodes = subView.nodes.filter((n) => n.type === 'SnFinisherNode' &&
            n.params.find((p) => p.key === 'save')?.value === true);

        if (!launchNode || finisherNodes.length === 0) {
            throw new Error(`${key} has no start|end task`);
        }
        // rm node
        _.remove(snView.nodes, { id: subViewNode.id });

        // inject nodes
        snView.nodes.push(...subView.nodes.map((n) => {
            n.parentId = subViewNode.parentId;
            if (n.custom) {
                n.custom._debug = {
                    _ref: subViewNode.id
                };
            }
            return n;
        }));
        _.remove(snView.nodes, { id: launchNode.id });
        _.remove(snView.nodes, (n) => finisherNodes.includes(n));

        const prevFlows = this.snUtils.getFlows(snView).filter((p) => flowIn.id === p.toward);
        const launchFlowOut = launchNode.flows.find((f) => f.direction === 'out');
        const connectIn = this.snUtils.findConnectedFlow(snView, launchFlowOut);

        // input
        if (subView.options?.variables.length > 0) {
            let prevBuffer = null;
            for (const variable of subView.options.variables) {
                // create buffer
                const name = variable.key;
                const buffer = this._createBuffer(snView, subViewNode.parentId, inputs.params.find((p) => p.key === variable.key), name);
                buffer.custom._debug = { _ref: subViewNode.id };
                snView.nodes.push(buffer);
                if (prevBuffer) {
                    prevBuffer.flows.find((f) => f.direction === 'out').toward = buffer.flows[0].id;
                } else {
                    for (const prevFlow of prevFlows) {
                        prevFlow.toward = buffer.flows[0].id;
                    }
                }
                prevBuffer = buffer;

                // old input
                const nodes = [...subView.nodes].filter((n) => n.type === 'SnDataNode' && n.key === variable.key);
                for (const node of nodes) {
                    node.params[0].key = name;
                }
            }
            prevBuffer.flows.find((f) => f.direction === 'out').toward = connectIn.id;
        } else {
            // first node
            if (connectIn) {
                for (const prevFlow of prevFlows) {
                    prevFlow.toward = connectIn.id;
                }
            }
        }

        // last nodes
        const nextFlow = this.snUtils.findConnectedFlow(snView, flowOut);
        if (nextFlow) {
            for (const finisherNode of finisherNodes) {

                const finishedFlowIn = finisherNode.flows.find((f) => f.direction === 'in');
                const connectOut = this.snUtils.getFlows(snView).filter((p) => finishedFlowIn.id === p.toward);

                for (const connect of connectOut) {
                    connect.toward = nextFlow.id;
                }
            }
        }
    }

    _isSubWorkflow(node: SnNode) {
        return node.type === 'SnSubWorkflowNode';
    }

    _createParam(key: string, value: string): SnParam {
        const p: SnParam = {
            id: UUID.UUID(),
            key,
            pluggable: true, // merged
            types: '', // merged
            value,
        };
        return p;
    }

    _createSubWorkflow(snView: SnView, parentId: string, subView: SnView, subViewKey: string) {
        const subWorkflow = this._createNode(snView, 'SnSubWorkflowNode', parentId);

        // model
        subWorkflow.params.find((p) => p.key === 'workFlow').value = subViewKey;

        // create outputs
        subWorkflow.flows.find((f) => f.key === 'done').params = this.snUtils.getOutputs(subView).map((output) => {
            return this._createParam(output.key, output.key);
        });

        // create inputs
        subWorkflow.sections.find((p) => p.key === 'inputs').params = subView.options.variables.map((v: WorkflowVariableModelDto) => {
            return this._createParam(v.key, '');
        });

        // create profiles
        subWorkflow.sections.find((p) => p.key === 'profiles').params = subView.options.profiles.map((p: WorkflowProfilModelDto) => {
            return this._createParam(p.name, p.uuid);
        });

        snView.nodes.push(subWorkflow);
        return subWorkflow;
    }

    _createBuffer(snView: SnView, parentId: string, variable: SnParam, key: string) {
        const toward = this.snUtils.findConnectedParam(snView, variable);
        const buffer = this._createNode(snView, 'SnDataBufferNode', parentId);

        if (toward) {
            buffer.params[0].types = toward.types;
            buffer.params[0].toward = toward.id;
        } else {
            buffer.params[0].value = variable.value;
        }

        buffer.flows[1].params[0].multiple = variable.multiple;
        buffer.flows[1].params[0].types = variable.types;
        buffer.flows[1].params[0].key = key;

        return buffer;
    }

    _createInput(snView: SnView, parentId: string, nodeKey: string, type: string, key: string, multiple: boolean) {
        const input = this._createDataNode(snView, parentId, nodeKey, type, key, multiple);
        input.displayName = this.entry.initializeLangs('SN-INPUT-VALUE', this.sessionsService.active.datas.read.customer.languages);
        return input;
    }

    _createOutput(snView: SnView, parentId: string, nodeKey: string, type: string, key: string, multiple: boolean) {
        const output = this._createDataNode(snView, parentId, nodeKey, type, key, multiple);
        output.displayName = this.entry.initializeLangs('SN-OUTPUT-VALUE', this.sessionsService.active.datas.read.customer.languages);
        return output;
    }

    _createDataNode(snView: SnView, parentId: string, nodeKey: string, type: string, key: string, multiple: boolean) {
        const output = this._createNode(snView, 'SnDataNode', parentId, nodeKey);
        output.params[0].types = type;
        output.params[0].key = key;
        output.params[0].multiple = multiple;

        return output;
    }

    _createNode(snView: SnView, type: string, parentId: string, key?: string) {
        const schema = this._findSchema(snView, type);
        const node: SnNode = {
            id: UUID.UUID(),
            type: schema.type,
            key,
            icon: schema.icon,
            displayName: schema.displayName,
            flows: [],
            params: [],
            sections: [],
            parentId,
            open: true,
            canvas: {
                x: 0,
                y: 0,
            },
        };
        this.snMerge.mergedNode(node as SnNode, schema);
        return node;
    }

    _findSchema(snView: SnView, type: string) {
        const entry = this.workflowEntry.getEntryComponents(this.sessionsService.active.datas.read.customer.languages)(snView);
        for (const group of entry.groups) {
            const find = group.components.find((c) => c.schema.type === type);
            if (find) {
                return find.schema;
            }
        }
        return null;
    }
}
