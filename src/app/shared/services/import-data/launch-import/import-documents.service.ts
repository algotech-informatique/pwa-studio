import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { ImportDataDocDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { ImportDataFileDto, ImportDataModel } from '../../../components/import-data/dto/import-data-file.dto';
import { ValidateImportDataDto, ValidateImportDataModelDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { ImportDataUtilsService } from '../import-data-utils.service';
import * as _ from 'lodash';
import { first, flatMap, map, tap } from 'rxjs/operators';
import { SmartObjectsService } from '@algotech/angular';
import { DocumentMetadatasDto, FileEditDto, FileUploadDto, SmartModelDto, SmartObjectDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';
import { SessionsService } from '../../sessions/sessions.service';
import { ImportDataDocService } from '../import-data-doc.service';
import { FilesService } from '@algotech/business';

interface Documents {
    name: string;
    path: string;
    tags: string;
    metadatas: DocumentMetadatasDto[];
    importUuid: string;
    importValidate: string;
}

interface SmartObjectsDocument {
    smartObject: SmartObjectDto;
    documents: Documents[];
}

interface ModelSmartObjectsDocument {
    model: string;
    sods: SmartObjectsDocument[];
    addTags: boolean;
}

interface UploadDocs {
    fileUpload: FileUploadDto;
    uploadPath: string;
    uploaded: boolean;
    tags?: string[];
    metadata?: string;
}

interface PruneUpload {
    formData: FileUploadDto;
    uploaded: boolean;
    tags?: string[];
    metadata?: string;
}

@Injectable()
export class ImportDocumentsService {

    uploadedDocs: UploadDocs[] = [];

    constructor(
        private importUtilsService: ImportDataUtilsService,
        private translateService: TranslateService,
        private smartObjectsService: SmartObjectsService,
        private sessionService: SessionsService,
        private importDataDocs: ImportDataDocService,
        private fileService: FilesService,
    ) {}

    importObjects(data: ImportDataFileDto, dataSO: ValidateImportDataDto,
        forceData: boolean, fileZip: File, inputLog: string): Observable<ValidateImportDataDto> {

        if (data.importData.length === 0) {
            return of( { type: data.type, valide: true, importData: [] });
        }

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.START-DATA-DOCS-IMPORT'), false);
        this.uploadedDocs = [];

        return this.importDataDocs.loadFileList(fileZip, inputLog).pipe(
            flatMap((docs: ImportDataDocDto[]) => {

                return this._groupBy(data, dataSO).pipe(
                    flatMap((result: ModelSmartObjectsDocument[]) => {
                        return this._getDocuments(result, docs, inputLog);
                    }),
                    map((importData: ValidateImportDataModelDto[]) => {
                        const valide = !_.some(importData, (id: ValidateImportDataModelDto) => id.valide === false);
                        const validate: ValidateImportDataDto = {
                            valide,
                            importData,
                            type: 'document',
                        };
                        return validate;
                    }),
                );

            }),
        );
    }

    _getDocuments(data: ModelSmartObjectsDocument[],
        importDocs: ImportDataDocDto[], inputLog: string): Observable<ValidateImportDataModelDto[]> {

        const import$: Observable<ValidateImportDataModelDto>[] = _.map(data, (dt: ModelSmartObjectsDocument) => {

            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.START-DATA-DOC-IMPORT-MODEL', { model: dt.model }), false);

            if (dt.sods.length === 0) {
                const validate: ValidateImportDataModelDto = {
                    valide: true,
                    data: [],
                    model: dt.model
                };
                return of(validate);
            }

            return this._insertDocuments(dt, importDocs, inputLog).pipe(
                map((result: object[]) => {
                    return {
                        model: dt.model,
                        data: result,
                        valide: true,
                    };
                }),
            );
        });
        return this.importUtilsService.sequence(import$, 1);
    }

    _groupBy(data: ImportDataFileDto, dataSO: ValidateImportDataDto):
        Observable<ModelSmartObjectsDocument[]> {

        const group$: Observable<ModelSmartObjectsDocument>[] = _.map(data.importData, (dt: ImportDataModel) => {

            if (dt.data.length === 0) {
                const docModel: ModelSmartObjectsDocument  = {
                    model: dt.model,
                    sods: [],
                    addTags: false,
                };
                return of(docModel);
            }

            const modelProp = this.importUtilsService.findKey(dt.data[0]);
            const group = _.chain(dt.data).groupBy(modelProp.header).map((value, key) => ({ so: key, docs: value })).value();
            const model: SmartModelDto = this.importUtilsService.getSmartModel(dt.model);
            return this._loadGroupDocument(group, modelProp, dataSO).pipe(
                map((sod: SmartObjectsDocument[]) => {
                    const md: ModelSmartObjectsDocument = {
                        model: dt.model,
                        sods: sod,
                        addTags: (model.skills.atTag) ? model.skills.atTag : false,
                    };
                    return md;
                }),
            );
        });
        return this.importUtilsService.sequence(group$);
    }

    _loadGroupDocument(groups, modelProp, dataSO: ValidateImportDataDto): Observable<SmartObjectsDocument[]> {

        const sod$: Observable<SmartObjectsDocument>[] = _.map(groups, (gr) => {
            return this.importUtilsService.returnObject(dataSO, modelProp.model, modelProp.key, gr.so).pipe(
                map((so: SmartObjectDto) => {
                    const docs: Documents[] = this._loadDocuments(gr.docs);
                    const sod: SmartObjectsDocument = {
                        smartObject: so,
                        documents: docs,
                    };
                    return sod;
                }),
            );
        });
        return  this.importUtilsService.sequence(sod$);
    }

    _loadDocuments(data): Documents[] {

        const files: Documents[] = _.map(data, (row) => {
            const fileName: string = row['FILENAME'];
            const filePath: string = row['PATH'];

            const doc: Documents = {
                name: fileName,
                path: filePath,
                tags: row['TAGS'],
                metadatas: this._buildMetadatas(row),
                importUuid: (row['fileId']) ? row['fileId'] : null,
                importValidate: (row['importValidate']) ? row['importValidate'] : null,
            };
            return doc;
        });
        return files;
    }

    _insertDocuments(data: ModelSmartObjectsDocument, importDocs: ImportDataDocDto[],
        inputLog: string): Observable<{object: Object, valide: boolean}[]> {

        const insert$: Observable<Object>[] = _.map(data.sods, (dt: SmartObjectsDocument) => {
            const doc$: Observable<{object: Object, valide: boolean}>[] = _.map(dt.documents, (doc) => {
                return this._insertDoc(dt.smartObject, doc, data.addTags, importDocs, inputLog).pipe(
                    map((object) => {
                        return {
                            object,
                            valide: (object),
                        };
                    }),
                    first(),
                );
            });

            const import$ = this.importUtilsService.sequence(doc$, 1);
            return import$.pipe(
                map((impDoc: {object: Object, valide: boolean}[]) => {
                    const valide = !_.some(impDoc, (id) => id.valide === false);
                    return {
                        object: dt,
                        valide,
                    };
                }),
                first(),
            );
        });
        return this.importUtilsService.sequence(insert$, 1);
    }

    _insertDoc(so: SmartObjectDto, doc: Documents, addTags: boolean,
        importDocs: ImportDataDocDto[], inputLog: string): Observable<object> {

        const docPath: string = doc.path;
        const dir = (docPath) ? docPath.split(' ').join('\ ').split('(').join('\(').split(')').join('\)') : '';
        const filename = doc.name.split(' ').join('\ ').split('(').join('\(').split(')').join('\)');

        return this._insertDocument(so, {
            uuid: so.uuid,
            tags: this._buildTags(doc.tags),
            metadatas: doc.metadatas,
            fullpath: (dir === '') ? filename : this.importUtilsService.filePathJoin(dir, filename, '/'),
            filename: doc.name,
            importUuid: doc.importUuid,
            importValidate: doc.importValidate,
        }, addTags, importDocs, inputLog);
    }

    _pruneUpload(doc): PruneUpload {

        const find: UploadDocs = _.find(this.uploadedDocs, (docs:  UploadDocs) => docs.uploadPath === doc.fullpath );
        if (find) {
            return {
                formData: find.fileUpload,
                uploaded: true,
                metadata: find.metadata,
                tags: find.tags,
            };
        } else {
            
            const formData: FileUploadDto = this._createFormData(doc);
            const tags = (doc.tags) ? doc.tags : '';
            const metadata = doc.metadatas ? JSON.stringify(doc.metadatas) : '';
            const uploaded = (doc.importUuid &&  doc.importValidate && doc.importValidate === 'replace') ? true : false;

            this.uploadedDocs.push({ fileUpload: formData, uploadPath: doc.fullpath, uploaded, metadata, tags  });
            return {
                formData,
                uploaded,
                metadata: metadata,
                tags: tags,
            };
        }
    }

    _createFormData(doc): FileUploadDto {
        const formData: FileUploadDto = {
            userID: this.sessionService.active.connection.uuid,
            versionID: UUID.UUID(),
            reason: (doc.importUuid && doc.importValidate && doc.importValidate === 'version') ? 'version' : 'upload',
            metadatas: doc.metadatas ? JSON.stringify(doc.metadatas) : '',
            documentID: (doc.importUuid) ? doc.importUuid : UUID.UUID(),
        };
        return formData;
    }

    _uploadedDoc(filePath: string) {
        const findIndex = _.findIndex(this.uploadedDocs, (docs:  UploadDocs) => docs.uploadPath === filePath );
        if (findIndex !== -1) {
            this.uploadedDocs[findIndex].uploaded = true;
        }
    }

    _insertDocument(so: SmartObjectDto, formatedDoc, addTags: boolean,
        importDocs: ImportDataDocDto[], inputLog: string): Observable<object> {

        const pruneUpload: PruneUpload = this._pruneUpload(formatedDoc);
        if (!pruneUpload.formData) {
            this.importUtilsService.sendMessageService(inputLog,
                this.translateService.instant('IMPORT-DATA.IMPORT-SMART-OBJECT-NO-FOUND-FILE', {file: formatedDoc.filename }), true);
            return of(null);
        }
        const find: UploadDocs = _.find(this.uploadedDocs, (docs:  UploadDocs) => docs.uploadPath === formatedDoc.fullpath );
        if (pruneUpload.uploaded) {
            return this._linkDocument(true, so, find.fileUpload.documentID, formatedDoc.filename, 'IMPORT-DATA.IMPORT-FILE-LINK', inputLog);
        } else {
            const fileExt = formatedDoc.filename.substr(formatedDoc.filename.lastIndexOf('.') + 1);
            const objFile: ImportDataDocDto = this.importUtilsService.getFile(importDocs, formatedDoc.fullpath);
            return (objFile) ? this.smartObjectsService.uploadFile(
                objFile.file, formatedDoc.filename, fileExt, so.uuid, pruneUpload.formData).pipe(
                    tap(() => {
                        this.importUtilsService.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.IMPORT-FILE', {file: formatedDoc.filename }), false);
                    }),
                    flatMap((updateSO: SmartObjectDto) => {
                        return this._updateTags(updateSO, find.fileUpload.documentID, pruneUpload.tags, formatedDoc.filename, inputLog);
                    }),
                    flatMap((updateSO: SmartObjectDto) => {
                        this._uploadedDoc(formatedDoc.fullpath);
                        return this._linkDocument(formatedDoc.importValidate === 'version', so, find.fileUpload.documentID,
                            formatedDoc.filename, 'IMPORT-DATA.IMPORT-FILE-LINK-VERSION', inputLog)
                    }),
                ) : of(null);
        }
    }

    _linkDocument(isVersion: boolean, so: SmartObjectDto, documentID: string, fileName: string, message: string, inputLog): Observable<SmartObjectDto> {
        if (isVersion)  {
            so.skills.atDocument.documents.push(documentID);
            return this.smartObjectsService.put(so).pipe(
                tap(() => {
                    this.importUtilsService.sendMessageService(inputLog,
                        this.translateService.instant(message, {file: fileName  }), false);
                }),
                map((sos: SmartObjectDto) => {
                    return sos;
                })
            );
        } else {
            return of(so);
        }
    }

    _updateTags(updateSO: SmartObjectDto, docUuid: string, tags: string[], fileName: string, inputLog: string): Observable<any> {
        const edit: FileEditDto = {
            uuid: docUuid,
            tags: tags,
        };
        return this.smartObjectsService.editDocument(updateSO.uuid, edit).pipe(
            tap(() => {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-FILE-TAGS', {file: fileName }), false);
            }),
            map((obj) => {
                return updateSO;
            })
        );
    }

    _findDocUuid(updateSO: SmartObjectDto, docUuid: string): string {
        return (updateSO.skills.atDocument) ? updateSO.skills.atDocument.documents[0] : null;
    }

    _getDocUuid = (json) => {
        if (json.obj && json.obj.skills && json.obj.skills.atDocument && json.obj.skills.atDocument.documents
            && _.isArray(json.obj.skills.atDocument.documents) && json.obj.skills.atDocument.documents.length > 0) {
            return json.obj.skills.atDocument.documents[0];
        }
        return null;
    }

    _buildTags = (rawTags) => {
        if (!rawTags) {
            return [];
        }
        return rawTags.split('|');
    }

    _buildMetadatas = (data) => {
        const keys: string[] = Object.keys(data);
        return _.reduce(keys, (metadatas, key: string) => {
            if (key.toLowerCase().startsWith('md:')) {
                const value: string = data[key];
                if (value) {
                    const pair: DocumentMetadatasDto = {
                        key: key.toLowerCase().slice(3),
                        value: value.toString()
                    };
                    metadatas.push(pair);
                }
            }
            return metadatas;
        }, []);
    }
}

