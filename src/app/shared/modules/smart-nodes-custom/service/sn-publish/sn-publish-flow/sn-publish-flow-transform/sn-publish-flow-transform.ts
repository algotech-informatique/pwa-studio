import { Injectable } from '@angular/core';
import { SnView, SnNode, SnLang, SnFlow, SnParam } from '../../../../../smart-nodes/models';
import {
    PairDto, WorkflowProfilModelDto, ServiceModelDto,
    ServiceParamModelDto
} from '@algotech/core';
import { KeyFormaterService } from '@algotech/angular';
import { SnUtilsService, SnTranslateService } from '../../../../../smart-nodes/services';
import * as _ from 'lodash';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment'; 

@Injectable()
export class SnPublishFlowTransformService {

    constructor(
        private keyFormaterService: KeyFormaterService,
        private snTranslate: SnTranslateService,
        private translate: TranslateService,
        private snUtils: SnUtilsService,
    ) { }

    proceedView(snView: SnView, profil: WorkflowProfilModelDto): SnView {
        const proceed: SnView = _.cloneDeep(snView);

        for (const node of proceed.nodes) {
            node.key = this.keyFormaterService.format(this.snTranslate.transform(node.displayName));
        }

        this.proceedProfiles(proceed, profil);
        this.proceedViewDate(proceed);
        this.proceedViewDynamicOutParameters(proceed);
        this.proceedViewSectionOutParameters(proceed);
        this.proceedViewExtensionsParameters(proceed);

        this.proceedViewMagnet(proceed);
        this.proceedViewGeo(proceed);
        this.proceedViewExpression(proceed);
        this.proceedViewArray(proceed);
        this.proceedViewGenericList(proceed);
        this.proceedViewArrayExpression(proceed);
        this.proceedViewObjectExpression(proceed);
        this.proceedViewJsonNode(proceed);
        this.proceedViewFilter(proceed);
        this.proceedViewFormDBConnector(proceed);
        this.proceedViewService(proceed);
        this.proceedViewInParameters(proceed);
        this.proceedViewLoop(proceed);
        this.proceedViewQueryDB(proceed);

        // must latest
        this.proceedViewFormDataSource(proceed, snView);
        return proceed;
    }

    proceedProfiles(snView: SnView, profil: WorkflowProfilModelDto) {
        if (!profil) {
            return;
        }
        for (const node of snView.nodes) {
            if (node.custom && !node.custom.profile) {
                node.custom.profile = profil.uuid;
            }
        }
    }

    proceedViewDate(snView: SnView) {
        const params = this.snUtils.getParams(snView);
        for (const param of params) {
            if ((param.types === 'date' || param.types === 'datetime') && _.isDate(param.value)) {
                param.value = moment(param.value).format();
            }
        }
    }

    proceedViewDynamicOutParameters(snView: SnView) {
        let index = 0;
        for (const node of snView.nodes) {
            for (const flow of node.flows) {
                if (flow.direction === 'out') {
                    for (const param of flow.params) {
                        index++;
                        if (!flow.paramsEditable || !param.key) {
                            // auto generate (unique key)
                            param.key = `${node.key}_${flow.key}_${param.key ? param.key : ''}_${index}`;
                        }
                    }
                }
            }
        }
    }

    proceedViewExtensionsParameters(snView: SnView) {
        for (const node of snView.nodes) {
            const outParam = this._getOutParam(node);
            if ((this.isExpression(node) || this.isService(node)) && outParam) {
                // expression
                outParam.key = `${outParam.id}`;
            }
        }
    }

    proceedViewSectionOutParameters(snView: SnView) {
        const treatedNodes: SnNode[] = [];
        for (const node of snView.nodes) {
            for (const section of node.sections) {
                if (section.editable) {
                    for (const param of section.params) {
                        if (param.direction === 'out') {
                            // path
                            param.key = `${this._getPath(snView, node, param, treatedNodes)}`;
                        }
                    }
                }
            }
            treatedNodes.push(node);
        }
    }

