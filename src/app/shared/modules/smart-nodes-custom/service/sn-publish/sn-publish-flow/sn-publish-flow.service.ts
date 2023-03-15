import { Injectable } from '@angular/core';
import { SnView, SnGroup, SnNode, SnLang, SnFlow, SnParam } from '../../../../smart-nodes/models';
import {
    SnModelDto, WorkflowModelDto, WorkflowStepModelDto, TaskModelDto, TaskTransitionModelDto,
    PairDto, WorkflowExpressionDto, WorkflowProfilModelDto, ServiceModelDto, EnvironmentDirectoryDto,
} from '@algotech/core';
import { throwError, of, Observable } from 'rxjs';
import { UUID } from 'angular2-uuid';
import { WorkflowModelsService, SmartFlowsService, KeyFormaterService } from '@algotech/angular';
import { DatasService, CheckService, MessageService, SessionsService, SnModelsService } from '../../../../../services';
import { tap, map } from 'rxjs/operators';
import { SnUtilsService, SnTranslateService, SnActionsService } from '../../../../smart-nodes/services';
import * as _ from 'lodash';
import { TaskTransitionDataModelDto, EnvironmentParameterDto } from '@algotech/core';
import { ResourceType } from '../../../../../dtos';
import { SnPublishFlowTransformService } from './sn-publish-flow-transform/sn-publish-flow-transform';
import { SnPublishFlowSubflowService } from './sn-publish-flow-subflow/sn-publish-flow-subflow';
import moment from 'moment';

const defaultProfil: WorkflowProfilModelDto = {
    uuid: '5138126f-4252-46f3-8a1d-03369b671d4f',
    name: 'default'
};
@Injectable()
export class SnPublishFlowService {

    constructor(
        private keyFormaterService: KeyFormaterService,
        private workflowModelsService: WorkflowModelsService,
        private smartflowModelsService: SmartFlowsService,
        private snTranslate: SnTranslateService,
        private snUtils: SnUtilsService,
        private snAction: SnActionsService,
        private snModelsService: SnModelsService,
        private sessionsService: SessionsService,
        private datasService: DatasService,
        private messageService: MessageService,
        private checkService: CheckService,
        private publishSubflow: SnPublishFlowSubflowService,
        private publishTransform: SnPublishFlowTransformService,
    ) { }

    publish(snView: SnView, snModel: SnModelDto, host: string, customerKey: string, languages: SnLang[]): Observable<any> {
        const version = snModel.versions.find((v) => v.view.id === snView.id);
        const index = snModel.versions.filter((v) => !v.deleted).indexOf(version);

        if (!version) {
            return throwError('view not find on model');
        }

        snModel.publishedVersion = version.uuid;

        let flow: WorkflowModelDto = null;
        try {
            flow = this.getFlow(snView, snModel, index, languages, snModel.type as ResourceType, host, customerKey);
        } catch (e) {
            return throwError(e);
        }

        let publish$: Observable<any> = null;
        switch (snModel.type) {
            case 'smartflow':
                publish$ = this.smartflowModelsService.put(flow);
                break;
            case 'workflow':
                publish$ = snView.options.subWorkflow ?
                    of({}) :
                    this.workflowModelsService.put(flow).pipe(tap(() => {
                        this.datasService.notifyPublishWorkflow(customerKey, host, flow);
                    }));
                break;
            default:
                publish$ = of({});
                break;
        }

        return publish$.pipe(
            tap(() => {
                this.datasService.notifySNModel(snModel, customerKey, host);
            }),
            map(() => true),
        );
    }

    _createDirectory(snModel: SnModelDto) {
        const directory: EnvironmentDirectoryDto = {
            uuid: UUID.UUID(),
            name: '_generate',
            subDirectories: [],
        };
        return this.datasService.createStoreDirectory(
            this.sessionsService.active.connection.customerKey,
            this.sessionsService.active.connection.host,
            snModel.type as ResourceType,
            directory,
            false,
            snModel.dirUuid,
        );
    }

