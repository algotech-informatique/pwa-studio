import { Injectable } from '@angular/core';
import { SnView, SnNode, SnParam, SnItem, SnSection } from '../../../../smart-nodes/models';
import { SnUtilsService } from '../../../../smart-nodes/services';
import * as _ from 'lodash';
import {
    SmartModelDto, SmartPropertyModelDto, typesSys, TagListDto, WorkflowProfilModelDto,
    AgendaTypeDto, SnModelDto, EnvironmentDirectoryDto, SnViewDto, PlanContainersSettingsDto,
    PlanLayersSettingsDto, SnAppDto, GenericListDto, GroupDto
} from '@algotech-ce/core';
import { SessionsService, SmartModelsService, IconsService, SnModelsService } from '../../../../../services';
import { TranslateLangDtoService } from '@algotech-ce/angular';
import { TypeSchema, SnVersionDto } from '@algotech-ce/core';
import { TranslateService } from '@ngx-translate/core';
import { PageUtilsService } from '../../../../app/services';

@Injectable()
export class SnATNodeUtilsService {

    constructor(
        private sessionsService: SessionsService,
        private translate: TranslateService,
        private translateLangDtoService: TranslateLangDtoService,
        private snUtils: SnUtilsService,
        private iconsService: IconsService,
        private snModelsService: SnModelsService,
        private pageUtils: PageUtilsService,
        private smartModelsService: SmartModelsService,
    ) { }

    getIcon(icon: string | string[]): string {
        const findIcon = this.iconsService.getIconByType(icon);
        return findIcon ? findIcon.value : '';
    }

    getOutParam(node: SnNode): { params: SnParam[]; param: SnParam } {
        const flow = node.flows.find((f) => f.direction === 'out');
        if (flow && flow.params.length > 0) {
            return { params: flow.params, param: flow.params[0] };
        }

        if (node.params.length > 0) {
            const findOutParam = node.params.find((p) => p.direction === 'out');
            if (findOutParam) {
                return { params: node.params, param: findOutParam };
            }
        }

        return null;
    }

    getKeyEditParams(snView: SnView, node: SnNode): SnParam[] {
        return _.filter(this.snUtils.getParams(snView, node), (param: SnParam) =>
            param.display === 'key-edit'
        );
    }

    findParamByKey(node: SnNode, key: string): SnParam {
        return this.snUtils.getParams(null, node).find((p) => p.key === key);
    }

    findParamBySection(node: SnNode, section: string, key: string): SnParam {
        const snSection = this.findSection(node, section);
        if (!snSection) {
            return null;
        }
        return _.find(snSection.params, (param: SnParam) => param.key === key);
    }

    findSection(node: SnNode, section: string): SnSection {
        return _.find(node.sections, (sec: SnSection) => sec.key === section);
    }

    findTypes(snView: SnView, node: SnNode, key: string): string | string[] {
        const param = this.findParamByKey(node, key);
        if (!param) {
            return null;
        }

        const connectedParam = this.snUtils.findConnectedParam(snView, param);

        if (!connectedParam) {
            return null;
        }

        return connectedParam.types;
    }

    findType(snView: SnView, node: SnNode, key: string): string {
        const types = this.findTypes(snView, node, key);
        return _.isArray(types) ? null : types as string;
    }

    findValue(node: SnNode, key: string) {
        const param = this.findParamByKey(node, key);
        if (!param) {
            return null;
        }
        return param.value;
    }

    getProfiles(snView: SnView): SnItem[] {
        if (!snView.options || !snView.options.profiles) {
            return [];
        }

        return _.map(snView.options.profiles, (profile: WorkflowProfilModelDto) =>
            ({
                key: profile.uuid,
                value: profile.name
            })
        );
    }

    getProfil(snView: SnView, profilUuid: string): WorkflowProfilModelDto {
        if (!snView.options || !snView.options.profiles) {
            return null;
        } else {
            return _.find(snView.options.profiles, (prof: WorkflowProfilModelDto) => prof.uuid === profilUuid);
        }
    }

    getSmartModels(smartModels: SmartModelDto[] = this.sessionsService.active.datas.read.smartModels): SnItem[] {
        const smartModelsList: SnItem[] = _
            .chain(smartModels)
            .map((smartModel: SmartModelDto) => {
                const value: string = this.translateLangDtoService.transform(smartModel.displayName);
                return {
                    key: smartModel.key,
                    value,
                    valueToFilter: value.toUpperCase(),
                };
            })
            .sortBy('valueToFilter')
            .map((data: { key: string; value: string; valueToFilter: string }) =>
                ({
                    key: data.key,
                    value: data.value,
                })
            )
            .value();

        return smartModelsList;
    }

