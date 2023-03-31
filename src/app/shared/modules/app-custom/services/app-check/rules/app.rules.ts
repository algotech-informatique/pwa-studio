import { SnAppDto, SnPageDto } from "@algotech-ce/core";
import { ValidationReportDto } from "src/app/shared/dtos";
import { AppRule } from "src/app/shared/models/check-rule.interface";
import * as _ from 'lodash';
import { AppCheckUtilsService } from "../app-check-utils.service";

export const appIconRule: AppRule = {
  check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item, checkUtilsService: AppCheckUtilsService): boolean => {
    if (!app.icon) {
      checkUtilsService.pushError(app, page, stackCode, report, 'APP.NO-ICON_ERROR', { 
        openInspector: 'application',
        path: `app.icon` });
    return false;
  }
    return true;
}
}