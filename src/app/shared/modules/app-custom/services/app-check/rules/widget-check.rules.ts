import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ValidationReportDto } from 'src/app/shared/dtos';
import { AppRule } from 'src/app/shared/models/check-rule.interface';
import * as _ from 'lodash';
import { AppCheckUtilsService } from '../app-check-utils.service';
import { kMaxLength } from 'buffer';

export const widgetZoneRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: SnPageWidgetDto, checkUtilsService: AppCheckUtilsService): boolean => {
        if (item?.typeKey === 'zone') {
            if (!item.custom?.key) {
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.WIDGET_ZONE_NO_KEY', { widget: item, path: 'custom.key', openInspector: 'behavior' });
                return false;

            }
        }
        return true;
    }
};

export const widgetTableRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: SnPageWidgetDto,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        if (item?.typeKey === 'table' && item.custom) {
            const modelKey = checkUtilsService.appCustomService.getPathTypeAndMultiple(item.custom?.collection, page, item)?.type;
            if (!modelKey) {
                checkUtilsService.pushError(
                    app,
                    page,
                    stackCode,
                    report,
                    'APP.DATASOURCE_NOT_FIND',
                    { widget: item, path: 'custom.table.collection', openInspector: 'behavior' },
                );
                return false;
            }
            if (modelKey !== item.custom?.collectionType) {
                checkUtilsService.pushError(
                    app,
                    page,
                    stackCode,
                    report,
                    'APP.WIDGET_TABLE_DATASOURCE_CHANGED',
                    { widget: item, path: 'custom.table.collection.columns', openInspector: 'behavior' },
                );
                return false;
            }
            const model = checkUtilsService.appCustomService.getModel(modelKey);
            if (model) {
                const columnsAreOk = item.custom.columns?.every(
                    (column: string) => model.properties.find(prop => prop.key === column)
                );
                if (!columnsAreOk) {
                    checkUtilsService.pushError(
                        app,
                        page,
                        stackCode,
                        report,
                        'APP.WIDGET_TABLE_DATASOURCE_NOT_MATCH',
                        { widget: item, path: 'custom.table.collection.columns', openInspector: 'behavior' },
                    );
                    return false;
                }
            }
        }
        return true;
    }
};