    exportWorkflow(snModel: SnModelDto, snView: SnView, nodes: SnNode[]) {
        const dir = this._createDirectory(snModel);
        const name = `${this.snTranslate.transform(snModel.displayName)}`;
        const model: SnModelDto = this.snModelsService.createNewModel(snModel.type as ResourceType, UUID.UUID(), name,
            this.sessionsService.active.datas.read.localProfil.id, dir.uuid, null, this.sessionsService.active.datas);

        this.snModelsService.validateModelKey(this.sessionsService.active.datas.write.snModels, model);

        // nodes
        const newView = model.versions[0].view as SnView;
        const changes = this.publishSubflow.exportWorkflow(snView, nodes, newView);

        // published
        model.publishedVersion = model.versions[0].uuid;
        this.datasService.createStoreModel(
            this.sessionsService.active.connection.customerKey,
            this.sessionsService.active.connection.host,
            model);

        // check
        this.checkService.dosnViewCheck((model.type === 'smartflow') ? 'SF' :
            (model.type === 'workflow') ? 'WF' : 'SM', 'onPublish').subscribe((errors) => {
                if (errors) {
                    model.publishedVersion = null;
                    this.sessionsService.refreshEnv();
                    this.messageService.send('open-tab', model);
                } else {
                    this.sessionsService.refreshEnv();

                    // create subflow
                    this.publishSubflow.createNode(snView, changes, newView, model.key);
                    this.snAction.notifyNode('chg', snView);
                }
            });
    }

    getFlow(snView: SnView, snModel: SnModelDto, viewVersion: number, languages: SnLang[], type: ResourceType,
        host: string, customerKey: string, injectParameters = false): WorkflowModelDto {

        let profiles: WorkflowProfilModelDto[] = [];
        if (type === 'workflow') {
            profiles = snView.options.profiles && snView.options.profiles.length > 0 ?
                snView.options.profiles : [defaultProfil];
        }

        const recomposeView = this.publishSubflow.recompose(snView);
        const proceedView = this.publishTransform.proceedView(recomposeView, profiles.length > 0 ? profiles[0] : null);

        const flow: WorkflowModelDto = {
            uuid: snModel.uuid,
            createdDate: snModel.createdDate,
            updateDate: moment().format(),
            viewId: proceedView.id,
            snModelUuid: snModel.uuid,
            viewVersion,
            connectorUuid: this.sessionsService.getRootDirectory(host, customerKey, 'smartflow', snModel.dirUuid)?.uuid,
            key: snModel.key,
            displayName: snModel.displayName,
            iconName: proceedView.options.iconName,
            parameters: injectParameters ? this.getParameters(snModel, host, customerKey) : [],
            variables: proceedView.options.variables ? proceedView.options.variables : [],
            profiles,
            tags: proceedView.options.tags ? proceedView.options.tags : [],
            steps: this.getSteps(proceedView, languages),
            api: proceedView.options.api,
        };

        return flow;
    }

    getParameters(snModel: SnModelDto, host: string, customerKey: string) {
        const parameters: EnvironmentParameterDto[] =
            this.sessionsService.getConnectorCustom(host, customerKey, 'smartflow', snModel.dirUuid);
        if (!parameters) {
            return [];
        }

        return _.filter(parameters, (p: EnvironmentParameterDto) => p.key && p.active);
    }

    getSteps(snView: SnView, languages: SnLang[]): WorkflowStepModelDto[] {
        const treatedNodes: SnNode[] = [];
        const steps: WorkflowStepModelDto[] = _.reduce(snView.groups, (results, group: SnGroup) => {
            const nodes: SnNode[] = this.snUtils.getNodesByContainer(snView, group, true);
            if (nodes.length > 0) {

                const flowsNodes = nodes.filter((node) => node.flows.length > 0);

                treatedNodes.push(...flowsNodes);
                results.push(this.getStep(snView, flowsNodes, languages, group));
            }
            return results;

        }, []);

        const residual = snView.nodes.filter((node) => node.flows.length > 0 && treatedNodes.indexOf(node) === -1);
        if (residual.length > 0) {
            steps.push(this.getStep(snView, residual, languages));
        }

        return steps;
    }

    getStep(snView: SnView, nodes: SnNode[], languages: SnLang[], group?: SnGroup): WorkflowStepModelDto {
        if (group && !_.isArray(group.displayName)) {
            throw new Error(`group ${group.id} displayName must be SnLang array`);
        }

        const displayName: SnLang[] = (group ? group.displayName : this.snTranslate.initializeLangs('', languages)) as SnLang[];

        const step: WorkflowStepModelDto = {
            uuid: group ? group.id : UUID.UUID(),
            displayName,
            key: group ? this.keyFormaterService.format(this.snTranslate.transform(displayName)) : 'unknown',
            tasks: this.getTasks(snView, nodes),
        };

        return step;
    }

