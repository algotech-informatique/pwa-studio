import { SmartModelDto } from '@algotech/core';
import { Component, Input, OnChanges } from '@angular/core';
import { SessionsService } from '../../services';
import { ExportDataFileDto } from './dto/export-data-file.dto';
import { ImportDataDocDto } from './dto/import-data-doc.dto';
import { ValidateDataFileDto } from './dto/validate-data-file.dto';
import { ExportDataFileService } from './services/export-data-file.service';
import * as _ from 'lodash';
import { ImportDataFileDto } from './dto/import-data-file.dto';
import { ValidateImportContainerDto } from './dto/validate-container.dto';

@Component({
    selector: 'app-import-data',
    templateUrl: './import-data.component.html',
    styleUrls: ['./import-data.component.scss'],
})
export class ImportDataComponent implements OnChanges {

    @Input() customerKey: string;
    @Input() host: string;

    exportData: ExportDataFileDto;
    modelList: SmartModelDto[] = [];
    activateValidate = false;

    activateImport = false;
    replaceData = false;
    importDataFileDto: ImportDataFileDto[]  = [];
    validateDocDto: ImportDataDocDto[] = [];
    validateData: ValidateDataFileDto[] = [];
    validateImportContainer: ValidateImportContainerDto[] = [];
    fileZip: File;

    spinnerDisplay = true;

    constructor(
        private sessionService: SessionsService,
        private exportDataFile: ExportDataFileService,
    ) { }

    ngOnChanges() {
        this.modelList = this.sessionService.active.datas.read.smartModels;
        this.exportData = {
            addLayers: false,
            glistList: [],
            modelList: [],
        };
    }

    onDownloadFile(event) {
        this.exportDataFile.createExcelFile(event, this.modelList, this.sessionService.active.datas.read.customer.languages);
        this.activateValidate = true;
    }

    onActivateIntegration(event: {
            valide: boolean;
            replaceData: boolean;
            validateContainers: ValidateImportContainerDto[];
            validateData: ValidateDataFileDto[];
            data: ImportDataFileDto[];
            docs: ImportDataDocDto[];
            fileZip: File;
    }) {

        this.activateImport = event.valide;
        this.replaceData = event.replaceData;
        this.importDataFileDto = event.data;
        this.validateData = event.validateData;
        this.validateImportContainer = event.validateContainers;
        this.validateDocDto = event.docs;
        this.fileZip = event.fileZip;
    }

    onActivateSpinner(active: boolean) {
        this.spinnerDisplay = active;
    }
}
