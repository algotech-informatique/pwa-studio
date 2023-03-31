import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ImportDataDocDto } from '../../../components/import-data/dto/import-data-doc.dto';
import { ValidateImportDocDto } from '../../../components/import-data/dto/validate-import-data.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService, BaseService, EnvService } from '@algotech-ce/angular';
import { Metadata } from '@algotech-ce/core';
import { SessionsService } from '../../sessions/sessions.service';
import * as _ from 'lodash';
import { catchError, first, flatMap, map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ImportDataUtilsService } from '../import-data-utils.service';

@Injectable({
    providedIn: 'root'
})
export class ImportRastersService extends BaseService<Metadata> {

    constructor(
        private sessionService: SessionsService,
        protected authService: AuthService,
        protected http: HttpClient,
        protected env: EnvService,
        private translateService: TranslateService,
        private importUtilsService: ImportDataUtilsService,
    ) {
        super(authService, http, env);
        this.serviceUrl = '/rasters';
    }

    importRasters(rasters: {rasterUuid: string, file: string, layer: string, container: string}[],
        importDocs: ImportDataDocDto[], inputLog: string): Observable<ValidateImportDocDto[]> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.RASTER-IMPORT-FILE'), false);

        const import$: Observable<ValidateImportDocDto>[] = _.map(rasters, (raster) => {

            const objFile = this.importUtilsService.getFile(importDocs, raster.file);
            const data = this._insertData(objFile.fileName, objFile.file);
            return (objFile) ? this.upload(raster.rasterUuid, data, objFile.fileName, inputLog).pipe(
                catchError(() => {
                    this.importUtilsService.sendMessageService(inputLog,
                        this.translateService.instant('IMPORT-DATA.IMPORT-FILE-ERROR',
                        {file: objFile.fileName, container: raster.container, layer: raster.layer }), true);
                    return of({name: objFile.fileName, valide: false });
                }),
                flatMap((res) => {
                    if (res.rasterUuid || res.rasterUuid !== 'undefined') {
                        return this.launch(raster.rasterUuid, objFile.fileName, raster.layer, raster.container, inputLog);
                    } else {
                        return of( {name: objFile.fileName, valide: false } );
                    }
                }),
                map((res) => {
                    const valide: ValidateImportDocDto = (res.name) ? res :
                        {
                            name: objFile.fileName,
                            valide: (res.rasterUuid || res.rasterUuid !== 'undefined'),
                        };
                    if (!valide.valide) {
                        this.importUtilsService.sendMessageService(inputLog,
                            this.translateService.instant('IMPORT-DATA.VALIDATE-RASTER-FILE-ERROR', {name: objFile.fileName }), true);
                    }
                    return valide;
                }),
                first(),
            ) : of({name: raster.file, valide: false });
        });
        return this.importUtilsService.sequence(import$, 1);
    }

    _insertData(name: string, file: Blob) {
        const formData = new FormData();
        formData.append('file', file, name);
        return formData;
    }

    public upload(uuid: string, formData: FormData, fileName: string, inputLog: string): Observable<any> {

        this.importUtilsService.sendMessageService(inputLog,
            this.translateService.instant('IMPORT-DATA.IMPORT-FILE-UPLOAD', {file: fileName}), false);

        const api = this.sessionService.active.connection.host;
        return this.http.post(`${this.api}${this.serviceUrl}/${uuid}`, formData, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.localProfil.key}`,
            })
        }).pipe(
            tap(() => {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-FILE', {file: fileName }), false);
            }),
        );
    }

    public launch(uuid: string, fileName: string, layer: string, container: string, inputLog: string): Observable<any> {

        const api = this.sessionService.active.connection.host;
        return this.http.post(`${api}${this.serviceUrl}/launch/${uuid}`, {}, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.localProfil.key}`,
            })
        }).pipe(
            tap(() => {
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-FILE-LAUNCH', {file: fileName}), false);
            }),
            catchError(() => {
                console.error('Erreur rasterization:', fileName);
                this.importUtilsService.sendMessageService(inputLog,
                    this.translateService.instant('IMPORT-DATA.IMPORT-FILE-RASTER-ERROR', {file: fileName, container, layer }), true);
                return of({name: fileName, valide: false });
            }),
        );
    }

}
