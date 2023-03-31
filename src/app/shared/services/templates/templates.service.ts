import { Injectable } from '@angular/core';
import { BaseService, EnvService, AuthService } from '@algotech-ce/angular';
import { Metadata } from '@algotech-ce/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { flatMap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { SessionsService } from '../sessions/sessions.service';

@Injectable({
    providedIn: 'root'
})
export class TemplatesService extends BaseService<Metadata> {

    constructor(
        private sessionService: SessionsService,
        protected authService: AuthService,
        protected http: HttpClient,
        protected env: EnvService
    ) {
        super(authService, http, env);
        this.serviceUrl = '/templates';
    }

    upload(update: boolean, uuid: string, file: File): Observable<boolean> {
        const formData = new FormData();
        formData.append('file', file, file.name);
        this.api = this.sessionService.active.connection.host;
        const uploaTemplate$ = this.http.post(`${this.api}${this.serviceUrl}/${uuid}`, formData, {
            headers: new HttpHeaders({
                Authorization: `Bearer ${this.authService.localProfil.key}`,
            })
        }).pipe(
            catchError(() => of(false)),
            flatMap(() => of(true)));
        if (update) {
            return this.delete(uuid).pipe(
                flatMap((deleted) => {
                    if (!deleted) {
                        return of(false);
                    }
                    return uploaTemplate$;
                })
            );
        } else {
            return uploaTemplate$;
        }
    }

    delete(uuid: string): Observable<boolean> {
        this.api = this.sessionService.active.connection.host;
        return this.obsHeaders()
            .pipe(
                flatMap(() => this.http.delete<boolean>(`${this.api}${this.serviceUrl}/deleteFile/${uuid}`, {
                    headers: new HttpHeaders({
                        Authorization: `Bearer ${this.authService.localProfil.key}`,
                    })
                })),
            );
    }
}
