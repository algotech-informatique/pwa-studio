import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataFileDto } from '../../../components/import-data/dto/import-data-file.dto';
import { MessageService } from '../../message/message.service';
import { ImportContainersDataService } from './validate-containers.service';
import { ImportDocumentsDataService } from './valildate-documents.service';
import { ImportLinksDataService } from './validata-links.service';
import { ImportListsDataService } from './validate-lists.service';
import * as _ from 'lodash';
import { ImportValidateDataService } from './validate-objects.service';
import { ValidateDataFileDto } from '../../../components/import-data/dto/validate-data-file.dto';
import { ImportDataDocDto, ImportDataOptionsDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { Observable, of } from 'rxjs';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { RxExtendService } from '@algotech/angular';

@Injectable()
export class ValidateImportService {

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
        private importValidateData: ImportValidateDataService,
        private importDocuments: ImportDocumentsDataService,
        private importContainers: ImportContainersDataService,
        private importLinks: ImportLinksDataService,
        private importLists: ImportListsDataService,
        private importUtilsService: ImportDataUtilsService,
        private rxExtend: RxExtendService,
    ) { }

    validateData(importFile: ImportDataFileDto[], importDocs: ImportDataDocDto[],
        importDocsOptions: ImportDataOptionsDto, inputLog: string, clearLog: string): Observable<ValidateDataFileDto[]> {

        this.messageService.send(clearLog, {});
        this.importUtilsService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.START-DATA-VALIDATE'), false);

        return this.rxExtend.sequence([
            this._validateLists(importFile, importDocsOptions.forceData, inputLog),
            this._validateRasters(importFile, importDocs, importDocsOptions.forceData, inputLog),
            this._validateDocs(importFile, importDocs, importDocsOptions, inputLog),
        ]);
    }

    _validateObjects(importFile: ImportDataFileDto[], forceData: boolean, inputLog: string): Observable<ValidateDataFileDto> {
        const objFile = this._getObjects(importFile, 'object');
        const listFile = this._getObjects(importFile, 'list');
        return (objFile && objFile.importData.length !== 0) ?
            this.importValidateData.validateObject(objFile, forceData, listFile, inputLog) :
            of(this._emptyObject('object'));
    }

    _validateLinks(importFile: ImportDataFileDto[], inputLog: string): Observable<ValidateDataFileDto> {
        const objFile = this._getObjects(importFile, 'object');
        return (objFile && objFile.importData.length !== 0) ?
            this.importLinks.validateLinks(objFile, inputLog) :
            of(this._emptyObject('link'));
    }

    _validateLists(importFile: ImportDataFileDto[], forceData: boolean, inputLog: string): Observable<ValidateDataFileDto> {
        const listFile = this._getObjects(importFile, 'list');
        return (listFile && listFile.importData.length !== 0) ?
            this.importLists.validateLists(listFile, forceData, inputLog) :
            of(this._emptyObject('list'));
    }

    _validateDocs(importFile: ImportDataFileDto[], importDocs: ImportDataDocDto[],
        importDocsOptions: ImportDataOptionsDto, inputLog: string): Observable<ValidateDataFileDto> {
        const docFile = this._getObjects(importFile, 'document');
        const objFile = this._getObjects(importFile, 'object');
        return (docFile && docFile.importData.length !== 0) ?
            this.importDocuments.validateDocs(docFile, objFile, importDocs, importDocsOptions, inputLog) :
            of(this._emptyObject('document'));
    }

    _validateRasters(importFile: ImportDataFileDto[], importDocs: ImportDataDocDto[],
        forceData: boolean, inputLog: string): Observable<ValidateDataFileDto> {

        const rasterFile = this._getObjects(importFile, 'layer');
        return (rasterFile && rasterFile.importData.length !== 0) ?
            this.importContainers.validateContainer(rasterFile, importDocs, forceData, inputLog) :
            of(this._emptyObject('layer'));
    }

    _emptyObject(type: 'object' | 'list' | 'document' | 'layer' | 'link'): ValidateDataFileDto {
        const val: ValidateDataFileDto = {
            type,
            importData: [],
            valide: true,
        };
        return val;
    }

    _getObjects(importFile: ImportDataFileDto[], type: 'object' | 'list' | 'document' | 'layer'): ImportDataFileDto {
        return _.find(importFile, (imp: ImportDataFileDto) => imp.type === type);
    }
}