    proceedViewInParameters(snView: SnView) {
        const elements = this.snUtils.getParamsWithNode(snView);
        for (const element of elements) {
            if (element.param.direction === 'in') {
                const findParam = elements.find((elt) => elt.param.id === element.param.toward);
                if (findParam) {

                    switch (findParam.node.type) {
                        case 'SnDBConnectorNode':
                        case 'SnGeoNode':
                        case 'SnMagnetNode':
                        case 'SnResetNode':
                        case 'SnArrayNode':
                        case 'SnFilterNode':
                        case 'SnJsonNode':
                            element.param.value = findParam.param.value;
                            break;
                        default:
                            element.param.value = `{{${findParam.param.key}}}`;
                            break;
                    }
                }
            }
        }
    }

    proceedViewArray(snView: SnView) {
        this.proceedViewInParameters(snView);
        for (const node of snView.nodes) {
            const outParam = this._getOutParam(node);
            if (this._isArray(node) && outParam) {
                if (!outParam.value) {
                    outParam.value = this._getArrayValue(snView, node);
                }
            }
        }
    }

    proceedViewArrayExpression(snView: SnView) {
        this.proceedViewInParameters(snView);

        const expressions: SnNode[] = _.filter(snView.nodes, { type: 'SnArrayFunctionNode' });
        for (const expr of expressions) {
            const outParam = expr.params[0];
            const section = _.find(expr.sections, { key: 'parameters' });
            const f = _.find(expr.params, { key: 'function' });
            const array = _.find(expr.params, { key: 'array' });
            if (!section || !f || !f.value || !array || !array.value) {
                continue;
            }

            const parameters = section.params;

            // Array Function
            outParam.value = {
                type: 'ArrayFunction',
                function: f.value,
                array: this._getParamValue(array),
                parameters: _.reduce(parameters, (results, p: SnParam) => {
                    if (!p.displayState?.hidden && p.key !== 'propType') {
                        results.push({
                            key: p.key,
                            value: this._getParamValue(p),
                        });
                    }
                    return results;
                }, [])
            };
        }
    }

    proceedViewObjectExpression(snView: SnView) {
        this.proceedViewInParameters(snView);

        const expressions: SnNode[] = _.filter(snView.nodes, { type: 'SnObjectFunctionNode' });
        for (const expr of expressions) {
            const outParam = expr.params[0];
            const section = _.find(expr.sections, { key: 'parameters' });
            const f = _.find(expr.params, { key: 'function' });
            const array = _.find(expr.params, { key: 'array' });
            if (!section || !f || !f.value || !array || !array.value) {
                continue;
            }

            const parameters = section.params;

            // Array Function
            outParam.value = {
                type: 'ObjectFunction',
                function: f.value,
                array: this._getParamValue(array),
                parameters: _.reduce(parameters, (results, p: SnParam) => {
                    if (!p.displayState?.hidden && p.key !== 'propType') {
                        results.push({
                            key: p.key,
                            value: this._getParamValue(p),
                        });
                    }
                    return results;
                }, [])
            };
        }
    }

    proceedViewExpression(snView: SnView) {
        this.proceedViewInParameters(snView);

        const expressions: SnNode[] = _.filter(snView.nodes, (n) => this.isExpression(n));
        for (const expr of expressions) {
            if (expr.params.length > 0 && expr.sections.length > 0 && expr.params[0].direction === 'out') {
                const outParam = expr.params[0];
                const sources = expr.sections[0].params;

                // Formula
                if (_.isString(outParam.value)) {
                    outParam.value = this._replaceExpression(outParam.value, sources.map((source: SnParam) => {
                        const sourceCopy: SnParam = _.cloneDeep(source);
                        if (!sourceCopy.toward) {
                            if (typeof (sourceCopy.value) === 'string') {
                                sourceCopy.value = `"${sourceCopy.value.replace(/"/g, '”')}"`;
                            } else if (typeof (sourceCopy.value) === 'boolean') {
                                sourceCopy.value = sourceCopy.value ? 'TRUE' : 'FALSE';
                            }
                        }
                        return sourceCopy;
                    }));
                }

                // LangDto
                if (_.isArray(outParam.value)) {
                    const findDefaultLang = outParam.value.find((lang: SnLang) => this.translate.currentLang === lang.lang && lang.value)
                        || outParam.value.find((lang: SnLang) => lang.value);

                    outParam.value = _.map(outParam.value, (lang: SnLang) => {
                        if (lang.lang && (lang.value || findDefaultLang?.value)) {
                            return {
                                lang: lang.lang,
                                value: this._replaceExpression(lang.value ? lang.value : findDefaultLang.value, sources),
                            };
                        }
                        return lang;
                    });
                }
            }
        }
    }

