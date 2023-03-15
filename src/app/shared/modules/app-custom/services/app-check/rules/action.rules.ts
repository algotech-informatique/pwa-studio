import { SnAppDto, SnPageDto, SnPageWidgetDto, SnViewDto } from '@algotech/core';
import { ValidationReportDto } from '../../../../../dtos';
import { AppRule } from '../../../../../models/check-rule.interface';
import { AppCheckUtilsService } from '../app-check-utils.service';
import * as _ from 'lodash';
import { ActionControl } from '../../../dto/action-control.dto';
import { EventWorkflowPairDto } from '../../../../inspector/dto/event-workflow-pair.dto';

export const actionUrlRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: ActionControl, checkUtilsService: AppCheckUtilsService): boolean => {
        if (item.pipe.type === 'url' && !item.pipe.action) {
            checkUtilsService.pushError(app, page, stackCode, report, 'APP.EVENT_URL_ERROR', {
                widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                item, path: item.path, openInspector: 'behavior'
            });
        }
        return true;
    }
};

export const actionSmartobjectsRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: ActionControl, checkUtilsService: AppCheckUtilsService): boolean => {
        if (item.pipe.type === 'smartobjects') {
            if (!item.pipe.action) {
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.EVENT_SMARTOBJECT_ERROR', {
                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                    item, path: item.path, openInspector: 'behavior'
                });
                return false;
            } else {
                if (!checkUtilsService.appCustomService.getModel(`so:${item.pipe.action}`)) {
                    checkUtilsService.pushError(app, page, stackCode, report, 'APP.EVENT_SMARTOBJECT_NO_FIND_ERROR', {
                        widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                        item, path: item.path, openInspector: 'behavior'
                    });
                    return false;
                }
            }
        }
        return true;
    }
};

export const actionloadRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: ActionControl, checkUtilsService: AppCheckUtilsService): boolean => {
        if (item.pipe.type === 'call::onLoad') {
            if (!item.pipe.action) {
                checkUtilsService.pushError(app, page, stackCode, report, 'APP.EVENT_RELOAD_ERROR', {
                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                    item, path: item.path, openInspector: 'behavior'
                });
                return false;
            } else {
                const findPage: SnPageDto = (item.type === 'widget') ?
                    checkUtilsService.pageUtils.findPage(app, item.element as SnPageWidgetDto) : item.element as SnPageDto;
                const findIndex = _.findIndex(checkUtilsService.pageUtils.getWidgets(app, findPage), (wid: SnPageWidgetDto) => wid.id === item.pipe.action);
                if (findIndex === -1) {
                    checkUtilsService.pushError(app, page, stackCode, report, 'APP.EVENT_RELOAD_NOT_FIND_ERROR', {
                        widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                        item, path: item.path, openInspector: 'behavior'
                    });
                    return false;
                }
            }
        }
        return true;
    }
};

export const actionSmartflowworkflowRule: AppRule = {
    check: (stackCode: string, report: ValidationReportDto, app: SnAppDto, page: SnPageDto, item: ActionControl, checkUtilsService: AppCheckUtilsService): boolean => {
        let error = false;
        if (['smartflow', 'workflow'].indexOf(item.pipe.type) != -1) {
            const mode = item.pipe.type.toUpperCase();
            if (!item.pipe.action) {
                checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_${mode}_ERROR`, {
                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                    item, path: item.path, openInspector: 'behavior'
                });
                error = true;
            } else {
                const model = checkUtilsService.appCustomService.getSnModel(item.pipe.type, item.pipe.action);
                if (!model) {
                    checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_${mode}_NO_FIND_ERROR`, {
                        widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                        item, path: item.path, openInspector: 'behavior'
                    });
                    error = true;
                }
                const view = checkUtilsService.snModels.getPublishedView(model) as SnViewDto;
                if (view?.options?.variables && view.options.variables.length !== 0) {
                    view.options.variables.forEach((variable) => {
                        const index = _.findIndex(item.pipe.inputs, (input) => input.key === variable.key);
                        if (index !== -1 && item.pipe.inputs[index].value == null) {
                            error = true;
                            checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_${mode}_NO_VARIABLE_ERROR`, {
                                widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                                item, path: item.path, openInspector: 'behavior'
                            });
                        }
                    });
                }

                if (mode === 'WORKFLOW') {
                    item.pipe?.custom?.pair.forEach((pair: EventWorkflowPairDto) => {
                        for (const profile of pair.profiles) {
                            if (profile.groups.length === 0) {
                                error = true;
                                checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_WORKFLOW_NO_PROFILE_ERROR`, {
                                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : null,
                                    item, path: item.path, openInspector: 'behavior'
                                });
                            }
                        }
                    });
                }
            }
        }
        return !error;
    }
};

export const actionPageRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: ActionControl,
        checkUtilsService: AppCheckUtilsService,
    ): boolean => {
        if (item.pipe.type === 'page') {
            if (!item.pipe.action) {
                checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_ERROR`, {
                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                    item, path: item.path, openInspector: 'behavior'
                });
                return false;
            } else {
                const findPage = _.findIndex(app.pages, (p: SnPageDto) => p.id === item.pipe.action);
                if (findPage === -1) {
                    checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NO_FIND_ERROR`, {
                        widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                        item, path: item.path, openInspector: 'behavior'
                    });
                    return false;
                } else if (app.pages[findPage].variables?.length > 0) {
                    const emptyInput = item.pipe.inputs.some((input) => input.value === null);
                    if (emptyInput) {
                        checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NO_INPUT_ERROR`, {
                            widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                            item, path: item.path, openInspector: 'behavior'
                        });
                    }
                }
            }
        }
        return true;
    }
};

export const actionPageNavRule: AppRule = {
    check: (
        stackCode: string,
        report: ValidationReportDto,
        app: SnAppDto,
        page: SnPageDto,
        item: ActionControl,
        checkUtilsService: AppCheckUtilsService
    ): boolean => {
        if (item.pipe.type === 'page::nav') {
            if (!item.pipe.action) {
                checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NAV_ERROR`, {
                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                    item, path: item.path, openInspector: 'behavior'
                });
                return false;
            } else {
                const model = checkUtilsService.appCustomService.getSnModel('app', item.pipe.action);
                if (!model) {
                    checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NAV_NO_FIND_ERROR`, {
                        widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                        item, path: item.path, openInspector: 'behavior'
                    });
                    return false;
                } else {
                    if (!model.publishedVersion) {
                        checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NAV_NO_PUBLISHED`, {
                            widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                            item, path: item.path, openInspector: 'behavior'
                        });
                        return false;
                    }
                    if (item.pipe.custom?.page) {
                        const appNav = checkUtilsService.snModels.getPublishedView(model) as SnAppDto;
                        const findPage = appNav.pages.findIndex((p: SnPageDto) => p.id === item.pipe.custom.page);
                        if (findPage === -1) {
                            checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NAV_PAGE_NO_FIND_ERROR`, {
                                widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                                item, path: item.path, openInspector: 'behavior'
                            });
                            return false;
                        } else if (appNav.pages[findPage].variables?.length > 0) {
                            const emptyInput = item.pipe.inputs.some((input) => input.value === null);
                            if (emptyInput) {
                                checkUtilsService.pushError(app, page, stackCode, report, `APP.EVENT_PAGE_NAV_PAGE_NO_INPUT_ERROR`, {
                                    widget: (item.type === 'widget') ? item.element as SnPageWidgetDto : undefined,
                                    item, path: item.path, openInspector: 'behavior'
                                });
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
};
