import { ToastService } from '../../../services';
import { EMailDto, PairDto, SnAppDto, SnModelDto } from '@algotech-ce/core';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SmartLinkAppExService } from '../smart-link-app.service';
import { OptionsElementDto } from 'src/app/shared/dtos/options-element.dto';
import { TranslateLangDtoService } from '@algotech-ce/angular';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'smart-link-app',
    templateUrl: './smart-link-app.component.html',
    styleUrls: ['./smart-link-app.component.scss'],
})
export class SmartLinkAppComponent implements OnInit, AfterViewInit {

    @Input() snApp: SnAppDto;
    @Input() snModel: SnModelDto;
    @Input() customerKey: string;
    @Input() host: string;
    @Output() endSmartLink = new EventEmitter<string>();

    situationLink: 'CREATION' | 'SHARE' = 'CREATION';
    link: string;
    eMail: EMailDto;
    listPages: OptionsElementDto[];
    mainPageId: string;
    selectedPage: OptionsElementDto;
    selectedVariables: string[];
    pageVariables: PairDto[];

    constructor(
        private translateService: TranslateService,
        private toastService: ToastService,
        private smartLinkAppService: SmartLinkAppExService,
        private ref: ChangeDetectorRef,
        private translateLangDto: TranslateLangDtoService,
    ) { }

    ngOnInit() {
        this.listPages = this.snApp.pages.map(page => ({
            key: page.id,
            value: this.translateLangDto.transform(page.displayName),
            icon: page.main ? 'fa-solid fa-house' : null,
        }));
        this.mainPageId = this.snApp.pages.find(page => page.main)?.id;
        this.selectedPage = this.listPages.find(page => page.key === this.mainPageId);
        this.listVariables();
    }

    ngAfterViewInit() {
        this.eMail = this.smartLinkAppService.createMail(this.snModel, this.link);
        this._creationLink();
        this.ref.detectChanges();
    }

    onBackEvent() {
        this.situationLink = 'CREATION';
    }

    onClose(event) {
        this.endSmartLink.emit(this.link);
    }

    openMail() {
        this.situationLink = 'SHARE';
    }

    onUpdateMail(mail) {
        this.eMail = mail;
    }

    onSendMail() {
        this.smartLinkAppService.sendMail(this.eMail).pipe()
            .subscribe((result) => {
                if (result) {
                    this.toastService.addToast('info', '', this.translateService.instant('SMARTLINK-LINK-APP.LINK-MAIL-CREATED'), 2000);
                    this.endSmartLink.emit(this.link);
                } else {
                    this.toastService.addToast('error', '', this.translateService.instant('SMARTLINK-LINK-APP.ERROR-CREATE-MAIL'), 2000);
                }
        });
    }

    _creationLink() {
        this.link = this.smartLinkAppService.createLink(this.snModel, this.host, this.customerKey, this.selectedPage?.key,
            this.pageVariables, this.selectedPage?.key === this.mainPageId);
        this.eMail.linkedFiles = [this.link];
        if(!this.link) {
            this.toastService.addToast('error', '', this.translateService.instant('SMARTLINK-LINK-APP.ERROR-CREATE-LINK'), 2000);
        }
    }

    onSelectPage(pageOption: OptionsElementDto) {
        this.selectedPage = this.listPages.find(page => page.key === pageOption.key);
        this.listVariables();
        this._creationLink();
    }

    onChangeVariable(variableChecked: boolean, index: number) {
        this.pageVariables[index].value = variableChecked;
        this._creationLink();
    }

    private listVariables() {
        const appPage = this.snApp.pages.find(page => page.id === this.selectedPage.key);
        this.pageVariables = appPage.variables.map(v => ({ key: v.key, value: false }));
    }

}