    proceedViewService(snView: SnView) {
        this.proceedViewInParameters(snView);
        const services: SnNode[] = _.filter(snView.nodes, (n) => this.isService(n) && this._getOutParam(n));
        for (const node of services) {

            const params = this.snUtils.getParams(snView, node);
            const outParameter = this._getOutParam(node);

            const service: ServiceModelDto = {
                uuid: outParameter.id,
                key: outParameter.id,
                execute: node.custom.service.execute,
                type: node.custom.service.type,
                route: node.custom.service.route,
                mappedParams: node.custom.service.mappedParams,
                api: 'algotech',
                cache: true,
                body: node.custom.service.body,
                header: node.custom.service.header,
                params: Array.isArray(node.custom.service.params) ?
                    _.reduce(node.custom.service.params, (results, pair: { key: string; type: any }) => {
                        const findParam = params.find((p) => p.key === pair.key);
                        const findSection = node.sections.find((s) => s.key === pair.key && s.editable);

                        let value = null;

                        if (findParam && findParam.value !== null) {
                            value = this._getParamValue(findParam);

                        } else if (findSection) {
                            value = _.map(findSection.params, (param: SnParam) => {
                                const sPair: PairDto = {
                                    key: param.key,
                                    value: this._getParamValue(param),
                                };
                                return sPair;
                            });
                        }

                        if (value || pair.type === 'url-segment') {
                            const serviceParam: ServiceParamModelDto = {
                                key: pair.key,
                                type: pair.type,
                                value: value ? value : '',
                            };
                            results.push(serviceParam);
                        }

                        return results;
                    }, [])
                    : [],
            };

            service.return = {
                multiple: outParameter.multiple ? outParameter.multiple : true,
                type: !Array.isArray(outParameter.types) ? outParameter.types : null,
            };

            outParameter.value = service;
        }
    }

    proceedViewLoop(snView: SnView) {
        const loopNodes: SnNode[] = _.filter(snView.nodes, { type: 'SnLoopNode' });
        if (!loopNodes || loopNodes.length === 0) { return; }
        for (const node of loopNodes) {
            const flowIn: SnFlow = _.find(node.flows, { direction: 'in' });
            const flowNext: SnFlow = _.find(node.flows, { key: 'next' });
            const nextFlows: SnFlow[] = this.snUtils.getNextFlows(snView, [flowIn], [flowNext], { type: 'SnLoopNode', flow: 'next' });
            if (nextFlows) {
                const disconnect: SnFlow[] = _.filter(nextFlows, (f: SnFlow) => !f.toward);
                for (const flow of disconnect) {
                    if (flow) {
                        flow.toward = flowIn.id;
                    }
                }
            }
        }
    }

    proceedViewFormDataSource(snView: SnView, origin: SnView) {
        const formNodes: SnNode[] = _.filter(snView.nodes, { type: 'SnFormNode' });
        for (const node of formNodes) {
            const originNode = origin.nodes.find((n) => n.id === node.id);
            if (!originNode) {
                continue;
            }

            const opSection = node.sections.find((s) => s.key === 'options');
            if (!opSection) {
                continue;
            }

            const params = opSection.params;
            const originParams = this.snUtils.getParams(origin, originNode);

            for (const param of params) {
                if (param.value && param.toward) {
                    const originParam = originParams.find((p) => p.id === param.id);
                    if (!originParam) {
                        continue;
                    }

                    param.value = _.assign(_.cloneDeep(originParam.value), { dataSource: this._getParamValue(param) });
                }
            }
        }
    }

