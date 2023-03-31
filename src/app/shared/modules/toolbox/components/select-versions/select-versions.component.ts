import { SnAppDto, SnModelDto, SnVersionDto, SnViewType } from '@algotech-ce/core';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { VersionEventDto } from '../../../../dtos/version-event.dto';
import { DatasService, DialogMessageService, SessionsService, SnModelsService } from '../../../../services';

interface History {
    version: SnVersionDto;
    active: boolean;
};
@Component({
    selector: 'select-versions',
    templateUrl: './select-versions.component.html',
    styleUrls: ['./select-versions.component.scss'],
})
export class SelectVersionsComponent implements AfterViewInit, OnChanges {

    @Input()
    snModel: SnModelDto;

    @Input()
    snView: SnViewType;

    @Output()
    viewChanged = new EventEmitter<SnViewType>();

    history: History[];

    open = false;

    constructor(
        private dialogMessageService: DialogMessageService,
        private translate: TranslateService,
        private sessionsService: SessionsService,
        private datasService: DatasService,
        private ref: ChangeDetectorRef,
        private snModelsService: SnModelsService) {
    }

    ngAfterViewInit()  {
        this.calculHistory();
    }

    ngOnChanges() {
        this.calculHistory();
    }

    calculHistory() {
        this.history = this.snModel.versions
        .filter((version) => !version.deleted)
        .map((version) => ({
            version,
            active: this.snView.id === version.view.id,
        }));
    }

    openSelect($event: Event) {
        $event.stopPropagation();
        this.calculHistory();
        this.open = !this.open;
    }

    selectItem(item: History) {
        this.open = false;
        this.snModelsService.updateActiveVersion(this.snModel, item.version.uuid);
        this.versionChanged({ type: 'select', version: item.version });
    }

    addVersion() {
        this.versionChanged({ type: 'add', version: this.snView });
    }

    removeVersion($event, item: History) {
        $event.stopPropagation();
        this.dialogMessageService.getMessageConfirm({
            title: this.translate.instant('SN-DELETE-VERSION-TITLE'),
            message: this.translate.instant('SN-DELETE-VERSION-MESSAGE'),
            detail: this.translate.instant('SN-DELETE-VERSION-DETAIL'),
            confirm: this.translate.instant('SN-DELETE-CONFIRM'),
            cancel: this.translate.instant('SN-DELETE-CANCEL'),
            type: 'warning',
            messageButton: true,
        }).pipe()
        .subscribe((data: boolean) => {
            if (data) {
                this.versionChanged({ type: 'remove', version: item.version });
            }
        });
    }

    versionChanged(event: VersionEventDto) {
        const newView: SnAppDto = this.snModelsService.actionVersion(
            event.type, event.version, this.snModel, this.snView, this.sessionsService.active.connection.login
        ) as SnAppDto;

        this.open = false;
        this.calculHistory();
        this.ref.detectChanges();

        if (newView.id !== this.snView.id) {
            this.viewChanged.emit(newView);
        }

        const customerKey = this.sessionsService.active.connection.customerKey;
        const host = this.sessionsService.active.connection.host;

        this.datasService.notifyChangeView(customerKey, host, newView.id);

        if (event.type !== 'select') {
            this.datasService.notifySNModel(this.snModel, customerKey, host);
        }
    }
}
