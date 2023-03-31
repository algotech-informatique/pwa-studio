import { Injectable } from '@angular/core';
import { DataExplorerModel } from '../data-explorer/data-explorer.model';
import {
    WorkflowInstanceDto, WorkflowDataDto, SmartModelDto, SmartObjectDto, SmartPropertyObjectDto,
    SmartPropertyModelDto, GenericListDto, WorkflowStackTaskDto, WorkflowOperationDto, WorkflowTaskActionDto,
    CrudDto, TaskModelDto, SnViewDto, SnNodeDto
} from '@algotech-ce/core';
import * as _ from 'lodash';
import { IconsService, SessionsService, SnModelsService, WatcherService } from '../../services';
import { SnDOMService, SnNode, SnTranslateService, SnView } from '../../modules/smart-nodes';
import { TranslateLangDtoService } from '@algotech-ce/angular';
import { InterpretorMetricsKeys, SoUtilsService, WorkflowMetricsService, WorkflowTaskService } from '@algotech-ce/business';
import { TranslateService } from '@ngx-translate/core';
import { ValidationReportDto } from '../../dtos';
import { ReportData } from '../../dtos/report-data.dto';
import { Observable, of, zip } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { WatcherDto } from '../../dtos/watchers.dto';
import moment from 'moment';

const MAX_ITEMS_ON_ARRAY = 25;
const COLOR_ACTION = '#cd5c5c';
const COLOR_INFO = '#2C6585';
const COLOR_WARNING = '#e17a40';

@Injectable()
export class TreeDebugService {

    constructor(
        private snDOMService: SnDOMService,
        private translate: TranslateService,
        private translateLang: TranslateLangDtoService,
        private sntranslate: SnTranslateService,
        private sessionsService: SessionsService,
        private snModelsService: SnModelsService,
        private iconsService: IconsService,
        private soUtils: SoUtilsService,
        private workflowMetrics: WorkflowMetricsService,
        private watcherService: WatcherService,
        private workflowTaskService: WorkflowTaskService) {
    }

    getModel(object: SmartObjectDto): SmartModelDto {
        if (!object) {
            return null;
        }
        return this.sessionsService.active.datas.read.smartModels.find((sm) => sm.key === object.modelKey);
    }

    browseSmartObject(instance: WorkflowInstanceDto, smartobject: SmartObjectDto, path: string): DataExplorerModel[] {
        if (!smartobject) {
            return [];
        }

        return _.reduce(smartobject.properties, (results, prop: SmartPropertyObjectDto) => {
            const propModel = this.getModel(smartobject).properties.find((p) => p.key === prop.key);
            if (propModel && prop.value !== undefined && prop.value !== null && prop.value !== '') {

                const data: WorkflowDataDto = {
                    key: prop.key,
                    type: propModel.keyType,
                    value: this.calculateGlist(prop.value, propModel.keyType, propModel),
                };

                const model = this.treatedData(instance, data, path);
                results.push(model);
            }
            return results;
        }, []);
    }

    getType(value: any) {
        if (this.soUtils.isSmartObject(value)) {
            return 'so:';
        }
        if (_.isBoolean(value)) {
            return 'boolean';
        }
        if (_.isNumber(value)) {
            return 'number';
        }
        if (_.isObject(value)) {
            return 'object';
        }
        if (moment(value, moment.ISO_8601, true).isValid()) {
            return 'date';
        } else if (moment(value, 'HH:mm:ss', true).isValid() || moment(value, 'HH:mm', true).isValid()
            || moment(value, 'LT', true).isValid()) {
            return 'time';
        }
        if (_.isString(value)) {
            return 'string';
        }
        return 'any';
    }

    browseObject(value: any, path: string): DataExplorerModel[] {
        const results: DataExplorerModel[] = [];
        if (!value || !_.isObject(value)) {
            return [];
        }
        for (const key in value) {
            if (value.hasOwnProperty(key)) {

                if (value[key] !== undefined && value[key] !== '') {
                    const data: WorkflowDataDto = {
                        key,
                        type: this.getType(value[key]),
                        value: value[key] === null ? 'null' : value[key],
                    };

                    results.push(this.tratedPrimitive(data, path));
                }
            }
        }

        return _.orderBy(results, 'key');
    }