    proceedViewFormDBConnector(snView: SnView) {
        this.proceedViewInParameters(snView);
        const dbConnectors: SnNode[] = _.filter(snView.nodes, { type: 'SnDBConnectorNode' });
        for (const node of dbConnectors) {
            const outParam = node.params[0];
            outParam.value = {};
            for (let i = 1; i < node.params.length; i++) {
                outParam.value[node.params[i].key] = node.params[i].value;
            }
            for (const section of node.sections.filter((s) => !s.hidden)) {
                for (let i = 0; i < section.params.length; i++) {
                    outParam.value[section.params[i].key] = section.params[i].value;
                }
            }
        }
    }

    proceedViewQueryDB(snView: SnView) {
        this.proceedViewInParameters(snView);
        const queries: SnNode[] = _.filter(snView.nodes, (n) => this._isQuery(n));
        for (const query of queries) {
            if (query.params.length > 0 && query.sections.length > 0) {
                const requestSection = query.sections.find((s) => s.key === 'query');
                if (requestSection) {
                    const requestQuery = requestSection.params.find((p) => p.key === 'plainQuery');
                    const sources = query.sections.find((s) => s.key === 'sources');
                    if (_.isString(requestQuery.value)) {
                        requestQuery.value = this._replaceExpression(requestQuery.value, sources.params);
                    }
                }
            }
        }
    }

    proceedViewGenericList(snView: SnView) {
        this.proceedViewInParameters(snView);
        const gList: SnNode[] = _.filter(snView.nodes, (n) => this._isGenericList(n) && this._getOutParam(n));

        for (const node of gList) {
            const params = this.snUtils.getParams(snView, node);
            const outParam = this._getOutParam(node);
            const selectedGList: SnParam = params.find((p) => p.key === 'selectedglist');

            outParam.value = {
                type: 'GListValues',
                key: this._getParamValue(selectedGList)
            };
        }
    }

    proceedViewJsonNode(snView: SnView) {
        this.proceedViewInParameters(snView);
        const jsonNodes: SnNode[] = _.filter(snView.nodes, (n) => this._isJsonNode(n));

        for (const node of jsonNodes) {
            const outParam = this._getOutParam(node);
            const sources = node.sections.find((s) => s.key === 'sources')?.params;
            if (outParam) {
                outParam.value = JSON.parse(this._replaceExpression(outParam.value, sources));
            }
        }
    }

    proceedViewGeo(snView: SnView) {
        this.proceedViewInParameters(snView);
        const geo: SnNode[] = _.filter(snView.nodes, (n) => this._isGeo(n) && this._getOutParam(n));

        for (const node of geo) {
            const params = this.snUtils.getParams(snView, node);
            const outParam = this._getOutParam(node);

            const lat: SnParam = params.find((p) => p.key === 'latitude');
            const lng: SnParam = params.find((p) => p.key === 'longitude');
            const layerKey: SnParam = params.find((p) => p.key === 'layer');

            outParam.value = {
                layerKey: layerKey.value,
                type: 'Point',
                coordinates: [lat.value, lng.value],
            };
        }
    }

    proceedViewMagnet(snView: SnView) {
        this.proceedViewInParameters(snView);
        const magnet: SnNode[] = _.filter(snView.nodes, (n) => this._isMagnet(n) && this._getOutParam(n));

        for (const node of magnet) {
            const params = this.snUtils.getParams(snView, node);
            const outParam = this._getOutParam(node);

            const application: SnParam = params.find((p) => p.key === 'application');
            const zone: SnParam = params.find((p) => p.key === 'zone');
            const boardInstance: SnParam = params.find((p) => p.key === 'boardInstance');
            const placement: SnParam = params.find((p) => p.key === 'placement');
            const x: SnParam =  params.find((p) => p.key === 'x');
            const y: SnParam =  params.find((p) => p.key === 'y');

            outParam.value = {
                appKey: application?.value,
                magnetsZoneKey: zone?.value,
                boardInstance: boardInstance?.value,
                x: placement?.value === 'automatic' ? -1 : (x?.value ? x.value : 0),
                y: placement?.value === 'automatic' ? -1 : (y?.value ? y.value : 0),
                order: 0,
            };
        }
    }

