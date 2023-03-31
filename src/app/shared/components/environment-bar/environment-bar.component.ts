import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionDto } from '../../dtos';
import { MessageService } from '../../services';
import * as _ from 'lodash';
import { SnModelDto, SnViewDto } from '@algotech-ce/core';
import { StudioTranslationService } from '../../services/translation/studio-translation.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-environment-bar',
    templateUrl: './environment-bar.component.html',
    styleUrls: ['./environment-bar.component.scss']
})
export class EnvironmentBarComponent implements OnInit, OnDestroy {

    activeSession: SessionDto;
    smartflows: number;
    smartmodels: number;
    reports: number;
    workflows: number;
    apps: number;
    environment: string;
    showLanguages = false;
    proposedLanguages = [];
    currentLang: string;
    subscription: Subscription;

    constructor(
        public messageService: MessageService,
        private translateService: StudioTranslationService,
    ) {
        this.currentLang = this.translateService.currentLang;
        this.proposedLanguages = this.translateService.acceptedLanguages.filter(l => l !== this.translateService.currentLang);
    }

    ngOnInit(): void {
        this.subscription = this.messageService.get('session-change').subscribe((session: SessionDto) => {
            this.totalizeElements(session);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    totalizeElements(session: SessionDto) {
        this.activeSession = session;
        this.environment = session.connection.name;
        this.smartflows = _.filter(this.activeSession.datas.write.snModels, (model: SnModelDto) => model.type === 'smartflow').length;
        this.workflows = _.filter(this.activeSession.datas.write.snModels, (model: SnModelDto) => model.type === 'workflow').length;
        this.reports = _.filter(this.activeSession.datas.write.snModels, (model: SnModelDto) => model.type === 'report').length;
        this.apps = _.filter(this.activeSession.datas.write.snModels, (model: SnModelDto) => model.type === 'app').length;
        const smartModel: SnModelDto =
            _.find(this.activeSession.datas.write.snModels, (model: SnModelDto) => model.type === 'smartmodel');
        this.smartmodels = smartModel ? (smartModel.versions[0].view as SnViewDto).nodes.length : 0;
    }

    openConnection() {
        this.messageService.send('env-bar-open-connection', {});
    }

    openChooseLanguage() {
        this.proposedLanguages = this.translateService.acceptedLanguages.filter(l => l !== this.translateService.currentLang);
        this.showLanguages = !this.showLanguages;
    }

    chooseLang(lang: string) {
        this.translateService.changeLang(lang).subscribe();
    }
}
