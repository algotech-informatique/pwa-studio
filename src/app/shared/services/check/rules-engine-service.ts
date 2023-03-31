import { SnAppDto, SnPageDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { ValidationReportDto } from '../../dtos';
import { AppRule, RulesStack, SnViewRule } from '../../models/check-rule.interface';
import { AppCheckUtilsService } from '../../modules/app-custom/services';
import { SnView } from '../../modules/smart-nodes';
import { SnCheckUtilsService } from '../../modules/smart-nodes-custom/service/sn-check/check-utils';

@Injectable()
export class RulesEngine {

    validateSnView(rulesStack: RulesStack, report: ValidationReportDto, snView: SnView, snModelUuid: string,
        item: any, items: any[], parent: any,
        checkUtilsService: SnCheckUtilsService,): boolean {
        rulesStack.rules.forEach((rule) => {
            (rule.rule as SnViewRule).check(rule.code, report, snView, snModelUuid, item, items, parent, checkUtilsService);
        });

        return report.errors.length > 0;
    }

    validateSnApp(rulesStack: RulesStack, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: any,
        checkUtilsService: AppCheckUtilsService): boolean {
        rulesStack.rules.forEach((rule) => {
            (rule.rule as AppRule).check(rule.code, report, app, page, item, checkUtilsService);
        });

        return report.errors.length > 0;
    }

}