    browseArray(instance: WorkflowInstanceDto, data: WorkflowDataDto, path: string): DataExplorerModel[] {
        if (data.value.length > MAX_ITEMS_ON_ARRAY) {
            return _.map(_.chunk(data.value, MAX_ITEMS_ON_ARRAY), (value, index: number) => {
                const start = index * MAX_ITEMS_ON_ARRAY;
                const end = start + value.length - 1;

                const chunkData = {
                    key: `[${start}...${end}]`,
                    type: data.type,
                    value
                };
                return this.treatedData(instance, chunkData, path);
            });
        }

        return _.map(data.value, (value, index: number) => {

            let type = data.type;
            if (type.startsWith('sys:') || type === 'object') {
                type = this.getType(value);
            }
            const arrayData = {
                key: index.toString(),
                type,
                value
            };

            return this.treatedData(instance, arrayData, path);
        });
    }

    treatedMetrics(instance: WorkflowInstanceDto) {
        return [
            this.treatedMetricsFamily('process', instance),
            this.treatedMetricsFamily('tasks', instance),
        ];
    }

    treatedWatchers(instance: WorkflowInstanceDto): Observable<DataExplorerModel[]> {
        const watchers = this.watcherService.getWatchersByViewId(instance.workflowModel.viewId);
        const view = this.snModelsService.getViewByWorkflow(instance.workflowModel, this.sessionsService.active.datas.write.snModels);

        if (!watchers) {
            return of([]);
        }

        const variables = watchers.watchers.filter((watcher) => !watcher.nodeId);
        const treeVariables$ = variables.length === 0 ? of([]) : zip(...variables
            .map(watcher => this.workflowTaskService.browsePath(instance, watcher.key).pipe(
                map((data) => this.treatedWatcher(instance, watcher, data, { error: false })),
                catchError(() => of(this.treatedWatcher(instance, watcher, null, { error: true })))
            ))
        );
        const treeGraph = _.flatten(
            Object.entries(
                _.groupBy(
                    watchers.watchers
                        .filter((watcher) => watcher.nodeId),
                    'nodeId')
            )
                .map(([key, group]) => {
                    const node = view.nodes.find((n) => n.id === key);
                    return (group as WatcherDto[]).map((watcher) => {
                        const data = instance.stackData.find((d) => d.key === watcher.key);
                        const caption = '';
                        return this.treatedWatcher(instance, watcher, data?.value, { error: !data, caption, node, view });
                    });
                }));

        return treeVariables$.pipe(
            map((treeVariables: DataExplorerModel[]) => ([
                ...treeVariables,
                ...treeGraph,
            ]))
        );
    }

    treatedWatcher(instance: WorkflowInstanceDto, watcher: WatcherDto, data: any,
        assign: { error?: boolean; caption?: string; view?: SnViewDto; node?: SnNodeDto }): DataExplorerModel {
        const type = watcher.type === 'any' ? this.getType(data) : watcher.type;
        const res = this.treatedData(instance, {
            key: watcher.key,
            type,
            value: assign?.error ? null : data,
        });
        res.data.node = assign?.node;
        res.data.view = assign?.view;
        res.error = assign?.error;
        if (assign?.caption != null) {
            res.caption = assign.caption;
        }
        return res;
    }

    pushCheckReport(report: ValidationReportDto, tree: DataExplorerModel[]) {

        let parent = _.find(tree, ['key', report.type]);
        if (!parent) {
            parent = {
                key: report.type,
                caption: (report.type === 'APP') ? this.translate.instant('EXPLORER-APPLICATIONS') :
                    (report.type === 'SF') ? this.translate.instant('EXPLORER-CONNECTORS') :
                        (report.type === 'WF') ? this.translate.instant('EXPLORER-WORKFLOWS') :
                            this.translate.instant('EXPLORER-MODELER'),
                icons: ['fa-solid fa-timeline'],
                hasChilds: true,
                childs: [],
                selectable: true,
                select: true,
                open: true,
            };
            tree.push(parent);
        }
        this._pushReport(report, parent);
        return _.clone(tree);
    }

