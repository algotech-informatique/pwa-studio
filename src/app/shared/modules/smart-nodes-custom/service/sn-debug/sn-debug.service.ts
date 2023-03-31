import { Injectable } from '@angular/core';
import { SnLinksService, SnZoomService, SnUtilsService } from '../../../smart-nodes/services';
import { InterpretorSubjectDto, WorkflowUtilsService } from '@algotech-ce/business';
import { SnView } from '../../../smart-nodes/models';
import { WorkflowInstanceDto, WorkflowStackTaskDto } from '@algotech-ce/core';
import * as _ from 'lodash';

@Injectable()
export class SnDebugService {

    constructor(
        private workflowUtilsService: WorkflowUtilsService,
        private snUtils: SnUtilsService,
        private snLinksService: SnLinksService,
        private snZoom: SnZoomService) { }

    receiveAction(snView: SnView, data: InterpretorSubjectDto) {
        // active node
        const taskModel = this.workflowUtilsService.getActiveTaskModel(data.value);
        const activeNode = snView.nodes.find((n) =>
            _.compact([taskModel?.uuid, taskModel.properties.custom?._debug?._ref]).includes(n.id));
        if (activeNode) {
            this._resetActive(snView);
            activeNode.displayState.active = true;
            this.snZoom.centerNode(activeNode);
        }

        const activeStackTask = this.workflowUtilsService.getActiveTask(data.value);
        this.drawRoute(data.value, snView, activeStackTask);
    }

    drawRoute(instance: WorkflowInstanceDto, snView: SnView, activeStackTask: WorkflowStackTaskDto) {
        this._resetRoute(snView);

        // start task
        const startNodes = snView.nodes.filter((n) => n.type === 'SnLauncherNode');
        if (startNodes.length === 1) {
            const flow = startNodes[0].flows.find((f) => f.direction === 'out');
            if (flow) {
                flow.displayState.style = 'animate';
            }
        }

        if (instance.stackTasks.length <= 1) {
            return;
        }

        // stack
        for (let i = 0; i < instance.stackTasks.indexOf(activeStackTask); i++) {
            const taskModelFrom = this.workflowUtilsService.getTaskModel(instance, instance.stackTasks[i]);
            const taskModelTo = this.workflowUtilsService.getTaskModel(instance, instance.stackTasks[i + 1]);

            if (!taskModelFrom || !taskModelTo) { continue; }

            const nodeFrom = snView.nodes.find((n) =>
                _.compact([taskModelFrom?.uuid, taskModelFrom.properties.custom?._debug?._ref]).includes(n.id));
            if (!nodeFrom) { continue; }

            const flowIn = this.snUtils.getFlowsWithNode(snView).find((elt) =>
            (_.compact([taskModelTo.uuid, taskModelTo.properties.custom?._debug?._ref]).includes(elt.node.id) &&
                elt.flow.direction === 'in'));

            if (!flowIn) { continue; }

            const flow = nodeFrom.flows.find((f) => f.toward === flowIn.flow.id);
            if (!flow) { continue; }

            flow.displayState.style = 'animate';
        }
        this.snLinksService.drawTransitions(snView);
    }

    resetDebug(snView: SnView, options: { redraw: boolean } = { redraw: true }) {
        this._resetActive(snView);
        this._resetRoute(snView);

        if (options.redraw) {
            this.snLinksService.drawTransitions(snView);
        }
    }

    private _resetActive(snView: SnView) {
        for (const node of snView.nodes) {
            node.displayState.active = false;
        }
    }

    private _resetRoute(snView: SnView) {
        for (const flow of this.snUtils.getFlows(snView)) {
            flow.displayState.style = '';
        }
    }
}