    getSmartModelsByModel(sModel: string, composedModel: boolean): SnItem[] {
        if (!sModel) {
            return [];
        }
        const model: string = sModel.replace('so:', '');
        const snModel: SmartModelDto = _.find(this.sessionsService.active.datas.read.smartModels, (sm: SmartModelDto) => sm.key === model);

        if (!snModel) {
            return [];
        }

        if (!composedModel) {
            return this.getSmartModels([snModel]);
        }

        return this.getSmartModels(
            this.smartModelsService.getCompositionsModel(snModel, this.sessionsService.active.datas.read.smartModels)
        );
    }

    getLayers(): SnItem[] {
        const layers: PlanLayersSettingsDto[] =
            _.reduce(this.sessionsService.active.datas.read.settings.plan.containers, (result, container: PlanContainersSettingsDto) => {
                result.push(...container.layers);
                return result;
            }, []);
        return _.uniqBy(_.map(layers, (lay: PlanLayersSettingsDto) =>
            ({ key: lay.key, value: this.translateLangDtoService.transform(lay.displayName) })
        ));
    }

    getSmartModelsBySkills(skill: string): SnItem[] {
        if (!skill) {
            return [];
        }
        return this.getSmartModels(this.smartModelsService.getModelsBySkill(skill, this.sessionsService.active.datas.read.smartModels));
    }

    getSmartflows(currentView?: string): SnItem[] {
        return _.reduce(this.sessionsService.active.datas.write.environment.smartflows,
            (results, smartflowsDir: EnvironmentDirectoryDto) => {
                results.push(...this.getSmartFlowsDirectoryRecursive(smartflowsDir, '', currentView));
                return results;
            }, []);
    }

    getSmartFlowsDirectoryRecursive(smartflowsDir: EnvironmentDirectoryDto, dirName: string, currentView?: string): SnItem[] {
        const snItem: SnItem[] = [];
        dirName = (dirName === '') ? smartflowsDir.name : `${dirName}/${smartflowsDir.name}`;
        snItem.push(...this.getSmartFlowsDirectory(smartflowsDir, dirName, currentView));
        if (smartflowsDir.subDirectories.length !== 0) {
            snItem.push(..._.reduce(smartflowsDir.subDirectories, (result, subDir) => {
                const items = this.getSmartFlowsDirectoryRecursive(subDir, dirName, currentView);
                if (items.length !== 0) {
                    result.push(...items);
                }
                return result;
            }, []));
        }
        return snItem;
    }

    getSmartFlowsDirectory(smartflowsDir: EnvironmentDirectoryDto, dirName: string, currentView?: string): SnItem[] {
        return _.map(_.filter(this.sessionsService.active.datas.write.snModels, (snModel: SnModelDto) =>
            snModel.dirUuid === smartflowsDir.uuid && snModel.publishedVersion &&
                !_.some(snModel.versions, (version: SnVersionDto) => version.view?.id === currentView)
        ), (snModel: SnModelDto) => {
            const item: SnItem = {
                key: snModel.key,
                value: `${dirName}/${this.translateLangDtoService.transform(snModel.displayName)}`,
            };

            const view = this.snModelsService.getPublishedView(snModel) as SnView;
            if (!view) {
                return item;
            }
            if (view.options && view.options.variables) {
                if (view.options.variables.some((v) => v.key === 'filter')) {
                    item.icon = 'fa-solid fa-filter';
                }
                if (view.options.variables.some((v) => v.key === 'page' || v.key === 'limit')) {
                    item.icon = 'fa-solid fa-list-ol';
                }
                if (view.options.variables.some((v) => v.key === 'search-parameters')) {
                    item.icon = 'fa-brands fa-searchengin';
                }
            }
            if (currentView) {
                item.disabled = this.checkHasCircularDependencies(view, [view.id], 'SnConnectorNode');
            }
            return item;
        });
    }

    getApps() {
        return _.map(_.filter(this.sessionsService.active.datas.write.snModels, (snModel: SnModelDto) =>
            snModel.type === 'app' && (this.snModelsService.getPublishedView(snModel))
        ), (snModel: SnModelDto) => {
            const app = this.snModelsService.getPublishedView(snModel) as SnAppDto;
            const item = {
                key: snModel.key,
                value: this.translateLangDtoService.transform(snModel.displayName),
                icon: app?.icon,
                disabled: !this.pageUtils.getWidgets(app).some((w) => w.typeKey === 'board'),
            };
            return item;
        });
    }

