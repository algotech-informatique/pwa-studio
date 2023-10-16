import { SnViewDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { ValidationReportDto } from '../../../../../../dtos';
import { SnViewRule } from '../../../../../../models/check-rule.interface';
import { SnView } from '../../../../../smart-nodes/models';
import { SnCheckUtilsService } from '../../check-utils';

export const flowOptIncorrectVarRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item, items, parent, checkUtilsService: SnCheckUtilsService): boolean => {
        let error = false;
        if (snView.options?.variables) {
            const variables: WorkflowVariableModelDto[] = snView.options.variables;
            variables.forEach((variable) => {
                const keyExists: boolean = variables.some((v) => variable.key === v.key && variable.uuid !== v.uuid);
                if (!variable.key || !variable.type || keyExists) {
                    error = true;
                    snView.displayState.errors.push(`variable.${variable.uuid}`);

                    checkUtilsService.pushError(snView, stackCode, report, 'VARIABLE_INCORRECT', null, variable, variable.key, 'inspector');
                }
            });

            const body = variables.find((v) => v.use === 'body');
            if (body) {
                const simpleVariables = variables.filter((v) => !v.use);
                if (simpleVariables?.length > 0) {
                    simpleVariables.forEach((simpVar) => {
                        error = true;
                        snView.displayState.errors.push(`variable.${simpVar.uuid}`);
                        checkUtilsService.pushError(snView, stackCode, report, 'VARIABLE_INCORRECT', null, simpVar, simpVar.key, 'inspector');
                    });
                    error = true;
                    snView.displayState.errors.push(`variable.${body.uuid}`);
                    checkUtilsService.pushError(snView, stackCode, report, 'VARIABLE_INCORRECT', null, body, 'inspector');
                }
            }
        }
        return !error;
    }
};

export const flowOptIncorrectApiRule: SnViewRule = {
    check: (stackCode: string,
        report: ValidationReportDto,
        snView: SnView, snModelUuid: string, item, items, parent, checkUtilsService: SnCheckUtilsService): boolean => {
        if (snView.options?.api) {
            const index = checkUtilsService.sessionsService.active.datas.write.snModels.findIndex((snModel) => {
                const publishedVersion = checkUtilsService.snModelsService.getPublishedView(snModel) as SnViewDto;
                if (publishedVersion && snModel.uuid !== snModelUuid && publishedVersion.options?.api) {
                    return publishedVersion.options.api.route === snView.options.api.route &&
                        publishedVersion.options.api.type === snView.options.api.type;
                }
                return false;
            });
            if (index > -1) {
                snView.displayState.errors.push('api.type');
                const key = snView.options.api.route + ' ' + snView.options.api.key;
                checkUtilsService.pushError(snView, stackCode, report, 'API_VERB_INCORRET', null, snView.options.api.type, key, 'inspector');
                return false;
            }
        }
        return true;
    }
};

