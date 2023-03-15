import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataDocDto } from '../../components/import-data/dto/import-data-doc.dto';
import * as _ from 'lodash';
import { from, Observable, of, zip } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { ImportDataService } from '../../components/import-data/services/import-data.service';
const jsZip = require('jszip');

@Injectable()
export class  ImportDataDocService {

    constructor(
        private translateService: TranslateService,
        private importService: ImportDataService,
    ) {}

    importDocs(file: File, inputLog: string): Observable<ImportDataDocDto[]> {
        const ext =  file.name.split('.').pop();

        if (ext && ext.toUpperCase() !== 'ZIP') {
            this.importService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.ZIP-FILE-EXTENSION-ERROR'), true);
            return of([]);
        }

        return from(this._fetchImportDocs(file, inputLog)).pipe(
            map((data) => data ),
        );
    }

    loadFileDoc(file, fileName: string, inputLog: string): Observable<ImportDataDocDto> {
        return from(this._fetchLoadFileDoc(file, fileName, inputLog)).pipe(
            flatMap((data) => data ),
        );
    }

    loadFileList(file, inputLog: string): Observable<ImportDataDocDto[]> {
        return from(this._fetchLoadFileList(file, inputLog)).pipe(
            flatMap((data) => data ),
        );
    }

    async _fetchImportDocs(file, inputLog: string) {
        const response: Promise<[]> = await this._importDocs(file, inputLog);
        return response;
    }

    async _fetchLoadFileDoc(file, fileName: string, inputLog: string) {
        const response: Promise<[]> = await this._loadFileDoc(file, fileName, inputLog);
        return response;
    }

    async _fetchLoadFileList(file, inputLog: string) {
        const response: Promise<[]> = await this._loadFileList(file, inputLog);
        return response;
    }

    _importDocs(file, inputLog: string) {
        const aZip = new jsZip();
        this.importService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.START-READING-DOCS'), false);

        return aZip.loadAsync(file).then((contents) => {
            const objKeys = Object.keys(contents.files);
            return this._returnFileList(objKeys);
        });
    }

    _loadFileDoc(fileZip: File, pathName: string, inputLog: string)  {
        const aZip = new jsZip();

        this.importService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.START-READ-DOC', {file: pathName } ), false);

        return aZip.loadAsync(fileZip).then((contents) =>

            aZip.files[pathName].async('Blob').then((content: Blob) => {
                const index = pathName.lastIndexOf('/');
                const fileName = (index !== 0) ? pathName.substring(index + 1) : pathName;
                const doc: ImportDataDocDto = {
                    pathName: fileName,
                    fileName,
                    file: content,
                };
                return doc;
            }),
        );
    }

    _returnFileList(files: string[]): ImportDataDocDto[] {
        return _.reduce(files, (result, file: string) => {
            const index = file.lastIndexOf('/');
            const fileName = (index !== 0) ? file.substring(index + 1) : file;
            if (fileName !== '') {
                const importDoc: ImportDataDocDto = {
                    pathName: file,
                    fileName,
                    file: null,
                };
                result.push(importDoc);
            }
            return result;
        }, []);
    }

    _returnFile(aZip, filename) {
        return aZip.files[filename].async('Blob').then((content: Blob) => {
            const index = filename.lastIndexOf('/');
            const doc: ImportDataDocDto = {
                pathName: filename,
                fileName: (index !== 0) ? filename.substring(index + 1) : filename,
                file: content,
            };
            return doc;
        });
    }

    _loadFileList(file, inputLog: string) {
        const aZip = new jsZip();
        this.importService.sendMessageService(inputLog, this.translateService.instant('IMPORT-DATA.START-READING-DOCS'), false);

        return aZip.loadAsync(file).then((contents) => {
            const objKeys = Object.keys(contents.files);
            const files$ = _.map(objKeys, (objKey) =>
                from(this._returnFileDocs(aZip, objKey)),
            );
            return zip(...files$);
        });
    }

    _returnFileDocs(aZip, filename) {
        return aZip.files[filename].async('Blob').then((content: Blob) => {
            const index = filename.lastIndexOf('/');
            const doc: ImportDataDocDto = {
                pathName: filename,
                fileName: (index !== 0) ? filename.substring(index + 1) : filename,
                file: content,
            };
            return doc;
        });
    }

}
