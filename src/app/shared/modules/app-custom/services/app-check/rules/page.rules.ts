import { SnAppDto, SnPageDto, SnPageEventPipeDto } from '@algotech/core';
import * as _ from 'lodash';
import { AppCheckUtilsService } from '../app-check-utils.service';
import { ValidationReportDto } from '../../../../../dtos';
import { AppRule } from '../../../../../models/check-rule.interface';
import { PageWidgetService } from '../../../../app/services';

export const pageVarRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: SnPageDto, checkUtilsService: AppCheckUtilsService): boolean => {
        let error = false;
        item.variables?.forEach((v, index) => {
            if (!v.key || !v.type) {
                error = true;
                checkUtilsService.pushError(app, item, stackCode, report, 'APP.PAGE_VARIABLE_ERROR', { path: `page.variables.${index}`, openInspector: 'behavior' });
            }
        });
        return !error;
    }
}

export const pageDataSourceRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: SnPageDto, checkUtilsService: AppCheckUtilsService): boolean => {
        let error = false;
        item.dataSources?.forEach((dataSource, index) => {
            if (!dataSource.key) {
                error = true;
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.PAGE_DATASOURCE_KEY_ERROR', { path: `datasource.${dataSource.id}.${index}`, openInspector: 'behavior' });
            }
            const valide = _.some(item.dataSources, (ds: SnPageEventPipeDto) => ds.id !== dataSource.id && ds.key === dataSource.key);
            if (valide) {
                error = true;
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.PAGE_DATASOURCE_KEY_DUPLICATE_ERROR', { path: `datasource.${dataSource.id}.${index}`, openInspector: 'behavior' });
            }
        });
        return !error;
    }
}

export const pageSingleWidgetRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: SnPageDto,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        let error = false;
        const checkedErrorTypes: string[] = [];
        item.widgets.forEach(widget =>  {
            if (PageWidgetService.getType(widget).single) {
                const isSingleInPage = !item.widgets.find(w => w.id !== widget.id && w.typeKey === widget.typeKey);
                if (isSingleInPage || checkedErrorTypes.includes(widget.typeKey)) { return; }
                error = true;
                checkUtilsService.pushError(
                    app,
                    page,
                    stackCode,
                    report,
                    checkUtilsService.translateService.instant('APP.PAGE_SINGLE_WIDGET_TYPE_ERROR', { widgetTypeKey: widget.typeKey }),
                    { path: 'page', openInspector: 'layers' },
                );
                checkedErrorTypes.push(widget.typeKey);
            }
        });
        return !error;
    }
};
