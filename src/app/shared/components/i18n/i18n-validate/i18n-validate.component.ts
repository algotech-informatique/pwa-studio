import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { I18nImportService } from '@algotech-ce/angular';
import { SessionsService, ToastService } from '../../../services';
import { TranslateService } from '@ngx-translate/core';
import { LangDto } from '@algotech-ce/core';
import { I18nValidateFileService } from '../services/i18n-validate-file.service';
import { StatusFile } from '../interfaces/status-import.enum';

@Component({
    selector: 'app-i18n-validate',
    templateUrl: './i18n-validate.component.html',
    styleUrls: ['./i18n-validate.component.scss'],
})
export class I18nValidateComponent {
    @ViewChild('selectFileXLS') selectFileXLS: ElementRef;

    @Input() activate = false;
    @Output() activateSpinner = new EventEmitter<boolean>();
    @Output() launchImportation = new EventEmitter();

    clearLog = 'validate-data-clear-log';
    inputLog = 'validate-data-input-log';
    customerLangs: LangDto[] = [];
    file: File;
    inactiveImportation = true;

    constructor(
        private i18nService: I18nImportService,
        private toastMessage: ToastService,
        private translateService: TranslateService,
        private i18nValidateFile: I18nValidateFileService,
        private sessionService: SessionsService,
    ) {
        this.customerLangs = this.sessionService.active.datas.read.customer.languages;
    }

    executeAction(event: any) {
        this.inactiveImportation = true;
        if (event?.target?.files[0]) {
            this.activateSpinner.emit(false);
            this.file = event.target.files[0];
            this.selectFileXLS.nativeElement.value = null;
            this.i18nValidateFile.validateImportationFile(this.file, this.inputLog, this.clearLog, this.customerLangs).subscribe({
                next: (data: StatusFile) => {
                    if (data === StatusFile.ok) {
                        this.toastMessage.addToast('success', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.VALIDATED-OK'), 3000);
                        this.onLaunchImportation();
                    }
                    if (data === StatusFile.warning) {
                        this.inactiveImportation = false;
                        this.toastMessage.addToast('warning', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.VALIDATED'), 3000);
                    }
                    if (data === StatusFile.error) {
                        this.toastMessage.addToast('error', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.VALIDATED.ERROR'), 3000);
                    }
                    if (data === StatusFile.nothing) {
                        this.toastMessage.addToast('info', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.VALIDATED.NOTHING'), 3000);
                    }
                    this.activateSpinner.emit(true);
                },
                error: (err) => {
                    this.toastMessage.addToast('error', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.VALIDATED.ERROR-VAL'), 3000);
                    this.activateSpinner.emit(true);
                }
            });
        }
    }

    createTemplate() {
        this.activateSpinner.emit(false);
        this.i18nService.exportI18nFile(true).subscribe({
            next: (data: boolean) => {
                this.toastMessage.addToast('success', '', this.translateService.instant('INSPECTOR.I18N.EXPORT-FILE.ACTION'), 3000);
                this.activateSpinner.emit(true);
            },
            error: (err: Error) => {
                this.toastMessage.addToast('error', '', this.translateService.instant('INSPECTOR.I18N.EXPORT-FILE.ERROR'), 3000);
                this.activateSpinner.emit(true);
            }
        });
    }

    onLaunchImportation() {
        if (this.file) {
            this.inactiveImportation = true;
            this.i18nValidateFile.clearMessage(this.clearLog);
            this.i18nValidateFile.importMessage(this.inputLog, 'INSPECTOR.I18N.IMPORT-FILE.ACTION-MESSAGE', false, false);
            this.toastMessage.addToast('success', '', this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.ACTION'), 3000);
            this.i18nService.importI18nFile(this.file).subscribe({
                next: (data: boolean) => {
                    if (data) {
                        this.launchImportation.emit();
                    } else {
                        this.i18nValidateFile.importMessage(this.inputLog, 'INSPECTOR.I18N.IMPORT-FILE.NO-DATA', false, true);
                        this.toastMessage.addToast('warning', '',
                            this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.NO-DATA'), 3000);
                    }
                },
                error: (err: Error) => {
                    this.toastMessage.addToast('error', '', this.translateService.instant('INSPECTOR.I18N.IMPORT-FILE.ERROR'), 3000);
                }
            });
        }
    }
}
