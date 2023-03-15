import { SnAppDto, SnPageDto } from '@algotech/core';
import { ValidationReportDto } from '../../../../../dtos';
import { AppRule } from '../../../../../models/check-rule.interface';
import { FormulaWidget } from '../../../dto/formula-widget.dto';
import { AppCheckUtilsService } from '../app-check-utils.service';
import * as _ from 'lodash';

export const formulaInputRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: FormulaWidget,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        let error = false;
        const symboles: string[] = checkUtilsService.appCustomService._getSymboles(item.property);
        symboles.forEach((symbol: string) => {
            if (!checkUtilsService.appCustomService.getPathTypeAndMultiple(
                symbol,
                checkUtilsService.pageUtils.findPage(app, item.element),
                item.element,
                item.event,
                item.action
            )) {
                error = true;
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.FORMULA_INPUT_ERROR', {
                    widget: item.element,
                    item, path: item.path, openInspector: 'behavior'
                });
            }
        });
        return !error;
    }
};

export const formulaListRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: FormulaWidget,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        if ((item.type === 'makeList') && (!item.property)) {
            checkUtilsService.pushError(app, page, stackCode, report, 'APP.LIST_COLLECTION_NO_FIND_ERROR', {
                widget: item.element,
                item, path: item.path, openInspector: 'behavior'
            });
            return false;
        }
        return true;
    }
};