    getZone(appKey: string) {
        if (!appKey) {
            return [];
        }
        const snModel = this.sessionsService.active.datas.write.snModels.find((_snModel: SnModelDto) =>
            _snModel.type === 'app' && _snModel.key === appKey);

        if (!snModel) {
            return [];
        }
        const app = this.snModelsService.getPublishedView(snModel) as SnAppDto;
        if (!app) {
            return [];
        }
        return this.pageUtils.getWidgets(app).filter((w) => w.typeKey === 'zone').map((w) => {
            const item = {
                key: w.custom?.key,
                value: w.custom?.key,
            };
            return item;
        });
    }

    getWorkflows(currentView: string): SnItem[] {
        let workflows = _.map(_.filter(this.sessionsService.active.datas.write.snModels, (snModel: SnModelDto) =>
            snModel.type === 'workflow' && (this.snModelsService.getPublishedView(snModel)) &&
                !_.some(snModel.versions, (version: SnVersionDto) => version.view?.id === currentView)
        ), (snModel: SnModelDto) => {
            const view = this.snModelsService.getPublishedView(snModel) as SnView;
            const item = {
                key: snModel.key,
                value: this.translateLangDtoService.transform(snModel.displayName),
                icon: view?.options?.iconName,
                disabled: !this.checkSubView(view, 'SnSubWorkflowNode'),
                subWorkflow: view?.options?.subWorkflow,
            };
            return item;
        });
        workflows = _.sortBy(workflows, ['subWorkflow', 'value']);
        return workflows;
    }

    checkSubView(snView: SnView, type: string): boolean {
        return this.checkViewLaunchedFinished(snView) && !this.checkHasCircularDependencies(snView, [snView.id], type);
    }

    checkHasCircularDependencies(snView: SnView, stack: string[], type: string): boolean {
        const paramKey = type === 'SnSubWorkflowNode' ? 'workFlow' : 'smartFlow';
        for (const subWorkflow of snView.nodes.filter((node) => node.type === type)) {
            // find view
            const params = this.snUtils.getParams(snView, subWorkflow);
            const workflowKey: SnParam = params.find((p) => p.key === paramKey);
            const workflowModel = this.sessionsService.active.datas.write.snModels.find((snModel) =>
                snModel.key === workflowKey?.value
            );

            // unknown
            if (!workflowModel) {
                return true;
            }
            const subView = this.snModelsService.getPublishedView(workflowModel) as SnView;
            if (!subView || stack.includes(subView.id)) {
                return true;
            }
            if (this.checkHasCircularDependencies(_.cloneDeep(subView), [...stack, subView.id], type)) {
                return true;
            }
        }
        return false;
    }

    getSnModel(node: SnNode, key: string, type: 'workflow' | 'smartflow' = 'workflow'): SnModelDto {
        return this.sessionsService.active.datas.write.snModels.find((model) => model.key === this.findValue(node, key)
            && model.type === type);
    }

    getSnReports() {
        return _.reduce(this.sessionsService.active.datas.write.snModels, (results, model: SnModelDto) => {
            if (model.type === 'report') {
                const snView = this.snModelsService.getActiveView(model) as SnViewDto;
                if (snView && snView.options && snView.options.enabled) {
                    results.push({
                        key: model.key,
                        value: model.key
                    });
                }
            }
            return results;
        }, []);
    }

    getPrimitiveTypes() {
        return [
            { key: 'string', value: 'string' },
            { key: 'boolean', value: 'boolean' },
            { key: 'datetime', value: 'datetime' },
            { key: 'date', value: 'date' },
            { key: 'time', value: 'time' },
            { key: 'number', value: 'number' },
            { key: 'object', value: 'object' },
        ];
    }

    getRepetitions() {
        return [
            { key: 'none', value: this.translate.instant('TASK-MODEL-GUI.TASK.CREATE-SCHEDULE.NONE') },
            { key: 'daily', value: this.translate.instant('TASK-MODEL-GUI.TASK.CREATE-SCHEDULE.DAILY') },
            { key: 'weekly', value: this.translate.instant('TASK-MODEL-GUI.TASK.CREATE-SCHEDULE.WEEKLY') },
            { key: 'monthly', value: this.translate.instant('TASK-MODEL-GUI.TASK.CREATE-SCHEDULE.MONTHLY') },
            { key: 'yearly', value: this.translate.instant('TASK-MODEL-GUI.TASK.CREATE-SCHEDULE.YEARLY') }
        ];
    }