    _pushReport(report: ValidationReportDto, parent: DataExplorerModel) {
        const element = _.find(parent.childs, ['key', report._id]);
        if (element) {
            element.childs = [...this._transform(report.errors, 'error'),
            ...this._transform(report.warnings, 'warning'),
            ...this._transform(report.infos, 'info')];
        } else {
            parent.childs.push({
                key: report._id,
                caption: report.caption,
                icons: ['fa-solid fa-timeline'],
                hasChilds: true,
                childs: [...this._transform(report.errors, 'error'),
                ...this._transform(report.warnings, 'warning'),
                ...this._transform(report.infos, 'info')],
                selectable: true,
                select: true,
                open: true,
            });
        }
    }
    _transform(data: ReportData[], type: 'error' | 'warning' | 'info'): DataExplorerModel[] {
        return _.map(data, (d: ReportData) => {
            let caption = d.element?.hasOwnProperty('displayName') ? this.sntranslate.transform(d.element['displayName'], false) : '';
            caption = caption ? caption : d.key ? d.key : '';
            return {
                key: d.element.id,
                caption: `${caption} ${caption ? ':' : ''} ${this.sntranslate.transform(d.type)}`,
                information: d.code,
                link: this.sntranslate.getLink(d.parent?.type),
                icons: [
                    type === 'error' ? 'fa-solid fa-bug' :
                        type === 'warning' ? 'fa-solid fa-triangle-exclamation' :
                            'fa-solid fa-circle-info'
                ],
                hasChilds: false,
                childs: [],
                selectable: true,
                select: true,
                open: true,
                zoom: d.parent,
                style: {
                    color: (type === 'error') ? COLOR_ACTION :
                        (type === 'warning') ? COLOR_WARNING :
                            COLOR_INFO,
                },
                data: {
                    node: d.parent,
                    view: d.view,
                    page: d.page,
                    widget: d.widget,
                    openInspector: d.openInspector
                }
            };
        });
    }

    treatedMetricsFamily(key: 'process' | 'tasks', instance: WorkflowInstanceDto) {
        const metrics = this.workflowMetrics.getMetrics(instance.context.metrics, key);
        const model: DataExplorerModel = {
            icons: ['fa-solid fa-timeline'],
            key,
            caption: `${this.translate.instant(`TREE-DEBUG-METRICS-${key.toUpperCase()}`)} (${metrics.time}ms)`,
            hasChilds: true,
            childs: this.treatedMetricsOne(metrics, instance),
            open: true
        };

        return model;
    }

