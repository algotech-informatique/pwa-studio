import { AuthService, EnvService } from '@algotech-ce/angular';
import { SnAppDto, SnModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { SessionsService } from '../../../../services';
import { AppPublishService } from '../app-publish/app-publish.service';
import * as _ from 'lodash';

@Injectable()
export class AppDebugService {
    environment: any;
    constructor(
        private authService: AuthService,
        private envService: EnvService,
        private appPublish: AppPublishService,
        private sessionsService: SessionsService,
    ) {
            this.envService.environment.subscribe((environment) => {
                this.environment = environment;
            });
    }

    run(snModel: SnModelDto, snApp: SnAppDto) {
        const apps = this.sessionsService.active.datas.read.apps.map(a => _.clone(a));
        const appModel = this.appPublish.getApp(snApp, snModel, 0);
        const appIndex = apps.findIndex(app => app.appId === appModel.appId);
        if (appIndex === -1) {
            apps.push(appModel);
        } else {
            apps[appIndex] = appModel;
        }

        const detail = {
            environment: this.environment,
            localProfil: this.authService.localProfil,
            glists: this.sessionsService.active.datas.read.glists,
            groups: this.sessionsService.active.datas.read.groups,
            settings: this.sessionsService.active.datas.read.settings,
            smartmodels: this.sessionsService.active.datas.read.smartModels,
            workflows: this.sessionsService.active.datas.read.workflows,
            tags: this.sessionsService.active.datas.read.tags,
            appModel,
            snApp: appModel.snApp,
            apps,
            typeApp: snModel.type,
        };

        const width = Math.min(screen.width, (snApp).pageWidth);
        const height = Math.min(screen.height, (snApp).pageHeight);
        const top = window.screenY + (screen.height / 2) - (height / 2);
        const left = window.screenX + (screen.width / 2) - (width / 2);

        const win = window.open(`app/${snModel.key}`, '_blank');
        // win.moveTo(left, top);

        window.addEventListener('message', (ev) => {
            if (ev.origin !== window.location.origin) { return; }
            win?.postMessage(detail, window.location.origin);
        });
    }

}
