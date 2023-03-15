import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService, SessionsService, ToastService } from '../../../../services';
import { ImportDataDocDto } from '../../dto/import-data-doc.dto';
import { ValidateDataFileDto } from '../../dto/validate-data-file.dto';
import { ValidateImportContainerDto } from '../../dto/validate-container.dto';
import { ImportDataService } from '../../services/import-data.service';
import { ImportDataFileDto } from '../../dto/import-data-file.dto';
import { LaunchImportService } from '../../../../services/import-data/launch-import/launch-import.service';
import { ValidateImportDataDto } from '../../dto/validate-import-data.dto';
import * as _ from 'lodash';
import moment from 'moment'; 

@Component({
    selector: 'launch-import-data',
    templateUrl: './launch-import-data.component.html',
    styleUrls: ['./launch-import-data.component.scss'],
})
export class LaunchImportDataComponent implements OnChanges {

    @Input() activate: boolean;
    @Input() importDataFile: ImportDataFileDto[] = [];
    @Input() validateDataFile: ValidateDataFileDto[] = [];
    @Input() validateImportContainer: ValidateImportContainerDto[] = [];
    @Input() importDocs: ImportDataDocDto[] = [];
    @Input() replaceData = false;
    @Input() fileZip: File;

    @Output() activateSpinner = new EventEmitter<boolean>();

    inputInfoLog = 'valide_import-data-input-log';
    clearInfoLog = 'valide_import-data-clear-log';

    importInputLog = 'lauch_import-data-input-log';
    importClearLog = 'lauch_import-data-clear-log';

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
        private importService: ImportDataService,
        private sessionService: SessionsService,
        private launchImportService: LaunchImportService,
        private ref: ChangeDetectorRef,
        private toastMessage: ToastService,
    ) { }

    ngOnChanges() {
        this._loadMessageImport();
        this.ref.detectChanges();
    }

    onLaunchImportData() {
        this.activateSpinner.emit(false);

        this.launchImportService.importData(this.importDataFile, this.validateImportContainer, this.validateDataFile, this.replaceData,
            this.fileZip, this.importInputLog, this.importClearLog).pipe().subscribe(
                (result: ValidateImportDataDto[]) => {
                    const valide = !_.some(result, (val: ValidateImportDataDto) => val.valide === false);
                    const message = (valide) ?
                            this.translateService.instant('IMPORT-DATA.LAUNCH-IMPORT-DATA-END-OK') :
                            this.translateService.instant('IMPORT-DATA.LAUNCH-IMPORT-DATA-END-KO');

                    this.toastMessage.addToast(valide ? 'success' : 'error', '', message, 1500);
                    this.importService.sendMessageService(this.importInputLog, message, !valide);
                    this.importDataFile = [];
                    this.activateSpinner.emit(true);

            });
    }

    _loadMessageImport() {

        this.messageService.send(this.clearInfoLog, {});
        this.messageService.send(this.importClearLog, {});

        if (!this.validateDataFile) {
            return;
        }

        const valide = !_.some(this.validateDataFile, (val: ValidateDataFileDto) => val.valide === false);
        if (!valide) {
            return;
        }

        moment.locale(this.sessionService.active.datas.read.localProfil.preferedLang);
        const date = moment().format('L');
        const time = moment().format('LT');
        this.importService.sendMessageService(this.inputInfoLog,
            this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-AT', {date, time }), false);
        this.importService.sendMessageService(this.inputInfoLog, '#', false);

        const imports: string[] = this.importService.returnListElements(this.validateDataFile, 'object');
        if (imports.length !== 0) {
            this.importService.sendMessageService(this.inputInfoLog,
                this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-DATA', { imports: this._joinLines(imports) }), false);
        }

        const lists: string[] = this.importService.returnListElements(this.validateDataFile, 'list');
        if (lists.length !== 0) {
            this.importService.sendMessageService(this.inputInfoLog,
                this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-LIST', { lists: this._joinLines(lists) }), false);
            this.importService.sendMessageService(this.inputInfoLog, '#', false);
        }

        const docs: number = this.importService.returnListDocs(this.validateDataFile, 'document');
        const index: string[] = [];
        if (docs !== 0) {
            this.importService.sendMessageService(this.inputInfoLog,
                this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-DOCS', { docs, index: index.length }), false);
            this.importService.sendMessageService(this.inputInfoLog, '#', false);

        }

        const containers: string[] = (this.validateImportContainer && this.validateImportContainer.length !== 0)
            ? _.map(this.validateImportContainer, (cont: ValidateImportContainerDto) => cont.key) : [];
        if (containers.length !== 0) {
            this.importService.sendMessageService(this.inputInfoLog,
                this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-RASTERS',
                { rasters: this._joinLines(containers) }), false);
            this.importService.sendMessageService(this.inputInfoLog, '#', false);

        }

        const customerKey = this.sessionService.active.environment.name;
        this.importService.sendMessageService(this.inputInfoLog,
            this.translateService.instant('IMPORT-DATA.VALIDE-IMPORT-MESSAGE-CUSTOMER', { customerKey }), false);
        this.importService.sendMessageService(this.inputInfoLog, '#', false);
    }


    _joinLines(elements: string[]): string {
        const lines = _.join(elements, '<br>');
        return `<br>${lines}<br>`;
    }
}
