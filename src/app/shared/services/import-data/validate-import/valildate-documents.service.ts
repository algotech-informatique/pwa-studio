import { Injectable, InputDecorator } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import * as _ from 'lodash';
import { ImportDataUtilsService } from '../import-data-utils.service';
import { ValidateData, ValidateDataFileDto, ValidateDataModel } from '../../../components/import-data/dto/validate-data-file.dto';
import { ImportDataDocDto, ImportDataOptionsDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { Observable, of } from 'rxjs';
import { catchError, flatMap, map, mergeMap } from 'rxjs/operators';
import { DocumentsService } from '@algotech/angular';
import { DocumentDto } from '@algotech/core';

@Injectable()
export class ImportDocumentsDataService {

    constructor(
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
        private docsService: DocumentsService,
    ) {}

    validateDocs(data: ImportDataFileDto, objects: ImportDataFileDto,
        importDocs: ImportDataDocDto[], importDocsOptions: ImportDataOptionsDto, inputLog: string): Observable<ValidateDataFileDto> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.VALIDATE-DOC'), false);

        return this._launchValidateDocs(data, objects, importDocs, importDocsOptions, inputLog).pipe(
            map((listModel: ValidateDataModel[]) => {
                const validate: ValidateDataFileDto = {
                    type: 'document',
                    valide: !_.some(listModel, (imp: ValidateDataModel) => imp.valide === false),
                    importData: listModel,
                };
                return validate;
            }),
        );
    }

    _launchValidateDocs(data: ImportDataFileDto, objects: ImportDataFileDto,
        importDocs: ImportDataDocDto[], importDocsOptions: ImportDataOptionsDto, inputLog: string): Observable<ValidateDataModel[]> {

        const model$: Observable<ValidateDataModel>[] = _.map(data.importData, (dt: ImportDataModel) => {
            if (dt.data.length === 0) {
                return of({model: dt.model, data: [], valide: true });
            }
            const extKey = this.importUtilsService.findExternalDocKey(dt.data[0]);
            return this._validateDataModel(extKey, dt, objects, importDocs, importDocsOptions, inputLog);
        });
        return this.importUtilsService.sequence(model$);
    }

    _validateDataModel(extKey, dt: ImportDataModel, objects: ImportDataFileDto,
        importDocs: ImportDataDocDto[], importDocsOptions: ImportDataOptionsDto, inputLog: string): Observable<ValidateDataModel> {

        if (extKey.length === 0) {

            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.VALIDATE-DOC-NO-EXTERNAL-DATA-KEY', { model: dt.model} ), true);
            const model: ValidateDataModel = {
                model: dt.model,
                data: [],
                valide: false
            };
            return of(model);
        }

        return this.importUtilsService.validateDataLinks(extKey[0], objects, dt,
            inputLog, 'IMPORT-DATA.VALIDATE-DOC-NO-EXTERNAL', true).pipe(
                mergeMap((data: ValidateData[]) =>
                    this._validateDocs(data, dt, importDocs, importDocsOptions, inputLog)
                ),
                map((data: ValidateData[]) => {
                    const model: ValidateDataModel = {
                        model: dt.model,
                        data,
                        valide: !_.some(data, (vd: ValidateData) => vd.valide === false),
                    };
                    return model;
            }),
        );
    }

    _validateDocs(data: ValidateData[], dt: ImportDataModel, importDocs: ImportDataDocDto[], importDocsOptions: ImportDataOptionsDto,inputLog): Observable<ValidateData[]> {
        const doc$: Observable<ValidateData>[] = _.map(data, (vdt: ValidateData, index) => {
            return this._validateDoc(vdt, dt, importDocs, importDocsOptions, index + 2, inputLog);
        })
        return this.importUtilsService.sequence(doc$);
    }

    _validateDoc(data: ValidateData, dt: ImportDataModel, importDocs: ImportDataDocDto[], importDocsOptions: ImportDataOptionsDto, index, inputLog): Observable<ValidateData> {
        const fileName = data.object['FILENAME'];
        const filePath = data.object['PATH'];

        return (!fileName) ?
            this._noFileName(data, 'IMPORT-DATA.VALIDATE-DOC-VALUE', index, inputLog) :
            this._validateDocDataBase(data, dt, filePath, fileName, importDocs, importDocsOptions, index, inputLog);
    }

    _noFileName(data: ValidateData, message, index, inputLog): Observable<ValidateData> {
        data.valide = false;
        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant(message, {index: index }), true);
        return of(data);
    } 

    _noFileDocName(data: ValidateData, message, value, model, index, inputLog): Observable<ValidateData> {
        data.valide = false;
        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant(message, {value, model, index }), true);
        return of(data);
    } 

    _validateDocDataBase(data: ValidateData, dt: ImportDataModel, filePath: string, fileName: string, importDocs: ImportDataDocDto[],
        importDocsOptions: ImportDataOptionsDto, index, inputLog): Observable<ValidateData> {

        const valideDoc = this.importUtilsService.getDocument(fileName, filePath, importDocs);
        return (importDocsOptions.verifyDocs) ?
            this.docsService.getByName(fileName).pipe(
                catchError(() => of(null)),
                mergeMap((doc: DocumentDto) => {
                    if (doc) {
                        return (importDocsOptions.versionDocs && !valideDoc ) ?
                            this._noFileDocName(data, 'IMPORT-DATA.VALIDATE-DOC-NO-FILE-VERSION', fileName, dt.model, index, inputLog) :
                            this._assignDocument(data, doc, dt, fileName, filePath, (importDocsOptions.versionDocs));
                    } else {
                        return (!valideDoc) ?
                            this._noFileDocName(data, 'IMPORT-DATA.VALIDATE-DOC-NO-FILE-BDD', fileName, dt.model, index, inputLog) :
                            of(data);
                    }

                }),
            ) :
            (!valideDoc) ?
                this._noFileDocName(data, 'IMPORT-DATA.VALIDATE-DOC-NO-FILE', fileName, dt.model, index, inputLog) :
                of(data);
    }

    _assignDocument(data: ValidateData, doc: DocumentDto, dt: ImportDataModel, fileName: string, filePath: string, isVersion: boolean): Observable<ValidateData>{
        const indx = this.importUtilsService.getDocumentIndex(fileName, filePath, dt.data);
        if (indx !== -1) {
            Object.assign(dt.data[indx], { fileId: doc.uuid });
            Object.assign(dt.data[indx], { importValidate: (isVersion) ? 'version' : 'replace' });
        }
        return of(data);
    }

}
