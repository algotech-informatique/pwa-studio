import { EventEmitter, Component, Input, OnInit, Output, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { ImportDataFileDto } from '../../dto/import-data-file.dto';
import { ImportDataFileService } from '../../services/import-data-file.service';
import * as _ from 'lodash';
import { MessageService, ToastService } from '../../../../services';
import { ImportDataDocDto, ImportDataOptionsDto } from '../../dto/import-data-doc.dto';
import { ImportDataDocService } from '../../../../services/import-data/import-data-doc.service';
import { ValidateDataFileDto } from '../../dto/validate-data-file.dto';
import { TranslateService } from '@ngx-translate/core';
import { ValidateImportService } from '../../../../services/import-data/validate-import/validate-import.service';
import { ValidateImportContainerDto } from '../../dto/validate-container.dto';
import { ImportContainerTreeService } from '../../services/import-container-tree.service';
import { ImportDataService } from '../../services/import-data.service';
import { timingSafeEqual } from 'crypto';

@Component({
    selector: 'validate-data',
    templateUrl: './validate-data.component.html',
    styleUrls: ['./validate-data.component.scss'],
})
export class ValidateDataComponent implements OnInit {

    @ViewChild('selectFileXLS') selectFileXLS: ElementRef;
    @ViewChild('selectFileZIP') selectFileZIP: ElementRef;

    @Input() activate = false;
    @Output() activateIntegration = new EventEmitter<
        {
            valide: boolean;
            replaceData: boolean;
            validateData: ValidateDataFileDto[];
            validateContainers: ValidateImportContainerDto[];
            data: ImportDataFileDto[];
            docs: ImportDataDocDto[];
            fileZip: File;
        }>();
    @Output() activateSpinner = new EventEmitter<boolean>();

    clearLog = 'validate-data-clear-log';
    inputLog = 'validate-data-input-log';

    activateDoc = false;
    validateData = false;
    validateDocs = false;
    importData: ImportDataFileDto[] = [];
    importDoc: ImportDataDocDto[] = [];
    replaceData = false;
    fileZip: File;

    verifyDocs = false;
    validateVersionDocs = false;
    versionDocs = false;

    constructor(
        private importFileService: ImportDataFileService,
        private validateImportService: ValidateImportService,
        private importDocService: ImportDataDocService,
        private messageService: MessageService,
        private translateService: TranslateService,
        private validateContainerService: ImportContainerTreeService,
        private importService: ImportDataService,
        private ref: ChangeDetectorRef,
        private toastMessage: ToastService,
    ) { }

    ngOnInit() { }

    onImportData(event) {
        this.activateSpinner.emit(false);
        const file = event.target.files[0];
        this.restartValidation();
        this.importFileService.importFile(file, this.inputLog, this.clearLog).pipe(
            map((data) => (data) ?
                    this.importFileService.splitImportData(data) :
                    null
            ),
        ).subscribe((result) => {
            if (result) {
                this.importData = result;
                this.validateData = true;
                this.selectFileXLS.nativeElement.value = null;
                this.selectFileZIP.nativeElement.value = null;
                this.importService.sendMessageService(this.inputLog,
                    this.translateService.instant('IMPORT-DATA.END-READ-FILE'), false);
            }
            this.activationTestImport();
        });
    }

    onImportDataDocuments(event) {
        this.activateSpinner.emit(false);

        this.fileZip = event.target.files[0];
        this.importDocService.importDocs(this.fileZip, this.inputLog).subscribe((data: ImportDataDocDto[]) => {
            if (data.length !== 0) {
                this.importDoc = data;
                this.validateDocs = true;
                this.importService.sendMessageService(this.inputLog, '#', false);
                _.forEach(data, (doc: ImportDataDocDto) => {
                    this.importService.sendMessageService(this.inputLog, `DOC: ${doc.fileName}, PATH: ${doc.pathName}`, false);
                });
                this.importService.sendMessageService(this.inputLog,
                    this.translateService.instant('IMPORT-DATA.VALIDATE-DOC-TOTAL', {total: this.importDoc.length}), false);
                this._validationEnded();
            }
        });
    }

    onImportDataTest() {
        this.activateSpinner.emit(false);

        this.activateIntegration.emit({ valide: false,
            replaceData: false,
            validateData: [],
            validateContainers: [],
            data: this.importData,
            docs: this.importDoc,
            fileZip: null,
        });

        const importOptions: ImportDataOptionsDto  = {
            forceData: this.replaceData,
            versionDocs: this.versionDocs,
            verifyDocs: this.verifyDocs,
        }

        this.validateImportService.validateData(this.importData, this.importDoc,
            importOptions, this.inputLog, this.clearLog).pipe().subscribe((validateData: ValidateDataFileDto[]) => {

                const validateContainers: ValidateImportContainerDto[] = this._validateContainers();
                const valideData = !_.some(validateData, (val: ValidateDataFileDto) => val.valide === false);
                const valContainer = !_.some(validateContainers, (val: ValidateImportContainerDto) => val.valide === false);
                const valide = (valideData && valContainer);
                const message = (valide) ? 'IMPORT-DATA.END-DATA-VALIDATE-OK' : 'IMPORT-DATA.END-DATA-VALIDATE-KO';

                this.toastMessage.addToast(valide ? 'success' : 'error', '', this.translateService.instant(message), 1500);
                this.importService.sendMessageService(this.inputLog, this.translateService.instant(message), !valide);
                this.activateIntegration.emit({
                    valide,
                    replaceData: this.replaceData,
                    validateData,
                    validateContainers,
                    data: this.importData,
                    docs: this.importDoc,
                    fileZip: this.fileZip,
                });
                this.activateSpinner.emit(true);
        });
    }

    onVerifyDocs(event) {
        this.verifyDocs = event;
        this.validateVersionDocs = (this.verifyDocs === true);
        if (!this.verifyDocs) {
            this.versionDocs = false;
        }
    }

    onVersionDocs(event) {
        this.versionDocs = event;
    }

    onActivateImport() {
        return !(this.validateData && this.validateDocs);
    }

    activationTestImport() {
        const data: ImportDataFileDto[] = _.filter(this.importData, (mpt: ImportDataFileDto) =>
            (mpt.type === 'document' && mpt.importData.length !== 0) ||
            (mpt.type === 'layer' &&  mpt.importData.length !== 0));
        this.activateDoc = (data.length !== 0);
        this.validateDocs = (data.length === 0);

        this._validationEnded();
    }

    _validationEnded() {
        this.activateSpinner.emit(true);
        if (this.validateData && this.validateDocs) {
            this.importService.sendMessageService(this.inputLog, '#', false);
            this.importService.sendMessageService(this.inputLog, this.translateService.instant('IMPORT-DATA.START-DATA-VALIDATION'), false);
            this.toastMessage.addToast('success', '', this.translateService.instant('IMPORT-DATA.START-DATA-VALIDATION'), 1500);
        }
    }

    restartValidation() {
        this.messageService.send(this.clearLog, {});
        this.importData = [];
        this.importDoc = [];
        this.activateDoc = false;
        this.validateData = false;
        this.validateDocs = false;
        this.verifyDocs = false;
        this.validateVersionDocs = false;
        this.versionDocs = false;
        this.ref.detectChanges();
    }

    _validateContainers(): ValidateImportContainerDto[] {
        const containerFile: ImportDataFileDto = _.find(this.importData, (data: ImportDataFileDto) => data.type === 'layer');
        if (containerFile && containerFile.importData.length > 0) {
            const valCon: ValidateImportContainerDto[] =
                this.validateContainerService.createContainerTree(containerFile.importData[0], this.replaceData, this.inputLog);
            const valide = !_.some(valCon, (container: ValidateImportContainerDto) => container.valide === false);
            if (!valide) {
                this.importService.sendMessageService(this.inputLog,
                    this.translateService.instant('IMPORT-DATA.END-VALIDATE-CONTAINER-KO'), true);
            }
            return valCon;
        }
        return [];
    }
}