    getAlerts(ignoreKey?: string): SnItem[] {
        return [
            { key: 'success', value: this.translate.instant('TASK-MODEL-GUI.TASK.ALERT.SUCCESS') },
            { key: 'information', value: this.translate.instant('TASK-MODEL-GUI.TASK.ALERT.INFORMATION') },
            { key: 'warning', value: this.translate.instant('TASK-MODEL-GUI.TASK.ALERT.WARNING') },
            { key: 'error', value: this.translate.instant('TASK-MODEL-GUI.TASK.ALERT.ERROR') },
        ].filter((item) => item.key !== ignoreKey);
    }

    getConditions(): SnItem[] {
        return [
            { key: 'EQUALS', value: this.translate.instant('TASK-MODEL-GUI.TASK.CONDITION.EQUALS') },
            { key: 'CONTAINS', value: this.translate.instant('TASK-MODEL-GUI.TASK.CONDITION.CONTAINS') },
            { key: 'UPPER', value: this.translate.instant('TASK-MODEL-GUI.TASK.CONDITION.UPPER') },
            { key: 'LOWER', value: this.translate.instant('TASK-MODEL-GUI.TASK.CONDITION.LOWER') },
        ];
    }

    getDisplayModel(): SnItem[] {
        return [
            { key: 'toast', value: this.translate.instant('TASK-MODEL-GUI.TASK.DISPLAYMODE.TOAST') },
            { key: 'popup', value: this.translate.instant('TASK-MODEL-GUI.TASK.DISPLAYMODE.POPUP') },
            { key: 'nothing', value: this.translate.instant('TASK-MODEL-GUI.TASK.DISPLAYMODE.NOTHING') },
        ];
    }

    getOutputTrigger(): SnItem[] {
        return [
            { key: 'end-wf', value: this.translate.instant('TASK-MODEL-GUI.TASK.OUTPUTTRIGGER.ENDWF') },
            { key: 'end-op', value: this.translate.instant('TASK-MODEL-GUI.TASK.OUTPUTTRIGGER.ENDOP') },
        ];
    }

    getPropertiesFromSys(type: string): SnItem[] {
        const model = _.find(typesSys, { type });
        if (model && model.schema) {
            return Object.entries((model as TypeSchema).schema).map(
                ([key, value]) => (
                    {
                        key,
                        value: key,
                        custom: {
                            type: (Array.isArray(value) && value.length > 0 ? value[0] : value) instanceof Object ? 'object' : value,
                            multiple: Array.isArray(value),
                        }
                    }
                ));
        }
        return [];
    }

    getProperties(smartModel: string): SnItem[] {
        const model = this.sessionsService.active.datas.read.smartModels.find((sm) => sm.key.toUpperCase() === smartModel.toUpperCase());
        if (!model) {
            return [];
        }

        return _.map(model.properties, (prop: SmartPropertyModelDto) =>
            ({
                key: prop.key,
                value: this.translateLangDtoService.transform(prop.displayName),
                custom: {
                    type: prop.keyType,
                    multiple: prop.multiple,
                }
            })
        );
    }

    getPreviousNode(snView: SnView, node: SnNode) {
        const enterFlow = node.flows.find((f) => f.direction === 'in');
        if (!enterFlow) {
            return null;
        }

        return snView.nodes.find((n) => n.flows.find((f) => f.toward === enterFlow.id) !== undefined);
    }

    getSkills() {
        const list = _.reduce(typesSys, (results, type: TypeSchema) => {
            if (type.skills) {
                results.push({
                    key: type.skills,
                    value: type.name ? this.translate.instant(type.name) : type.skills,
                });
            }
            return results;
        }, []);
        return list;
    }

    getScheduleTypeKeys() {
        return _.map(this.sessionsService.active.datas.read.settings.agenda, (agenda: AgendaTypeDto) =>
            ({
                key: agenda.key,
                value: this.translateLangDtoService.transform(agenda.displayName)
            })
        );
    }

    getScheduleStatus(scheduleKey: string) {
        const findAgenda = this.sessionsService.active.datas.read.settings.agenda.find((a) => a.key === scheduleKey);
        if (!findAgenda) {
            return [];
        }

        return this.getGlobalList(findAgenda.statutGroupList);
    }

