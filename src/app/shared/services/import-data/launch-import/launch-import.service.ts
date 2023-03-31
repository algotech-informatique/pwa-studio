import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ImportDataFileDto } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { ValidateImportContainerDto } from '../../../components/import-data/dto/validate-container.dto';
import { MessageService } from '../../message/message.service';
import { ImportContainersService } from './import-containers.service';
import * as _ from 'lodash';
import { ImportListsService } from './import-lists.service';
import { ImportObjectsDataService } from './import-objects.service';
import { ImportDocumentsService } from './import-documents.service';
import { ImportLinksService } from './import-links.service';
import { first, flatMap, map, switchMap } from 'rxjs/operators';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { RxExtendService } from '@algotech-ce/angular';

@Injectable()
export class LaunchImportService {

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
        private importDataContainer: ImportContainersService,
        private importDataList: ImportListsService,
        private importDataObjectService: ImportObjectsDataService,
        private importDataDocument: ImportDocumentsService,
        private importDataLink: ImportLinksService,
        private importUtilsService: ImportDataUtilsService,
        private rxExtend: RxExtendService,
    ) {}

    importData(importFile: ImportDataFileDto[], importContainer: ValidateImportContainerDto[], validateData: ValidateImportDataDto[],
        forceData: boolean, fileZip: File, inputLog: string, clearLog: string): Observable<ValidateImportDataDto[]> {

        this.messageService.send(clearLog, {});
        this.importUtilsService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.START-DATA-IMPORT'), false);

        if (importFile.length === 0) {
            this.importUtilsService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.EMPTY-DATA-IMPORT'), false);
            const val: ValidateImportDataDto = {
                type: 'object',
                valide: false,
                importData: [],
            };
            return of([val]);
        }

        return this.rxExtend.sequence([
            this._importDataContainer(importFile, importContainer, forceData, fileZip, inputLog),
            this._importDataList(importFile, forceData, inputLog),
            this._importDataObjects(importFile, validateData, forceData, fileZip, inputLog),
        ]);
    }

    _importDataObjects(importFile: ImportDataFileDto[], validateData: ValidateImportDataDto[], forceData: boolean,
        fileZip: File, inputLog: string): Observable<ValidateImportDataDto[]> {

        return this._importDataDocuments(importFile, {
            type: 'object',
            valide: true,
            importData: []
        }, forceData, fileZip, inputLog).pipe(
            map((res) => [res])
        );
    }

    _importDataLinks(importFile: ImportDataFileDto[], dataSO: ValidateImportDataDto, validateData: ValidateImportDataDto[],
        forceData: boolean, inputLog: string): Observable<ValidateImportDataDto> {

        const obj: ImportDataFileDto = this._getObjects(importFile, 'object');
        const valLinks: ValidateImportDataDto = this._getValidateObjects(validateData, 'link');
        return (obj && obj.importData.length !== 0) ?
            this.importDataLink.importObjects(obj, dataSO, valLinks, forceData, inputLog).pipe(
                map((data: ValidateImportDataDto) => {
                    this._endImportMessage(data, inputLog);
                    return data;
                })) :
            of(this._emptyObject('link'));
    }

    _importDataDocuments(importFile: ImportDataFileDto[], dataSO: ValidateImportDataDto,
        forceData: boolean, fileZip: File, inputLog: string): Observable<ValidateImportDataDto> {

        const obj: ImportDataFileDto = this._getObjects(importFile, 'document');
        return (obj && obj.importData.length !== 0) ?
            this.importDataDocument.importObjects(obj, dataSO, forceData, fileZip, inputLog).pipe(
                map((data: ValidateImportDataDto) => {
                    this._endImportMessageDoc(data, inputLog);
                    return data;
                })
            ) :
            of(this._emptyObject('document'));
    }

    _importDataContainer(importFile: ImportDataFileDto[], importContainer: ValidateImportContainerDto[],
        forceData: boolean, fileZip: File, inputLog: string): Observable<ValidateImportDataDto> {

        const obj: ImportDataFileDto = this._getObjects(importFile, 'layer');
        return (obj && obj.importData.length !== 0) ?
            this.importDataContainer.importObjects(obj, importContainer, forceData, fileZip, inputLog).pipe(
                map((data: ValidateImportDataDto) => {
                    this._endImportMessage(data, inputLog);
                    return data;
                })
            ) :
            of(this._emptyObject('document'));

    }

    _importDataList(importFile: ImportDataFileDto[], forceData: boolean, inputLog: string): Observable<ValidateImportDataDto> {
        const obj: ImportDataFileDto = this._getObjects(importFile, 'list');
        return (obj && obj.importData.length !== 0) ?
            this.importDataList.importObjects(obj, forceData, inputLog).pipe(
                map((data: ValidateImportDataDto) => {
                    this._endImportMessage(data, inputLog);
                    return data;
                })
            ) :
            of(this._emptyObject('list'));
    }

    _getObjects(importFile: ImportDataFileDto[], type: 'object' | 'list' | 'document' | 'layer'): ImportDataFileDto {
        return _.find(importFile, (imp: ImportDataFileDto) => imp.type === type);
    }

    _getValidateObjects(validateData: ValidateImportDataDto[],
        type: 'object' | 'list' | 'document' | 'layer' | 'link'): ValidateImportDataDto {
        return _.find(validateData, (imp: ValidateImportDataDto) => imp.type === type);
    }

    _emptyObject(type: 'object' | 'list' | 'document' | 'layer' | 'link'): ValidateImportDataDto {
        const val: ValidateImportDataDto = {
            type,
            importData: [],
            valide: true,
        };
        return val;
    }

    _noValideEmptyObject(type: 'object' | 'list' | 'document' | 'layer' | 'link'): Observable<ValidateImportDataDto> {
        const empty: ValidateImportDataDto = this._emptyObject(type);
        empty.valide = false;
        return of(empty);
    }

    _endImportMessage(data: ValidateImportDataDto, inputLog: string) {
        const message = (data.type === 'object') ?
            'IMPORT-DATA.TOTAL-IMPORT-OBJECTS' :
            (data.type === 'layer') ?
                'IMPORT-DATA.TOTAL-IMPORT-LAYERS' :
                (data.type === 'list') ?
                'IMPORT-DATA.TOTAL-IMPORT-GLISTS' :
                'IMPORT-DATA.TOTAL-IMPORT-LINKS';

        _.forEach(data.importData, (dt: ValidateImportDataModelDto) => {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant(message, {model: dt.model, total: dt.data.length }), false);
        });
    }

    _endImportMessageDoc(data: ValidateImportDataDto, inputLog: string) {
        _.forEach(data.importData, (dt: ValidateImportDataModelDto) => {
            let total = 0;
            _.forEach(dt.data, (row) => {
                total += (row && row.object && row.object.documents) ? row.object.documents.length : 0;
            });
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.TOTAL-IMPORT-DOCUMENTS', {model: dt.model, total }), false);
        });
    }
}
