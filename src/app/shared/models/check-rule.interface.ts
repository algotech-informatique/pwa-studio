import { SnAppDto, SnPageDto } from "@algotech-ce/core";
import { ValidationReportDto } from "../dtos";
import { AppCheckUtilsService } from "../modules/app-custom/services";
import { SnView } from "../modules/smart-nodes";
import { SnCheckUtilsService } from "../modules/smart-nodes-custom/service/sn-check/check-utils";

export interface RulesStack {
  code: string;
  rules: Rule[];
}

export interface Rule {
  code: string;
  rule: SnViewRule | AppRule ;
}

export interface SnViewRule {
  check: (stackCode: string, report: ValidationReportDto, snView: SnView,
    snModelUuid: string,
    item: any, items: any[], parent: any,
    checkUtilsService: SnCheckUtilsService) => boolean;
}

export interface AppRule {
  check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto,
    item: any, checkUtilsService: AppCheckUtilsService) => boolean;
}
