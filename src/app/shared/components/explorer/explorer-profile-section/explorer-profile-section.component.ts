import { AuthService, LocalProfil } from '@algotech-ce/angular';
import { LangDto } from '@algotech-ce/core';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SessionDto } from '../../../dtos';
import { MessageService, SessionsService } from '../../../services';
import { StudioTranslationService } from '../../../services/translation/studio-translation.service';
import * as _ from 'lodash';
@Component({
    selector: 'app-explorer-profile-section',
    templateUrl: './explorer-profile-section.component.html',
    styleUrls: ['./explorer-profile-section.component.scss'],
})
export class ExplorerProfileSectionComponent implements OnChanges {

    @Input() expand: boolean;
    @Input() session: SessionDto;

    userProfile: LocalProfil;
    initials: string;
    showDetail = false;
    showLangs = false;
    languages: LangDto[];
    currentLang: LangDto;
    hasAdminPrivilege = false;

    constructor(
        private sessionsService: SessionsService,
        private authService: AuthService,
        private titleService: Title,
        private translateService: StudioTranslationService,
        private messageService: MessageService,
    ) {
        this.userProfile = this.authService.localProfil;
        this.initials = (this.getFirstLetter(this.userProfile.firstName) +
            this.getFirstLetter(this.userProfile.lastName)).toUpperCase();
        this.hasAdminPrivilege = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.expand) {
            this.showDetail = false;
            this.showLangs = false;
        }
        if (changes.session?.currentValue) {
            this.languages = this.session.datas?.read?.customer?.languages;
            this.currentLang = this.languages.find((lang) => lang.lang === this.translateService.currentLang);
        }
    }

    getFirstLetter(name: string) {
        if (!name || name.length === 0) {
            return '';
        }
        return name[0];
    }

    toggleHead() {
        if (this.expand) {
            this.showDetail = !this.showDetail;
            if (!this.showDetail) {
                this.showLangs = false;
            }
        }
    }

    toggleLangs() {
        this.showLangs = !this.showLangs;
    }

    adminConsole() {
        this.authService.adminConsole();
    }

    accountManager() {
        this.authService.accountConsole().subscribe();
    }
    logout() {

        this.authService.logout().subscribe(() => {
            this.titleService.setTitle('Vision Studio');
            this.sessionsService.disconnect(
                this.session.connection.host,
                this.session.connection.customerKey,
            );
        });
    }

    selectLang(lang: LangDto) {
        if (this.currentLang.lang !== lang.lang) {
            this.currentLang = lang;
            this.translateService.changeLang(lang.lang).subscribe(() =>
                this.messageService.send('save.preferences', {}));
            this.showLangs = false;
        }
    }

}
