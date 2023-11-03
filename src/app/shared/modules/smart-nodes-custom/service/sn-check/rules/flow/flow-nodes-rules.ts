import { SnModelDto, WorkflowProfilModelDto } from '@algotech-ce/core';
import { SnViewRule } from '../../../../../../models/check-rule.interface';
import { SnFlow, SnNode, SnParam, SnView } from '../../../../../smart-nodes';
import { SnCheckUtilsService } from '../../check-utils';
import * as _ from 'lodash';
import { ValidationReportDto } from '../../../../../../dtos';

export const snDataNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.type === 'SnDataNode') {
            const output: SnParam = checkUtilsService.snAtNodeUtils.getOutParam(item).param;
            if (!output) {
                return true;
            }

            if (!checkUtilsService.dataExists(snView, item, output.key)) {
                checkUtilsService.pushError(snView, stackCode, report, 'WRONG_TYPE', item, output, output.key, 'node');
                return false;
            }

            const type = output.types as string;
            const section = item.sections.find((f) => f.key === 'properties');

            if (!section) {
                return true;
            }

            if (!_.isString(type) || !type.startsWith('so:')) {
                return true;
            }

            let error = false;
            // property key format: KEY_PROPERTY.KEY_SUBPROPERTY..
            for (const param of section.params) {
                if (!['sys:createdDate', 'sys:updateDate'].includes(param.key)) {
                    if (!checkUtilsService.verifyProperty(param.key, type, true)) {
                        error = true;
                        checkUtilsService.pushError(snView, stackCode, report, 'PROPERTY_NOT_FOUND', item, param, param.key, 'node');
                    }
                }
            }

            return !error;
        }
        return true;
    }
};

export const crudObjectRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (['SnFormNode', 'SnObjectCreationNode', 'SnObjectAssignmentNode', 'SnCsvMappedNode'].indexOf(item.type) !== -1) {
            let sectionKey = 'properties';
            switch (item.type) {
                case 'SnFormNode':
                    sectionKey = 'options';
                    break;
                case 'SnCsvMappedNode':
                    sectionKey = 'dateFormat';
                    break;
            }
            const section = item.sections.find((s) => s.key === sectionKey);
            if (!section) {
                return true;
            }

            // property key format: KEY_MODEL.KEY_PROPERTY
            let error = false;
            for (const param of section.params) {
                let paramError = true;
                if (['SnCsvMappedNode', 'SnObjectCreationNode'].indexOf(item.type) > -1) {
                    const output: SnParam = checkUtilsService.snAtNodeUtils.getOutParam(item).param;
                    if (output) {
                        const type = output.types as string;
                        paramError = !checkUtilsService.verifyProperty(param.key, type);
                    }
                } else {
                    const split = _.compact(param.key.split(/\.(.*)/));
                    paramError = split.length > 1 && !checkUtilsService.verifyProperty(split[1], `so:${split[0]}`);
                }

                if (paramError) {
                    error = true;
                    checkUtilsService.pushError(snView, stackCode, report, 'PROPERTY_NOT_FOUND', item, param, param.key, 'node');
                }

            }
            return !error;
        }
        return true;
    }
};

export const snLoopNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.type === 'SnLoopNode') {
            const flowNext: SnFlow = _.find(item.flows, { key: 'next' });
            const flowIn: SnFlow = _.find(item.flows, { direction: 'in' });
            const flowDone: SnFlow = _.find(item.flows, { key: 'done' });
            if (!flowDone.toward) {
                checkUtilsService.pushWarning(snView, stackCode, report, 'END_LOOP_NOT_CONNECTED', item, flowDone, null, 'node');
            }
            const nextNode: SnNode = checkUtilsService.snUtils.getNextNode(snView, flowNext);
            const nextFlows: SnFlow[] = nextNode ?
                checkUtilsService.snUtils.getNextFlows(snView, [flowIn], _.filter(nextNode.flows, { direction: 'out' })) :
                null;
            if (!nextFlows || nextFlows.length === 0) {
                checkUtilsService.pushError(snView, stackCode, report, 'LOOP_INVALID', item, flowNext, null, 'node');
                return false;
            }
        }
        return true;
    }
};