    getGenericList() {
        return _.map(this.sessionsService.active.datas.read.glists, (glist: GenericListDto) =>
            ({
                key: glist.key,
                value: this.translateLangDtoService.transform(glist.displayName),
            }),
        );
    }

    getSecurityGroupList() {
        return _.map(this.sessionsService.active.datas.read.groups, (group: GroupDto) =>
            ({
                key: group.key,
                value: group.name,
            }),
        );
    }

    getGlobalList(groupList: string) {
        const gList = this.sessionsService.active.datas.read.glists.find((g) => g.key === groupList);
        if (gList) {
            return _.map(gList.values, (listValue) => {
                const data: SnItem = {
                    key: listValue.key,
                    value: this.translateLangDtoService.transform(listValue.value)
                };
                return data;
            });
        }
    }

    getModelTags(outType: string, options: string[]) {
        let tagsDisplay: SnItem[];

        // get list of tags
        const tags: TagListDto[] = _.filter(this.sessionsService.active.datas.read.tags, (tagList: TagListDto) => {
            const isApplyableDocument: boolean = _.includes(options, 'document');
            const isApplyablePhoto: boolean = _.includes(options, 'photo');
            if ((isApplyableDocument && isApplyablePhoto)) {
                if (!tagList.applyToDocuments && !tagList.applyToImages) {
                    return false;
                }
            } else {
                if (isApplyableDocument && !tagList.applyToDocuments) {
                    return false;
                } else if ((isApplyablePhoto && !tagList.applyToImages)) {
                    return false;
                }
            }
            if (!_.startsWith(outType, 'sk:') && !_.startsWith(outType, 'so:')) {
                const isApplyableModel: string = _.find(tagList.modelKeyApplication, (modelKey: string) => modelKey === outType);
                if (!isApplyableModel) { return false; }
            }
            return true;
        });

        tagsDisplay = _.map(tags, (tagList: TagListDto) =>
            ({
                key: tagList.key,
                value: this.translateLangDtoService.transform(tagList.displayName),
            })
        );

        const modelKeysArray: string[][] = _.map(tags, (tagList: TagListDto) => tagList.modelKeyApplication);

        if (!_.startsWith(outType, 'sk:')) {
            return tagsDisplay;
        }

        // sk:
        const modelKeys = _.uniq(_.flatten(modelKeysArray));
        const smartModels: SmartModelDto[] = _.compact(_.map(modelKeys, (modelKey: string) =>
            this.sessionsService.active.datas.read.smartModels.find((sm) => sm.key === modelKey)
        ));

        if (smartModels.length === 0) {
            return tagsDisplay;
        }

        const skill: string = outType.substr(3);
        const modelsWithSkill: string[] = _.reduce(smartModels, (res: string[], smartModel: SmartModelDto) => {
            if (smartModel.skills[skill]) { res.push(smartModel.key); }
            return res;
        }, []);

        tagsDisplay = _.reduce(tags, (res: SnItem[], tag: TagListDto) => {
            if (_.intersection(tag.modelKeyApplication, modelsWithSkill).length > 0) {
                res.push({
                    key: tag.key,
                    value: this.translateLangDtoService.transform(tag.displayName),
                });
            }
            return res;
        }, []);

        return tagsDisplay;
    }

    getSmartModel(key: string): SmartModelDto {
        return this.smartModelsService.getModelByKey(key, this.sessionsService.active.datas.read.smartModels);
    }

    getSmartModelsFromPath(smartModel: SmartModelDto, split: string[]) {
        if (split.length === 0) {
            return [];
        }
        const propKey = split[0];
        split.shift();
        const findProp = smartModel.properties.find((prop) => prop.key === propKey);
        if (!findProp) {
            return [];
        }
        const model = this.sessionsService.active.datas.read.smartModels.find((sm) => `so:${sm.key}` === findProp.keyType);
        if (!model) {
            return [];
        }
        return [model, ...this.getSmartModelsFromPath(model, split)];
    }

    private checkViewLaunchedFinished(snView: SnView): boolean {
        const launchNode = snView.nodes.find((n) => n.type === 'SnLauncherNode');
        const finishNode = snView.nodes.find((n) => n.type === 'SnFinisherNode' && n.params.find((p) => p.key === 'save')?.value === true);
        return !!(launchNode && finishNode);
    }

}
