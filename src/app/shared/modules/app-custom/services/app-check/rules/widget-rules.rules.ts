import { SnAppDto, SnPageDto } from "@algotech/core";
import { ValidationReportDto } from "src/app/shared/dtos";
import { AppRule } from "src/app/shared/models/check-rule.interface";
import { RuleWidget } from "../../../dto/rule-widget.dto";
import * as _ from 'lodash';
import { AppCheckUtilsService } from "../app-check-utils.service";

export const widgetNoConditionRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: RuleWidget, checkUtilsService: AppCheckUtilsService): boolean => {
        if (item.rule?.conditions?.length === 0) {
            checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITIONS_ERROR', {
                widget: item.element,
                item, path: item.path, openInspector: 'conditions'
            });
            return false;
        }
        return true;
    }
}

export const widgetNoCriteraRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: RuleWidget, checkUtilsService: AppCheckUtilsService): boolean => {
        if (!item.condition) {
            return true;
        }
        if (!item.condition?.criteria) {
            checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITION_CRITERIA_ERROR', {
                widget: item.element,
                item, path: item.path, openInspector: 'conditions'
            });
            return false;
        }
        return true;
    }
}

export const widgetConditionInputRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: RuleWidget, checkUtilsService: AppCheckUtilsService): boolean => {
        if (!item.condition) {
            return true;
        }
        if (!item.condition?.input) {
            checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITION_INPUT_ERROR', { item, path: item.path, openInspector: 'conditions' });
            return false;
        } else {
            const symboles: string[] = checkUtilsService.appCustomService._getSymboles(item.condition.input);
            let error = false;
            symboles.forEach((symbol: string) => {
                if (!checkUtilsService.appCustomService.getPathTypeAndMultiple(symbol, checkUtilsService.pageUtils.findPage(app, item.element), item.element)) {
                    error = true;
                    checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITION_INPUT_ERROR', {
                        widget: item.element,
                        item, path: item.path, openInspector: 'conditions'
                    });
                }
            });
        }
    }
}

export const widgetCriteaInputRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: RuleWidget,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        if (item.condition) {
            if (!checkUtilsService._checkCriteriaValue(item.condition.criteria, item.condition.value)) {
                checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITION_VALUE_ERROR', {
                    widget: item.element,
                    item, path: item.path, openInspector: 'conditions'
                });
                return false;
            } else {
                let error = false;
                const symboles: string[] = checkUtilsService.appCustomService._getSymboles(item.condition.value);
                symboles.forEach((symbol: string) => {
                    if (!checkUtilsService.appCustomService.getPathTypeAndMultiple(
                            symbol,
                            checkUtilsService.pageUtils.findPage(app, item.element),
                            item.element,
                        )) {
                        error = true;
                        checkUtilsService.pushError(app, page, stackCode, report, 'WIDGET.RULE.CONDITION_INPUT_ERROR', {
                            widget: item.element,
                            item, path: item.path, openInspector: 'conditions'
                        });
                    }
                });
                return !error;
            }
        }
        return true;
    }
};