export const snMultiChoiceNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.type === 'SnMultiChoiceNode') {
            if (!_.some(item.flows, { direction: 'out' })) {
                checkUtilsService.pushError(snView, stackCode, report, 'MULTI_CHOICE_INVALID', item, null, null, 'node');
                return false;
            }
        }
        return true;
    }
};

export const snSubWorkflowNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.type === 'SnSubWorkflowNode') {
            const snModel = checkUtilsService.snAtNodeUtils.getSnModel(item, 'workFlow');
            const view = checkUtilsService.snModelsService.getPublishedView(snModel) as SnView;
            if (!view || !checkUtilsService.snAtNodeUtils.checkSubView(view, 'SnSubWorkflowNode')) {
                checkUtilsService.pushError(snView, stackCode, report, 'SUB_WORKFLOW_INVALID', item, null, null, 'node');
                return false;
            }
        }
        return true;
    }
};

export const snConnectorNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        if (item.type === 'SnConnectorNode') {
            const snModel: SnModelDto = checkUtilsService.snConnectorUtils.getSmartflowModel(item);
            const view: SnView = checkUtilsService.snModelsService.getPublishedView(snModel) as SnView;
            if (!view || checkUtilsService.snAtNodeUtils.checkHasCircularDependencies(view, [view.id], 'SnConnectorNode')) {
                checkUtilsService.pushError(snView, stackCode, report, 'SUB_SMARTFLOW_INVALID', item, null, null, 'node');
                return false;
            }

        }
        return true;
    }
};

export const snConnectorParameterNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        if (item.type === 'SnConnectorParameterNode') {

            const output: SnParam = checkUtilsService.snAtNodeUtils.getOutParam(item).param;
            if (!output) {
                return true;
            }

            const refUuid = checkUtilsService.sessionsService.getRootDirectory(
                checkUtilsService.sessionsService.active.connection.host,
                checkUtilsService.sessionsService.active.connection.customerKey,
                'smartflow',
                checkUtilsService.sessionsService.active.datas.write.
                    snModels.find((modl) => modl.uuid === snModelUuid)?.dirUuid)?.uuid;

            const customs = checkUtilsService.sessionsService.getConnectorCustom(
                checkUtilsService.sessionsService.active.connection.host,
                checkUtilsService.sessionsService.active.connection.customerKey,
                'smartflow',
                refUuid,
            );

            if (customs && customs.length !== 0 && customs.find((c) => c.active && c.key === output.key)) {
                return true;
            } else {
                checkUtilsService.pushError(snView, stackCode, report, 'CONNECTOR_PARAMETER_NOT_FOUND', item, null, null, 'node');
                return false;
            }
        };
        return true;
    }
};

