import { ListItem } from './../dto/list-item.dto';
import { SnTranslateService } from './../../smart-nodes/services/lang/sn-translate/sn-translate.service';
import { SessionsService } from './../../../services/sessions/sessions.service';
import {
    SnModelDto, SnVersionDto, SnViewDto, SnPageDto, SnAppDto, SmartModelDto,
    SnPageWidgetDto, SnPageEventDto, WorkflowVariableModelDto
} from '@algotech/core';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { getAutoInputsEvents } from '../../app-custom/widgets/_data/data';
import { InspectorSectionButton } from '../dto/inspector-section-button.dto';
import { TranslateService } from '@ngx-translate/core';
import { PageUtilsService, PageWidgetService } from '../../app/services';

@Injectable()
export class PageWidgetParametersService {

    constructor(
        private sessionsService: SessionsService,
        private translate: SnTranslateService,
        private translateService: TranslateService,
        private pageUtilsService: PageUtilsService
    ) { }

    getModelsList(eventKey: string, type: string): ListItem[] {
        const autoInputs = getAutoInputsEvents(type, eventKey, false);
        const list = _.orderBy(_.reduce(this.sessionsService.active.datas.write.snModels, (res: ListItem[], snModel: SnModelDto) => {
            if (snModel.type === type && snModel.publishedVersion) {
                const publishedVersion: SnVersionDto = _.find(snModel.versions, { uuid: snModel.publishedVersion });
                if (publishedVersion && !(publishedVersion.view as SnViewDto).options?.subWorkflow) {
                    const key = snModel.key;
                    const options = (publishedVersion.view as SnViewDto).options;
                    const variables: WorkflowVariableModelDto[] = options?.variables ? options.variables : [];
                    const item: ListItem = {
                        key,
                        value: this.translate.transform(snModel.displayName),
                        icon: options?.iconName,
                        order: variables.filter((v) => autoInputs.includes(v.key)).length,
                    };
                    res.push(item);
                }
            }
            return res;
        }, []), 'order', 'desc');
        return list;
    }

    getPagesList(app: SnAppDto): ListItem[] {
        return app.pages.map((page: SnPageDto) =>
        ({
            key: page.id,
            value: this.translate.transform(page.displayName),
            icon: page.main ? 'fa-solid fa-home' : '',
        })
        );
    }

    getSmartModels(): ListItem[] {
        return _.orderBy(_.map(this.sessionsService.active.datas.read.smartModels, (smartModel: SmartModelDto) =>
        ({
            key: smartModel.key,
            value: this.translate.transform(smartModel.displayName),
            upperCase: this.translate.transform(smartModel.displayName).toUpperCase(),
        })
        ), 'upperCase');
    }

    getPageWidgets(app: SnAppDto, page: SnPageDto): ListItem[] {
        return _.reduce(
            this.pageUtilsService.getWidgets(app, page)
                .filter((widget) => !PageWidgetService.getType(widget).hidden), (res: ListItem[], widget: SnPageWidgetDto) => {
                    res.push({
                        key: widget.id,
                        value: widget.name,
                        element: widget,
                    });
                    return res;
                }, []);
    }

    getPublishedApplications(application: SnAppDto): ListItem[] {
        return _.orderBy(this.sessionsService.active.datas.write.snModels.reduce((result: ListItem[], app) => {
            if ((app.type === 'app') && (app.uuid !== application.id) && app.publishedVersion &&
                ((app.versions[0].view as SnAppDto).environment === application.environment)) {
                const item: ListItem = {
                    key: app.key,
                    value: this.translate.transform(app.displayName),
                };
                result.push(item);
            }
            return result;
        }, []), (appItem: ListItem) => appItem.value.toUpperCase());
    }

    getEventModes(event: SnPageEventDto): InspectorSectionButton {
        if (event.custom?.mode) {
            return {
                title: this.translateService.instant('INSPECTOR.WIDGET.EVENT.WORKFLOWS.LIST'),
                icon: 'fa-solid fa-list-ul',
                selected: event.custom?.mode === 'list',
                onKey: 'list',
                offKey: 'sequence',
            };
        }
        return null;
    }

    getWfSaveModes(type: string): ListItem[] {
        if (type !== 'workflow') {
            return null;
        }
        return [
            { key: 'END', value: this.translateService.instant('SETTINGS.WORKFLOWS.UPDATE.END') },
            { key: 'ASAP', value: this.translateService.instant('SETTINGS.WORKFLOWS.UPDATE.ASAP') },
        ];
    }

}
