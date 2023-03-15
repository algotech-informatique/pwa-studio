import { SnAppDto, SnModelDto, SnPageDto, SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech/core';
import { Injectable } from '@angular/core';
import { PageUtilsService } from '../../../app/services/page-utils/page-utils.service';
import { AppCustomService } from '../app-custom/app-custom.service';
import * as _ from 'lodash';
import { FormulaWidget } from '../../dto/formula-widget.dto';
import { ActionControl } from '../../dto/action-control.dto';
import { AppCheckUtilsService } from './app-check-utils.service';
import { RuleWidget } from '../../dto/rule-widget.dto';
import { PageWidgetService } from '../../../app/services';
import { actionsRules, formulaRules, widgetRuleRules, widgetCheckRules, pageRules, appRules } from './rules-stack';
import { SnTranslateService } from '../../../smart-nodes';
import { RulesEngine, SessionsService } from '../../../../services';
import { CheckEvent, ValidationReportDto } from '../../../../dtos';

interface WidgetRule {
    rule: SnPageWidgetRuleDto;
    widget: SnPageWidgetDto;
}

@Injectable()
export class AppCheckService {

    constructor(
        private appCustomService: AppCustomService,
        private pageUtils: PageUtilsService,
        private appCheckUtils: AppCheckUtilsService,
        private pageWidgetService: PageWidgetService,
        private checkRulesEngine: RulesEngine,
        private sntranlslate: SnTranslateService,
        private sessionsService: SessionsService,
    ) { }

    check(app: SnAppDto, snModelUuid: string, checkEvent: CheckEvent) {
        this.appCustomService.updateApp(app);
        const model: SnModelDto = this.sessionsService.active.datas.write.snModels.find((snModel) => snModel.uuid === snModelUuid);
        const report: ValidationReportDto = {
            _id: snModelUuid,
            checkEvent,
            type: 'APP',
            caption: this.sntranlslate.transform(model?.displayName),
            errors: [],
            warnings: [],
            infos: []
        };


        const widgets: SnPageWidgetDto[] = this.pageUtils.getWidgets(app);
        const formulas: FormulaWidget[] = this._getFormulaWidgets(widgets);
        const pipes: ActionControl[] = this._getWidgetEvents(widgets);
        const pipesPage: ActionControl[] = this._getPageEvents(app);
        const rules: RuleWidget[] = this._getWidgetsRules(widgets);

        const widgetRules: WidgetRule[] = this._getWidgetRulesConditions(widgets);
        const ruleFormulas: FormulaWidget[] = this._getFormulaWidgetsRule(widgetRules);
        const rulePipes: ActionControl[] = this._getWidgetRuleEvents(widgetRules);

        this._initDisplayState(app, widgets);

        [...formulas, ...ruleFormulas].forEach((formula: FormulaWidget) => {
            const page = this.pageUtils.findPage(app, formula.element);
            this.checkRulesEngine.validateSnApp(formulaRules, report, app, page, formula, this.appCheckUtils);
        });

        [...pipes, ...pipesPage, ...rulePipes].forEach((pipe: ActionControl) => {
            const page = (pipe.type === 'widget') ?
                this.pageUtils.findPage(app, pipe.element as SnPageWidgetDto) : pipe.element as SnPageDto;
            this.checkRulesEngine.validateSnApp(actionsRules, report, app, page, pipe, this.appCheckUtils);
        });

        rules.forEach((rule: RuleWidget) => {
            const page = this.pageUtils.findPage(app, rule.element);
            this.checkRulesEngine.validateSnApp(widgetRuleRules, report, app, page, rule, this.appCheckUtils);
        });

        widgets.forEach((widget: SnPageWidgetDto) => {
            const page = this.pageUtils.findPage(app, widget);
            this.checkRulesEngine.validateSnApp(widgetCheckRules, report, app, page, widget, this.appCheckUtils);

        });
        app.pages.forEach((page: SnPageDto) => {
            this.checkRulesEngine.validateSnApp(pageRules, report, app, page, page, this.appCheckUtils);
        });

        this.checkRulesEngine.validateSnApp(appRules, report, app, null, {}, this.appCheckUtils);

        return report;
    }

    _initDisplayState(app: SnAppDto, widgets: SnPageWidgetDto[]) {
        // clean old error
        app.displayState.errors = [];
        for (const widget of widgets) {
            widget.displayState.errors = [];
            widget.displayState.warnings = [];
            widget.displayState.infos = [];
            if (widget.displayState?.rule?.widget) {
                widget.displayState.rule.widget.displayState.errors = [];
                widget.displayState.rule.widget.displayState.warnings = [];
                widget.displayState.rule.widget.displayState.infos = [];
            }
        }
        for (const page of app.pages) {
            page.displayState.errors = [];
            page.displayState.warnings = [];
            page.displayState.infos = [];
        }
    }

    _getFormulaWidgetsRule(widgetRules: WidgetRule[]): FormulaWidget[] {
        const formulaWidgets: FormulaWidget[] = [];

        for (const widgetRule of widgetRules) {
            formulaWidgets.push(...this._getFormula(widgetRule.widget, `rule.${widgetRule.rule.id}.`));
        }
        return formulaWidgets;
    }

    _getFormulaWidgets(widgets: SnPageWidgetDto[]): FormulaWidget[] {
        const formulaWidgets: FormulaWidget[] = [];

        for (const widget of widgets) {
            formulaWidgets.push(...this._getFormula(widget, ''));
        }
        return formulaWidgets;
    }

    _getFormula(widget: SnPageWidgetDto, rule: string): FormulaWidget[] {
        const formulaWidgets: FormulaWidget[] = [];

        if (widget.typeKey === 'list') {
            formulaWidgets.push({ element: widget, type: 'makeList', property: widget.custom.collection, path: `${rule}custom.list` });
        }

        Object.keys(widget.custom).forEach(customKey => {
            const prop = widget.custom[customKey];
            if (widget.custom[prop] !== null) {
                if (_.isArray(prop)) {
                    for (const ele of prop) {
                        if (this._checkProperty(ele)) {
                            formulaWidgets.push({
                                element: widget, type: 'custom',
                                property: this._getPropertyValue(ele), path: `${rule}custom.${customKey}`
                            });
                        }
                    }
                } else {
                    if (this._checkProperty(prop)) {
                        formulaWidgets.push({
                            element: widget, type: 'custom',
                            property: this._getPropertyValue(prop), path: `${rule}custom.${customKey}`
                        });
                    }
                }
            }
        });

        for (const ev of widget.events) {
            ev.pipe.forEach((action, index) => {
                for (const input of action.inputs) {
                    if (this._checkProperty(input)) {
                        formulaWidgets.push({
                            element: widget, type: 'event',
                            property: this._getPropertyValue(input), event: ev, action, path: `${rule}event.${ev.eventKey}.${index}`
                        });
                    }
                }
            });
        }
        return formulaWidgets;
    }

    _getWidgetRuleEvents(widgetRules: WidgetRule[]): ActionControl[] {
        const pipes: ActionControl[] = _.reduce(widgetRules, (result, widgetRule: WidgetRule) => {
            result.push(...this._getWidgetEvent(widgetRule.widget, `rule.${widgetRule.rule.id}.`));
            return result;
        }, []);
        return pipes;
    }

    _getWidgetEvents(widgets: SnPageWidgetDto[]): ActionControl[] {

        const pipes: ActionControl[] = _.reduce(widgets, (result, widget: SnPageWidgetDto) => {
            result.push(...this._getWidgetEvent(widget, ''));
            return result;
        }, []);
        return pipes;
    }

    _getWidgetEvent(widget: SnPageWidgetDto, rule: string): ActionControl[] {

        const pipes: ActionControl[] = [];
        for (const ev of widget.events) {
            ev.pipe.forEach((value, index) => {
                pipes.push({ element: widget, type: 'widget', event: ev, pipe: value, path: `${rule}event.${ev.eventKey}.${index}` });
            });
        }
        return pipes;
    }

    _getWidgetsRules(widgets: SnPageWidgetDto[]): RuleWidget[] {
        const rules: RuleWidget[] = _.reduce(widgets, (result, widget: SnPageWidgetDto) => {
            result.push(...this._getWidgetRules(widget));
            return result;
        }, []);
        return rules;
    }

    _getWidgetRules(widget: SnPageWidgetDto): RuleWidget[] {
        const rules: RuleWidget[] = _.reduce(widget.rules, (result, rule: SnPageWidgetRuleDto) => {
            result.push({ element: widget, type: 'widget', rule, path: `rule.${rule.id}` });

            rule.conditions.forEach((value, index) => {
                result.push({ element: widget, type: 'widget', rule, condition: value, path: `rule.${rule.id}.condition.${index}` });
            });
            return result;
        }, []);
        return rules;
    }

    _getWidgetRulesConditions(widgets: SnPageWidgetDto[]): WidgetRule[] {
        const cloneWidgets: WidgetRule[] = _.reduce(widgets, (result, widget: SnPageWidgetDto) => {
            if (widget.rules.length !== 0) {
                result.push(...this._cloneWidgetRules(widget));
            }
            return result;
        }, []);
        return cloneWidgets;
    }

    _cloneWidgetRules(widget: SnPageWidgetDto): WidgetRule[] {
        return _.reduce(widget.rules, (result, rule: SnPageWidgetRuleDto) => {
            let widgetApplyingRule: SnPageWidgetDto;
            if (widget.displayState?.rule?.rule?.id === rule.id) {
                widgetApplyingRule = widget.displayState?.rule?.widget;
            } else {
                widgetApplyingRule = _.cloneDeep(widget);
                this.pageWidgetService.recomposeRule(rule, widgetApplyingRule);
            }
            const wRule: WidgetRule = {
                rule,
                widget: widgetApplyingRule,
            };
            result.push(wRule);
            return result;
        }, []);
    }

    _getPageEvents(app: SnAppDto): ActionControl[] {
        const pipes: ActionControl[] = _.reduce(app.pages, (result, page: SnPageDto) => {
            result.push(...this._getPageEvent(page));
            return result;
        }, []);
        return pipes;
    }

    _getPageEvent(page: SnPageDto): ActionControl[] {
        const pipes: ActionControl[] = [];
        if (page.dataSources?.length !== 0) {
            page.dataSources?.forEach((value, index) => {
                pipes.push({ element: page, type: 'page', pipe: value, path: `datasource.${value.id}.${index}` });
            });
        }
        for (const ev of page.events) {
            ev.pipe.forEach((value, index) => {
                pipes.push({ element: page, type: 'page', event: ev, pipe: value, path: `page.event.${value.id}.${index}` });
            });
        }
        return pipes;
    }

    _checkProperty(ele: any): boolean {
        return (_.isObject(ele)) ? (ele && (this.appCustomService.isExpression(ele.value))) : this.appCustomService.isExpression(ele);
    }

    _getPropertyValue(ele: any) {
        return (_.isObject(ele)) ? ele.value : ele;
    }

}