    getTasks(snView: SnView, nodes: SnNode[]): TaskModelDto[] {
        return _.map(nodes, (node: SnNode) => {

            if (!node.custom || !node.custom.taskKey) {
                throw new Error(`taskKey of node ${node.key} inccorect`);
            }

            if (node && !_.isArray(node.displayName)) {
                throw new Error(`node ${node.id} displayName must be SnLang array`);
            }

            const type = node.custom.taskKey;
            const custom = this.calculateCustom(node);

            const attachedNodes: SnNode[] = this.snUtils.getDataNodes(snView, node);
            const expressions: WorkflowExpressionDto[] = _.reduce(attachedNodes, (results, attachedNode: SnNode) => {

                if (this.publishTransform.isExpression(attachedNode) && attachedNode.params.length > 0 && attachedNode.params[0].value) {
                    const expression: WorkflowExpressionDto = {
                        key: attachedNode.params[0].id,
                        type: attachedNode.params[0].types as string,
                        value: attachedNode.params[0].value,
                    };
                    results.push(expression);
                }
                return results;
            }, []);

            const services: ServiceModelDto[] = _.reduce(attachedNodes, (results, attachedNode: SnNode) => {
                if (this.publishTransform.isService(attachedNode) && attachedNode.params.length > 0 && attachedNode.params[0].value) {
                    results.push(attachedNode.params[0].value);
                }
                return results;
            }, []);

            const task: TaskModelDto = {
                uuid: node.id,
                key: node.key,
                type,
                general: {
                    displayName: node.displayName as SnLang[],
                    iconName: node.icon,
                    profil: node.custom.profile
                },
                properties: {
                    transitions: this.getTransitions(snView, node),
                    custom,
                    expressions,
                    services,
                }
            };
            return task;
        });
    }

    getTransitions(snView: SnView, node: SnNode): TaskTransitionModelDto[] {
        return _.reduce(node.flows, (results, flow: SnFlow) => {
            if (!flow.displayState?.hidden && flow.direction === 'out') {
                const toward = snView.nodes.find((n) => n.flows.find((f) => f.id === flow.toward) !== undefined);
                const tr: TaskTransitionModelDto = {
                    uuid: flow.id,
                    key: flow.key ? flow.key : UUID.UUID(),
                    displayName: flow.displayName as SnLang[],
                    task: toward ? toward.id : null,
                    data: this.getDataTransition(flow)
                };
                results.push(tr);
            }
            return results;
        }, []);
    }

    getDataTransition(flow: SnFlow): TaskTransitionDataModelDto[] {
        const placeToSave = flow.params.find((k) => k.key === 'placeToSave');

        return _.map(flow.params.filter((p) => p.key !== 'placeToSave'), (param: SnParam) => {

            let type = param.types;
            if (Array.isArray(param.types)) {
                if (param.types.length === 0) {
                    throw new Error(`param's type ${param.id} cannot be solved`);
                }
                type = param.types[0];
            }

            const data: TaskTransitionDataModelDto = {
                uuid: param.id,
                key: param.key,
                multiple: param.multiple ? true : false,
                type: type as string,
                placeToSave: placeToSave ? _.compact([
                    placeToSave.value
                ]) : []
            };
            return data;
        });
    }

    calculateCustom(node: SnNode) {
        const custom: any = {};
        if (node.custom?._debug) {
            custom._debug = node.custom._debug;
        }

        for (const param of node.params) {
            custom[param.key] = this.publishTransform._getParamValue(param);
        }
        for (const section of node.sections) {
            if (section.editable) {
                custom[section.key] = _.map(section.params, (param: SnParam) => {
                    const pair: PairDto = {
                        key: param.key,
                        value: this.publishTransform._getParamValue(param),
                    };
                    return pair;
                });
            } else {
                for (const param of section.params) {
                    custom[param.key] = this.publishTransform._getParamValue(param);
                }
            }
        }

        switch (node.type) {
            case 'SnFormNode': {
                custom.options = this._calculFormOptions(custom.options);
            }
                break;
        }

        return custom;
    }

    _calculFormOptions(pairs: PairDto[]) {
        if (!_.isArray(pairs)) {
            return pairs;
        }
        return _.reduce(pairs, (results, pair: PairDto) => {

            const split = _.compact(pair.key.split(/\.(.*)/));

            if (split.length <= 1) {
                return results;
            }

            // conditions
            const model = split[0];
            let conditions = [];
            let conditionMode = null;
            let conditionOperator = null;

            const value = _.isArray(pair.value) ? _.head(pair.value) : pair.value;
            if (value && value.condition && value.condition.list.length > 0) {
                const condition = value.condition;
                conditions = _.map(condition.list, (expr) => `${expr.model}.${expr.field}=${expr.value}`);
                conditionMode = value.condition.mode;
                conditionOperator = value.condition.operator;
                delete value.condition;
            }

            const property = {
                key: split[1],
                value,
                conditions,
                conditionMode,
                conditionOperator
            };

            const find = results.find((r) => r.model === model);
            if (find) {
                find.properties.push(property);
            } else {
                results.push({
                    model,
                    properties: [property]
                });
            }

            return results;
        }, []);
    }
}
