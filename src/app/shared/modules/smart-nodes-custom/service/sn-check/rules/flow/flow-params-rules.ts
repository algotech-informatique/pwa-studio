import { ValidationReportDto } from '../../../../../../dtos';
import { SnViewRule } from '../../../../../../models/check-rule.interface';
import { SnNode, SnParam, SnView } from '../../../../../smart-nodes';
import { SnCheckUtilsService } from '../../check-utils';

export const flowRequiredValueRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView,
        snModelUuid: string, item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {
        const connectedParam = checkUtilsService.snUtils.findConnectedParam(snView, item);
        if (!connectedParam && item.required &&
            (item.value === '' || item.value === null || item.value === undefined)) {
            checkUtilsService.pushError(snView, stackCode, report, 'REQUIRED_VALUE', parent, item, item.key);
            return false;
        }
        return true;
    }
};

export const flowWrongTypeRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView,
        snModelUuid: string, item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {
        let connected: SnParam;
        if (item.direction === 'in' && item.toward) {
            connected = checkUtilsService.snUtils.findConnectedParam(snView, item);
            if (connected && !checkUtilsService.smartConnection.checkType(item, connected, snView)) {
                checkUtilsService.pushError(snView, stackCode, report, 'WRONG_TYPE', parent, item, item.key);
                return false;
            }
        }
        return true;
    }
};

export const emailRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView,
        snModelUuid: string, item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {

        if (parent.type === 'SnEmailNode' && item.key === 'body') {
            const connected: SnParam = checkUtilsService.snUtils.findConnectedParam(snView, item);
            if (!connected && (item.value === '' || item.value === null || item.value === undefined)) {
                checkUtilsService.pushWarning(snView, stackCode, report, 'EMPTY_VALUE', parent, item, item.key);
            }
        }
        return true;
    }
};

export const emailRecipientRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView,
        snModelUuid: string, item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {

        if (parent.type === 'SnEmailNode' && item.key === 'profiles') {
            const itemDirect: SnParam = checkUtilsService.snUtils.getParamByKey('direct', parent);
            if (itemDirect.value === false) {
                if (item.value === '' || item.value === null || item.value === undefined) {
                    checkUtilsService.pushError(snView, stackCode, report, 'RECIPIENT_NOT_FOUND', parent, item, item.key);
                    return false;
                }
            }
        }
        if (parent.type === 'SnEmailNode' && item.key === 'adress') {
            const itemDirect: SnParam = checkUtilsService.snUtils.getParamByKey('direct', parent);
            if (itemDirect.value === true) {
                const connected: SnParam = checkUtilsService.snUtils.findConnectedParam(snView, item);
                if (!connected && (item.value === '' || item.value === null || item.value === undefined)) {
                    checkUtilsService.pushError(snView, stackCode, report, 'RECIPIENT_NOT_FOUND', parent, item, item.key);
                    return false;
                }
            }
        }
        return true;
    }
};

export const paramConnectedRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView,
        snModelUuid: string, item: SnParam, items: SnParam[], parent: SnNode, checkUtilsService: SnCheckUtilsService): boolean => {

        if (parent.type  === 'SnJsonNode' && item.direction === 'in') {
            const connected: SnParam = checkUtilsService.snUtils.findConnectedParam(snView, item);
            if (!connected) {
                checkUtilsService.pushError(snView, stackCode, report, 'SOURCE_NOT_CONNECTED', parent, item, item.key);
                    return false;
            }
        }

        if (parent.type === 'SnTransformNode' && item.direction === 'in') {
            const connected = checkUtilsService.snUtils.getParamsWithNode(snView).find(
                (ele) => ele.param === checkUtilsService.snUtils.findConnectedParam(snView, item));
            if (connected && connected.node.flows.length === 0 && connected.node.type !== 'SnDataNode' &&
                connected.node.type !== 'SnTransformNode') {
                checkUtilsService.pushError(snView, stackCode, report, 'CONNECTED_PARAM_NOT_FLOW', parent, item, item.key);
                    return false;
            }
        }

        return true;
    }
};

