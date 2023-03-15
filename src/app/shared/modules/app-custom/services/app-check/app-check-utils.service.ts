import { Injectable } from '@angular/core';
import { PageUtilsService } from '../../../app/services';
import { AppCustomService } from '../app-custom/app-custom.service';
import * as _ from 'lodash';
import { SnModelsService } from '../../../../services';
import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech/core';
import { ActionControl } from '../../dto/action-control.dto';
import { FormulaWidget } from '../../dto/formula-widget.dto';
import { RuleWidget } from '../../dto/rule-widget.dto';
import { OpenInspectorType } from '../../../app/dto/app-selection.dto';
import { TranslateService } from '@ngx-translate/core';
import { ValidationReportDto } from '../../../../dtos';


@Injectable()
export class AppCheckUtilsService {

    constructor(
        public snModels: SnModelsService,
        public appCustomService: AppCustomService,
        public pageUtils: PageUtilsService,
        public translateService: TranslateService,
    ) { }

    _checkCriteriaValue(criteria: string, value: string): boolean {
        const listCriteria: string[] = ['isNull', 'exists', 'isNotNull', 'isEmptyArray', 'isNotEmptyArray'];
        const checkCriteria = listCriteria.includes(criteria);
        return checkCriteria || value !== null;
    }

    pushError(view: SnAppDto, page: SnPageDto, code: string, report: ValidationReportDto, type: string,
        data: {
            widget?: SnPageWidgetDto;
            item?: ActionControl | FormulaWidget | RuleWidget;
            path?: string;
            openInspector?: OpenInspectorType;
        }) {

        const element = (data.item) ? data.item.element :
            (data.widget) ? data.widget :
                (page) ? page :
                    view;
        if (data.path) {
            element.displayState.errors.push(data.path);
        }
        report.errors.push({
            view,
            code,
            element,
            widget: data.widget,
            page,
            type,
            path: data.path,
            openInspector: data.openInspector
        });
    }

    pushWarning(view: SnAppDto, page: SnPageDto, code: string, report: ValidationReportDto, type: string,
        data: {
            widget?: SnPageWidgetDto;
            item?: ActionControl | FormulaWidget | RuleWidget;
            path?: string;
            openInspector?: OpenInspectorType;
        }) {

        const element = (data.item) ? data.item.element :
            (data.widget) ? data.widget :
                (page) ? page :
                    view;
        if (data.path) {
            element.displayState.warnings.push(data.path);
        }
        report.warnings.push({
            view,
            code,
            element: (data.item) ? data.item.element :
                (data.widget) ? data.widget :
                    (page) ? page :
                        view,
            widget: data.widget,
            page,
            type,
            path: data.path,
            openInspector: data.openInspector
        });
    }

    pushInfo(view: SnAppDto, page: SnPageDto, code: string, report: ValidationReportDto, type: string,
        data: {
            widget?: SnPageWidgetDto;
            item?: ActionControl | FormulaWidget | RuleWidget;
            path?: string;
            openInspector?: OpenInspectorType;
        }) {
        const element = (data.item) ? data.item.element :
            (data.widget) ? data.widget :
                (page) ? page :
                    view;
        if (data.path) {
            element.displayState.infos.push(data.path);
        }
        report.infos.push({
            view,
            code,
            element: (data.item) ? data.item.element :
                (data.widget) ? data.widget :
                    (page) ? page :
                        view,
            widget: data.widget,
            page,
            type,
            path: data.path,
            openInspector: data.openInspector
        });
    }
}
