import { Injectable } from '@angular/core';
import { SnView, SnParam, } from '../../../smart-nodes/models';
import { RulesEngine } from '../../../../services';
import * as _ from 'lodash';
import { CheckEvent, ValidationReportDto } from '../../../../dtos';
import { smartModelsNodeRules, smartModelsParamsRules, snViewNodeRules, snViewRules, snViewParamsRules } from './rules/rules-stack';
import { SnCheckUtilsService } from './check-utils';
import { SnModelDto } from '@algotech/core';
import { SnTranslateService } from '../../../smart-nodes/services';

@Injectable()
export class SnCheckService {

    constructor(
        private checkUtilsService: SnCheckUtilsService,
        private checkRulesEngine: RulesEngine,
        private sntranlslate: SnTranslateService,
    ) { }

    check(snView: SnView, snModelUuid: string, checkEvent: CheckEvent): ValidationReportDto {

        this._initDisplayState(snView);

        const model: SnModelDto = this.checkUtilsService.
            sessionsService.active.datas.write.snModels.find((snModel) => snModel.uuid === snModelUuid);
        const caption = this.sntranlslate.transform(model?.displayName);
        return snView.options.type === 'smartmodel' ?
            this.checkModel(snModelUuid, snView, caption, checkEvent) :
            this.checkFlow(snModelUuid, snView, snModelUuid, caption, checkEvent);
    }

    _initDisplayState(snView: SnView) {
        snView.displayState.errors = [];
        for (const node of snView.nodes) {
            node.displayState.error = false;
            node.displayState.info = false;
            node.displayState.warning = false;
        }

        for (const elt of this.checkUtilsService.snUtils.getParamsWithNode(snView)) {
            elt.param.displayState.error = false;
            elt.param.displayState.info = false;
            elt.param.displayState.warning = false;
        }
    }

    checkModel(_id: string, snView: SnView, caption: string, checkEvent: CheckEvent): ValidationReportDto {
        const report: ValidationReportDto = {
            _id,
            checkEvent,
            type: 'SM',
            caption,
            errors: [],
            warnings: [],
            infos: []
        };
        for (const node of snView.nodes) {

            this.checkRulesEngine.validateSnView(smartModelsNodeRules,
                report, snView, '', node, snView.nodes, node, this.checkUtilsService);

            for (const param of node.sections[0].params) {
                this.checkRulesEngine.validateSnView(smartModelsParamsRules,
                    report, snView, '', param, node.sections[0].params, node, this.checkUtilsService);
            }
        }

        return report;
    }

    checkFlow(_id: string, snView: SnView, snModelUuid: string, caption: string, checkEvent: CheckEvent): ValidationReportDto {
        const report: ValidationReportDto = {
            _id,
            checkEvent,
            type: (snView.options.type === 'smartflow') ? 'SF' : 'WF',
            caption,
            errors: [],
            warnings: [],
            infos: []
        };
        this.checkRulesEngine.validateSnView(snViewRules, report, snView, snModelUuid, {}, [], {}, this.checkUtilsService);

        const nodes = snView.nodes.filter((n) => this.checkUtilsService.nodeActive(snView, n));
        for (const node of nodes) {
            const params: SnParam[] = this.checkUtilsService.snUtils.getNodeParams(node);
            for (const param of params) {
                // repair
                if (checkEvent !== 'onDesign') {
                    if (param.value && param.display === 'select' && _.isArray(param.displayState.items)) {
                        if (_.isArray(param.value)) {
                            _.remove(param.value, (v) => !param.displayState.items.some((item) => item.key === v));
                        } else {
                            if (!param.displayState.items.some((item) => item.key === param.value)) {
                                param.value = null;
                            }
                        }
                    }
                }
                this.checkRulesEngine.validateSnView(snViewParamsRules,
                    report, snView, snModelUuid, param, params, node, this.checkUtilsService);
            }

            this.checkRulesEngine.validateSnView(snViewNodeRules, report, snView, snModelUuid, node, nodes, {}, this.checkUtilsService);
        }
        return report;
    }
}