    treatedMetricsGetIcon(key: string) {
        switch (key) {
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorDBRequest]:
                return 'fa-solid fa-database';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorCustomResolver]:
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorExecute]:
                return 'fa-solid fa-f';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorOther]:
                return 'fa-solid fa-question';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorOperations]:
                return 'fa-solid fa-spinner';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorSave]:
                return 'fa-solid fa-long-arrow-alt-down';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorMessaging]:
                return 'fa-solid fa-comment-alt';
            case InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorDownload]:
                return 'fa-solid fa-cube';
            default:
                return 'fa-solid fa-gears';
        }
    }

    treatedMetricsOne(metrics, instance: WorkflowInstanceDto) {
        return metrics.items.map((item) => {

            const percent = Math.round((item.time / metrics.time) * 100);
            const task: TaskModelDto = _.flatMap(instance.workflowModel.steps, 'tasks')
                .find((t: TaskModelDto) => t.type === item.key as string);

            const caption = task ?
                `${this.translate.instant('TREE-DEBUG-METRICS-ITEM-TASK')}: ${this.translateLang.transform(task.general.displayName)}` :
                this.translate.instant(`TREE-DEBUG-METRICS-ITEM-${(item.key as string).toUpperCase()}`);

            const model: DataExplorerModel = {
                icons: task ? ['fa-solid fa-diagram-next', task.general.iconName] :
                    ['fa-solid fa-gears', this.treatedMetricsGetIcon(item.key as string)],
                key: item.key as string,
                caption: `${caption} (${item.time}ms)`,
                hasChilds: false,
                childs: [],
                information: item.key === InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorDBRequest] ||
                    item.key === InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorSave] ||
                    item.key === InterpretorMetricsKeys[InterpretorMetricsKeys.InterpretorMessaging] ?
                    this.translate.instant('TREE-DEBUG-METRICS-ITEM-INFORMATION') : null,
                value: `
                    \n${item.percent}
                    \n${this.translate.instant('TREE-DEBUG-METRICS-ITEM-EXECUTION', {
                    execution: item.execution,
                })}
                    \n\n${this.translate.instant('TREE-DEBUG-METRICS-ITEM-TIME-UNIT', {
                    time: Math.round((item.time / item.execution) * 100) / 100
                })}
                    \n${this.translate.instant('TREE-DEBUG-METRICS-ITEM-TIME-TOTAL', {
                    time: item.time
                })}`,
                style: {
                    color: this.perc2color(percent),
                }
            };

            return model;
        });
    }

    treatedTransactions(instance: WorkflowInstanceDto) {
        const operations = _.reduce(instance.stackTasks, (results, task: WorkflowStackTaskDto) => {
            results.push(...task.operations.filter((op) => op.saveOnApi));
            return results;
        }, []);
        return _.map(operations, (operation: WorkflowOperationDto, index: number) => {

            switch (operation.type) {
                case 'action': {
                    return this.treatedAction(operation.value as WorkflowTaskActionDto, index.toString());
                }
                case 'crud': {
                    return this.treatedCrud(instance, operation.value as CrudDto, index.toString());
                }
            }
        });
    }

    treatedAction(action: WorkflowTaskActionDto, key: string) {
        const model: DataExplorerModel = {
            icons: ['fa-solid fa-atom'],
            key,
            caption: action.actionKey,
            hasChilds: true,
            data: {
                key,
                type: 'object',
                value: action.value,
            },
            childs: [],
            style: {
                color: COLOR_ACTION,
            }
        };
        return model;
    }

    treatedCrud(instance: WorkflowInstanceDto, crud: CrudDto, key: string) {

        const smartobject = crud.op === 'add' ? crud.value : instance.smartobjects.find((so) => so.uuid === crud.key);
        const smartmodel = smartobject ? this.getModel(smartobject) : null;

        const model: DataExplorerModel = {
            icons: ['fa-solid fa-cube', crud.op === 'add' ? 'fa-solid fa-plus' : 'fa-solid fa-square-poll-horizontal'],
            key,
            caption: crud.op,
            value: smartmodel ? this.translateLang.transform(smartmodel.displayName) : null,
            hasChilds: true,
            data: {
                key,
                type: 'object',
                value: {
                    smartobject: crud.key,
                    value: crud.value
                },
            },
            childs: [],
        };
        return model;
    }

    treatedData(instance: WorkflowInstanceDto, data: WorkflowDataDto, path?: string) {
        if (this.soUtils.typeIsSmartObject(data.type)) {
            return this.treatedSmartObject(instance, data, path);
        } else {
            return this.tratedPrimitive(data, path);
        }
    }

    treatedSmartObject(instance: WorkflowInstanceDto, data: WorkflowDataDto, path: string) {
        const icon = this.iconsService.getIconByType(data.type);
        const isArray = _.isArray(data.value);
        let smartmodel: SmartModelDto = null;

        if (!isArray) {
            const smartobject = _.isString(data.value) ? instance.smartobjects.find((so) => so.uuid === data.value) : data.value;
            smartmodel = this.getModel(smartobject);
        }

        const model: DataExplorerModel = {
            icons: _.compact([
                icon ? icon.value : null,
                isArray ? 'fa-solid fa-layer-group' : null
            ]),
            key: data.key,
            caption: data.key,
            value: smartmodel ? this.translateLang.transform(smartmodel.displayName) : null,
            hasChilds: true,
            childs: [],
            data,
            smartobjects: instance.smartobjects,
            path: path ? `${path}.${data.key}` : data.key
        };
        return model;
    }

    tratedPrimitive(data: WorkflowDataDto, path: string) {
        const icon = this.iconsService.getIconByType(data.type);
        const isArray = _.isArray(data.value);
        const isObject = _.isObject(data.value);

        const model: DataExplorerModel = {
            icons: _.compact([
                icon ? icon.value : null,
                isArray ? 'fa-solid fa-layer-group' : null
            ]),
            key: data.key,
            caption: data.key,
            value: !isArray && !isObject ? this.calculateValue(data) : null,
            hasChilds: (isArray && data.value.length > 0) || isObject,
            childs: [],
            style: {
                color: data.type === 'object' ? null : this.snDOMService.getVarName('--SN-NODE-PARAM-COLOR',
                    data.type.toUpperCase().replace(':', ''), true)
            },
            data,
            path: path ? `${path}.${data.key}` : data.key
        };
        return model;
    }

    expand(instance: WorkflowInstanceDto, node: DataExplorerModel) {
        if (node.hasChilds && node.data) {
            const isArray = _.isArray(node.data.value);

            if (this.soUtils.typeIsSmartObject(node.data.type)) {
                let smartobject: SmartObjectDto = null;
                if (!isArray) {
                    smartobject = _.isString(node.data.value) ?
                        instance.smartobjects.find((so) => so.uuid === node.data.value) : node.data.value;
                }
                node.childs = isArray ? this.browseArray(instance, node.data, node.path) :
                    this.browseSmartObject(instance, smartobject, node.path);

                // data.EQUIPMENTS.5
            } else {
                node.childs = isArray ? this.browseArray(instance, node.data, node.path) :
                    (_.isObject(node.data.value) ? this.browseObject(node.data.value, node.path) : []);
            }
        }
    }

    calculateValue(data: WorkflowDataDto) {
        switch (data.type) {
            case 'boolean':
                return data.value ? '✔' : '✕';
            case 'date': return moment(data.value).format('L');
            case 'time': {
                if (moment(data.value, 'HH:mm:ss').isValid()) {
                    return moment(data.value, 'HH:mm:ss').format('LT');
                } else if (moment(data.value, 'HH:mm').isValid()) {
                    return moment(data.value, 'HH:mm').format('LT');
                } else {
                    return data.value;
                }
            }
            case 'datetime': return moment(data.value).format('L LT');
            default:
                return data.value;
        }
    }

    calculateGlist(value: any, type: string, propModel: SmartPropertyModelDto) {
        switch (type) {
            case 'string': {
                if (propModel && propModel.items && propModel.items.length > 0) {
                    const glist = this.sessionsService.active.datas.read.glists.find((g: GenericListDto) => g.key === propModel.items);
                    if (glist) {
                        const glistValue = glist.values.find((g) => g.key === value);
                        if (glistValue) {
                            return this.translateLang.transform(glistValue.value);
                        }
                    }
                }
                return value;
            }
            default:
                return value;
        }
    }

    restore(instance: WorkflowInstanceDto, tree: DataExplorerModel[], preTree: DataExplorerModel[]) {
        if (!preTree) {
            return tree;
        }
        for (const node of preTree) {
            if (node.open) {
                const find = tree.find((n) => n.key === node.key);
                if (find) {
                    find.open = true;
                    this.expand(instance, find);
                    this.restore(instance, find.childs, node.childs);
                }
            }
        }

        return tree;
    }

    private perc2color(perc) {
        if (perc > 80) {
            return '#b71c1c';
        }
        if (perc > 50) {
            return '#f57f17';
        }
        if (perc > 30) {
            return '#fbc02d';
        }
        if (perc > 10) {
            return '#43a047';
        }
        return '#9ccc65';
    }
}