export const snServiceSmartObjectV2NodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.type === 'SnServiceSmartObjectV2Node') {
            const modelKey = item.params.find((p) => p.key === 'modelKey');
            if (!modelKey) {
                return true;
            }
            const filterSection = item.sections.find((s) => s.key === 'filter');
            if (!filterSection) {
                return true;
            }

            let error = false;
            // complexe search parameters
            const filtersByModelKeys: { key: string; param: SnParam }[] = [];
            const deepFilters: { key: string; param: SnParam }[] = [];
            for (const param of filterSection.params) {
                const keys = param.key ? param.key.split('.') : [];
                if (param.custom.type.startsWith('so:') && !filtersByModelKeys.find(p => p.key === keys[0])) {
                    filtersByModelKeys.push({ key: keys[0], param });
                };
                if ((keys.length === 2 && param.custom.type.startsWith('so:')) || keys.length > 2) {
                    deepFilters.push({ key: keys[0], param });
                }
                if (!param.key || !checkUtilsService.verifyProperty(param.key, modelKey.value, true)) {
                    error = true;
                    checkUtilsService.pushError(snView, stackCode, report, 'PROPERTY_NOT_FOUND', item, param, param.key, 'node');
                }
            }

            if (filtersByModelKeys.length > 1) {
                filtersByModelKeys.forEach(p => {
                    checkUtilsService.pushWarning(snView, stackCode, report, 'MULTIPLE_SO_SEARCH_FITLERS',
                        item, p.param, p.param.key, 'node');
                });
            }

            if (deepFilters.length > 0) {
                deepFilters.forEach(p => {
                    checkUtilsService.pushWarning(snView, stackCode, report, 'COMPLEXE_SEARCH_FITLERS', item, p.param, p.param.key, 'node');
                });
            }

            const orderSection = item.sections.find((s) => s.key === 'order');
            if (orderSection) {
                for (const param of orderSection.params) {
                    if (!param.key || !checkUtilsService.verifyProperty(param.key, modelKey.value, true)) {
                        error = true;
                        checkUtilsService.pushError(snView, stackCode, report, 'PROPERTY_NOT_FOUND', item, param, param.key, 'node');
                    }
                }
            }

            return !error;
        }
        return true;
    }
};

export const nodeRProfileRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        const profils: WorkflowProfilModelDto[] = checkUtilsService.getProfils(snView);
        if (profils.length !== 0) {
            if (item.custom?.taskKey && !item.custom?.profile) {
                checkUtilsService.pushError(snView, stackCode, report, 'PROFIL_NOT_FOUND', item, null, null,
                    'inspector');
                return false;
            }
        }
        return true;
    }
};


export const snSwitchNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        if (item.type === 'SnSwitchNode') {
            const outputs: SnFlow[] = item.flows.filter((f) => f.direction === 'out' && f.key === 'default');
            outputs.forEach((f: SnFlow) => {
                if (!f.toward) {
                    checkUtilsService.pushError(snView, stackCode, report, 'FLOW_NO_CONNECTED', item, f, f.key, 'node');
                    return false;
                }
            });
        }
        return true;
    }
};

export const profilesNodeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        if (item.type === 'SnFinisherNode') {
            const profiles = checkUtilsService.snAtNodeUtils.getProfiles(snView);
            if (profiles.length === 0) {
                return true;
            }
            const allFlows: { flow: SnFlow; node: SnNode }[] = checkUtilsService.snUtils.getFlowsWithNode(snView);
            const flowIn = item.flows.find((f) => f.direction === 'in');
            const findFlows = !flowIn ? [] : allFlows.filter((f) => f.flow.toward === flowIn.id);

            findFlows.forEach((f) => {
                if (f.node.custom?.profile !== item.custom?.profile) {
                    checkUtilsService.pushError(snView, stackCode,
                        report, 'PROFILE_CONSISTENCY_ERROR', item, null, null, 'node');
                    return false;
                }
            });
            return true;
        }
    }
};

export const severalEntryPoints: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        if (item.type === 'SnLauncherNode') {
            if (snView.nodes.filter((n) => n.type === 'SnLauncherNode').length > 1) {
                checkUtilsService.pushError(snView, stackCode,
                    report, 'SEVERAL-ENTRY-POINTS', item, null, null, 'node');
                return false;
            }
        }
        return true;
    }
};

export const needsSmartObjectForSave: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {

        const list = [
            'SnDocumentConvertNode',
            'SnDocumentFileCreateNode',
            'SnxReportNode'
        ];
        if (list.includes(item.type)) {
            const saveSection = item.sections.find((s) => s.key === 'save');
            const saveParam = saveSection?.params.find((p) => p.key === 'save');
            const soParam = saveSection?.params.find((p) => p.key === 'object');

            if (!!saveParam?.value && !soParam.toward) {
                checkUtilsService.pushError(snView, stackCode,
                    report, 'NEEDS_SMARTOBJECT', item, null, null, 'node');
                return false;
            }
        }
        return true;
    }
};