    proceedViewFilter(snView: SnView) {
        this.proceedViewInParameters(snView);
        const filter: SnNode[] = _.filter(snView.nodes, (n) => this._isFilter(n) && this._getOutParam(n));

        for (const node of filter) {
            const params = this.snUtils.getParams(snView, node);
            const outParam = this._getOutParam(node);

            const criteria: SnParam = params.find((p) => p.key === 'criteria');
            const value: SnParam = params.find((p) => p.key === 'firstValue');
            const secondValue: SnParam = params.find((p) => p.key === 'secondValue');
            const models = outParam?.custom?.models;
            const type = outParam?.custom?.type;

            outParam.value = {
                criteria: criteria?.value,
                value: value?.value,
            };
            if (models) {
                outParam.value.models = models;
            }
            if (type) {
                outParam.value.type = type;
            }
            if (!secondValue?.displayState?.hidden) {
                outParam.value.secondValue = secondValue?.value;
            }
        }
    }

    _getArrayValue(snView: SnView, node: SnNode) {
        if (node.sections.length === 0) {
            return [];
        }
        return _.compact(
            _.map(node.sections[0].params, (param: SnParam) => {
                // recursive array node (not yet calculated)
                const findLinked = this.snUtils.getParamsWithNode(snView).find((p) => p.param.id === param.toward);
                if (findLinked && this._isArray(findLinked.node)) {
                    if (!findLinked.param.value) {
                        findLinked.param.value = this._getArrayValue(snView, findLinked.node);
                    }
                    return findLinked.param.value;
                }

                return param.value;
            })
        );
    }

    _getOutParam(node: SnNode) {
        return node.params.find((p) => p.direction === 'out');
    }

    _getParamValue(param: SnParam) {
        if (param.multiple === true) {
            return _.isArray(param.value) ? param.value : _.compact([param.value]);
        } else {
            return param.value;
        }
    }

    _replaceExpression(expression: string, sources: SnParam[]) {
        const paths = expression.match(/{{(?!\[)(.*?)}}/ig); // découpe les objets
        let res = expression;

        if (!paths) {
            return res;
        }

        for (const path of paths) {

            const source = sources.find((s) => `{{${s.key}}}` === path);
            if (source && source.value !== path) {
                while (res.includes(path)) {
                    res = res.replace(path, source.value);
                }
            }
        }
        return res;
    }

    isService(node: SnNode) {
        return node.custom && node.custom.service;
    }

    isExpression(node: SnNode) {
        return node.type === 'SnTextFormattingNode' || node.type === 'SnFormulaNode' || node.type === 'SnArrayFunctionNode'
            || node.type === 'SnObjectFunctionNode' || this._isGenericList(node);
    }

    _isArray(node: SnNode) {
        return node.type === 'SnArrayNode';
    }

    _isQuery(node: SnNode) {
        return node.type === 'SnQueryBuilderNode';
    }

    _isGeo(node: SnNode) {
        return node.type === 'SnGeoNode';
    }

    _isMagnet(node: SnNode) {
        return node.type === 'SnMagnetNode';
    }

    _isFilter(node: SnNode) {
        return node.type === 'SnFilterNode';
    }

    _isGenericList(node: SnNode) {
        return node.type === 'SnGListNode';
    }

    _isJsonNode(node: SnNode) {
        return node.type === 'SnJsonNode';
    }

    _getPath(snView: SnView, node: SnNode, previous: SnParam, treatedNodes: SnNode[]) {
        const findMaster = node.params.find((p) => p.master);
        if (!findMaster) {
            return previous.key;
        }

        if (findMaster.direction === 'out' && previous !== findMaster) {
            return `${findMaster.key}.${previous.key}`;
        }

        const params = this.snUtils.getParamsWithNode(snView);
        const findParam = params.find((param) => param.param.id === findMaster.toward);

        if (!findParam) {
            return previous.key;
        }
        if (treatedNodes.indexOf(findParam.node) > -1) {
            return `${findParam.param.key}.${previous.key}`;
        }
        return `${this._getPath(snView, findParam.node, findParam.param, treatedNodes)}.${previous.key}`;
    }
}
