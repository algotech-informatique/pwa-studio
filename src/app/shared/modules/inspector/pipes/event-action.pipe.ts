import { SessionsService } from './../../../services/sessions/sessions.service';
import { TranslateLangDtoService } from '@algotech-ce/angular';
import { SnModelDto, SmartModelDto, SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
import { AppCustomService } from '../../app-custom/services';

@Pipe({ name: 'eventAction' })
export class EventActionPipe implements PipeTransform {

    constructor(
       private translateLangDtoService: TranslateLangDtoService,
       private sessionsService: SessionsService,
       private appCustomService: AppCustomService,
    ) { }

    transform(action: string, type: string, app: SnAppDto, page: SnPageDto): string {
        switch (type) {
            case 'workflow':
            case 'smartflow':
                const snModel: SnModelDto = this.appCustomService.getSnModel(type, action);
                return snModel?.displayName ? this.translateLangDtoService.transform(snModel.displayName) : action;
            case 'call::onLoad':
                const widget: SnPageWidgetDto = _.find(page.widgets, { id: action });
                return widget ? widget.name : action;
            case 'page':
                const appPage: SnPageDto = _.find(app.pages, { id: action });
                return appPage?.displayName ? this.translateLangDtoService.transform(appPage.displayName) : action;
            case 'url':
                return action;
            case 'smartobjects':
                const smartModel: SmartModelDto = _.find(this.sessionsService.active.datas.read.smartModels, { key: action });
                return smartModel?.displayName ? this.translateLangDtoService.transform(smartModel.displayName) : action;
            default:
                return action;
        }
    }

}
