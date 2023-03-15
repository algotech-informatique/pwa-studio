import { EMailDto, PairDto, WorkflowModelDto, SmartLinkDto, WorkflowVariableModelDto } from '@algotech/core';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';
import * as _ from 'lodash';
import { ToastService } from '../../../services';
import { TranslateService } from '@ngx-translate/core';
import { SmartLinkExService } from '../smart-link.service';
import { ListItem } from '../../../modules/inspector/dto/list-item.dto';

@Component({
    selector: 'app-smart-link',
    styleUrls: ['./smart-link.component.scss'],
    templateUrl: './smart-link.component.html',
})
export class SmartLinkComponent implements OnInit {

    @Input() snView: SnView;
    @Input() workFlow: WorkflowModelDto;
    @Input() customerKey: string;
    @Input() host: string;

    @Output() close = new EventEmitter();

    variables: WorkflowVariableModelDto[] = [];
    situationLink: 'CREATION' | 'SHARE' = 'CREATION';
    linkInfo: SmartLinkDto;
    link: string;
    eMail: EMailDto;

    backupList: PairDto[];
    radioList: ListItem[];

    constructor(
        private smartlinkService: SmartLinkExService,
        private toastService: ToastService,
        private translateService: TranslateService,
        private ref: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        const exclude = ['current-user'];
        this.backupList = this.smartlinkService.createAsapEndList();
        this.radioList = _.map(this.backupList, (bck: PairDto) => {
            const rl: ListItem = {
                key: bck.key,
                value: bck.value,
            };
            return rl;
        });
        this.variables = _.reject(this.workFlow.variables, ((v) => exclude.includes(v.key)));

        this.linkInfo = this.smartlinkService.openSmartLink(this.snView, 'workflow', this.workFlow.key);
        this.eMail = this.smartlinkService.createMail(this.workFlow, this.link);
        this.creationLink();
        this.ref.detectChanges();
    }

    onBackEvent() {
        this.situationLink = 'CREATION';
    }

    onUpdateLinkInfo(smartLink: SmartLinkDto) {
        this.linkInfo = _.cloneDeep(smartLink);
        this.smartlinkService.updateLinkInfo(this.snView, this.linkInfo);
        this.creationLink();
    }

    onClose(event) {
        this.close.emit(event);
    }

    creationLink() {
        if (this.workFlow) {
            if (this.linkInfo.sources.length !== this.variables.length ||
                this.linkInfo.sources.some((v) => this._isNullValue(v.value))) {
                this.link = '';
                return ;
            }
        }

        this.smartlinkService.createLink(this.linkInfo, this.host, this.customerKey).pipe().subscribe({
            next: (textLink: string) => {
                this.link = textLink;
                this.eMail.linkedFiles = [this.link];
            },
            error: (err) => {
                this.toastService.addToast('error', '', this.translateService.instant('SMARTLINK-LINK.ERROR-CREATE-LINK'), 2000);
            },
        });
    }

    _isNullValue(value: any): boolean {
        return (value === '' || value === undefined || value === null) ?
            true :
            false;
    }

    openMail() {
        this.situationLink = 'SHARE';
    }

    onUpdateMail(mail) {
        this.eMail = mail;
    }

    onSendMail() {
        this.smartlinkService.sendMail(this.eMail).pipe()
            .subscribe((result) => {
                if (result) {
                    this.toastService.addToast('info', '', this.translateService.instant('SMARTLINK-LINK.LINK-MAIL-CREATED'), 2000);
                    this.close.emit(null);
                } else {
                    this.toastService.addToast('error', '', this.translateService.instant('SMARTLINK-LINK.LINK-MAIL-CREATED'), 2000);
                }
        });
    }

}
