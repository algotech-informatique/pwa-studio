import { SettingsUpdateService } from './../../services/settings/settings-update.service';
import { mergeMap, catchError, map, debounceTime } from 'rxjs/operators';
import { SessionsService } from '../../services';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BaseService, AuthService, EnvService } from '@algotech-ce/angular';
import { Injectable } from '@angular/core';
import { PlayerManifestDto } from '@algotech-ce/core';
import * as _ from 'lodash';


@Injectable()
export class ManifestSettingsService extends BaseService<PlayerManifestDto> {

    update$ = new Subject<PlayerManifestDto>();
    private manifest: PlayerManifestDto;

    constructor(
        private sessionService: SessionsService,
        protected http: HttpClient,
        protected authService: AuthService,
        protected env: EnvService,
        protected settingsUpdateService: SettingsUpdateService
    ) {
        super(authService, http, env);

        this.settingsUpdateService.initialize(this.sessionService.active.datas.read.settings);
        this.api = this.sessionService.active.connection.host;
        this.update$.pipe(
            debounceTime(200),
            mergeMap((player: PlayerManifestDto) => {
                player.icons = [];
                Object.assign(this.settingsUpdateService.settings, { player });
                return this.settingsUpdateService.settingsUpdate();
            })
        ).subscribe();

    }

    update(player: PlayerManifestDto) {
        this.update$.next(player);
    }

    getManifest(): Observable<PlayerManifestDto> {
        return this.http.get<PlayerManifestDto>(`${this.api}/manifest`).pipe(
            map((manifest: PlayerManifestDto) => {
                this.manifest = manifest;
                return manifest;
            })
        );
    }

    downloadIcon(): Observable<File> {
        return this.http.get(`${this.api}/files/player/player_icon-144x144`, { responseType: 'blob' }).pipe(
            catchError(() => throwError(null)),
            map((myblob: Blob) => new File([myblob], 'manifestIcon', { type: myblob.type }))
        );
    }

    uploadFile(file: File): Observable<any> {
        const formData: FormData = new FormData();
        if (file) {
            formData.append('file', file);
        }

        const url = `${this.api}/files/upload/player/icon`;
        return this.obsHeaders().pipe(
            mergeMap((headers: HttpHeaders) => {
                let newHeaders = _.cloneDeep(headers);
                newHeaders = newHeaders.delete('Content-Type');
                newHeaders = newHeaders.delete('Accept');
                return this.http.post(url, formData, { headers: newHeaders, });
            }),
            catchError((error: HttpErrorResponse) => this.handleError(this.uploadFile(file), error))
        );
    }
}
