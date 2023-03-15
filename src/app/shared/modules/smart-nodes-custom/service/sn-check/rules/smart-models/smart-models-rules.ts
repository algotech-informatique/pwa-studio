import { SnViewRule } from "../../../../../../models/check-rule.interface"
import { SnNode, SnParam, SnView } from "../../../../../smart-nodes"
import * as _ from 'lodash';
import { ValidationReportDto } from "src/app/shared/dtos";
import { SnCheckUtilsService } from "../../check-utils";

export const nodeDupplicateRule: SnViewRule = {
    check: (stackCode: string, report: ValidationReportDto, snView: SnView,
        snModelUuid: string, item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (!item.custom.key || items.some((n) => n.custom.key === item.custom.key && n.id !== item.id)) {
            checkUtilsService.pushError(snView, stackCode, report, 'KEY_DUPLICATE_OR_UNDEFINED', item, null, null, 'node');
            return false;
        }
        return true;
    }
};

export const nodePermissionRule: SnViewRule = {
    check: (stackCode: string, report: ValidationReportDto, snView: SnView, snModelUuid: string,
        item: SnNode, items: SnNode[], parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (item.custom?.permissions?.R?.length === 0 && item.custom?.permissions?.RW?.length === 0) {
            checkUtilsService.pushError(snView, stackCode, report, 'PERMISSIONS_UNDEFINED', item, null, null, 'node');
            return false;
        }
        return true;
    }
};

export const nodeParamDupplicateRule: SnViewRule = {
    check: (stackCode: string, report: ValidationReportDto, snView: SnView, snModelUuid: string,
        item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {
        if (!item.key || items.find((p) => p.key === item.key && p.id !== item.id)) {
            checkUtilsService.pushError(snView, stackCode, report, 'KEY_DUPLICATE_OR_UNDEFINED', parent, item, null, 'node');
            return false;
        }
        return true;
    }
};

export const nodeParamTypeUdefinedRule: SnViewRule = {
    check: (stackCode: string, report: ValidationReportDto, snView: SnView, snModelUuid: string, item: SnParam,
        items: SnNode[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {
        if (!item.types) {
            checkUtilsService.pushError(snView, stackCode, report, 'TYPE_UNDEFINED', parent, item, null, 'node');
            return false;
        }

        if ((item.types as string).startsWith('so:')) {
            if (!snView.nodes.some((n: SnNode) =>
                n.custom?.key?.toUpperCase() === (item.types as string).replace('so:', '').toUpperCase()
            )) {
                checkUtilsService.pushError(snView, stackCode, report, 'TYPE_UNDEFINED', parent, item, null, 'node');
                return false;
            }
        }
        return true;
    }
};

export const nodeParamUnconsistentTypeRule: SnViewRule = {
    check: (stackCode: string, report: ValidationReportDto, snView: SnView, snModelUuid: string, item: SnParam,
        items: SnNode[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {
        if ((item.types as string).startsWith('so:')) {
            const modelNode: SnNode = snView.nodes.find((n: SnNode) =>
                n.custom?.key?.toUpperCase() === (item.types as string).replace('so:', '').toUpperCase()
            );
            if (!modelNode) {
                return false;
            }
            const rPermissions: boolean = _.union(item.value?.permissions?.R, item.value?.permissions?.RW).every((r: string) =>
                modelNode.custom?.permissions?.R.includes(r) || modelNode.custom?.permissions?.RW.includes(r)
            );
            if (!rPermissions) {
                checkUtilsService.pushError(snView, stackCode, report, 'INCONSISTENT_PERMISSION', parent, item, null, 'node');
                return false;
            }
        }
        return true;
    }
};
