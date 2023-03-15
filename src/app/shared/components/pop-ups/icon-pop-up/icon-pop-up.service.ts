import { Injectable } from '@angular/core';
import { BaseService, AuthService, EnvService } from '@algotech/angular';
import { IconDto } from '@algotech/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

@Injectable()
export class IconPopUpService extends BaseService<IconDto> {

    constructor(protected http: HttpClient,
        protected authService: AuthService,
        protected env: EnvService) {
        super(authService, http, env);
        this.serviceUrl = '/icons';
    }

    getAllIcons(page: number, pageSize: number): Observable<IconDto[]> {
        return this.obsHeaders()
            .pipe(
                flatMap((headers: HttpHeaders) =>
                    this.http.get(`${this.api}${this.serviceUrl}?page=${page}&pageSize=${pageSize}`, { headers })),
                catchError((error: HttpErrorResponse) => this.handleError(this.getAllIcons(page, pageSize), error))
            );
    }

    getSearchedIcons(term: string, page: number, pageSize: number): Observable<IconDto[]> {
        return this.obsHeaders()
            .pipe(
                flatMap((headers: HttpHeaders) => this.http.get(`${this.api}${this.serviceUrl}/search/${term}?page=${page}&pageSize=${pageSize}`, { headers })),
                catchError((error: HttpErrorResponse) => this.handleError(this.getSearchedIcons(term, page, pageSize), error))
            );
    }

    getIconByName(name: string): Observable<any> {
        return this.obsHeaders()
            .pipe(
                flatMap((headers: HttpHeaders) => {
                    return this.http.get(`${this.api}${this.serviceUrl}/read/${name}`, { headers, responseType: 'text' });
                }),
                catchError((error: HttpErrorResponse) => this.handleError(this.getIconByName(name), error))
            );
    }

    getIcon(id: string): Observable<any> {
        return this.obsHeaders()
            .pipe(
                flatMap((headers: HttpHeaders) => {
                    return this.http.get(`${this.api}${this.serviceUrl}/display/${id}`, { headers, responseType: 'text' });
                }),
                catchError((error: HttpErrorResponse) => this.handleError(this.getIcon(id), error))
            );
    }

    transformSvg(svg: string) {
        if (svg.includes('<svg ') && !svg.includes('style')) {
            svg = svg.replace(' ', ` style="position: absolute; height: 100%; width: 100%; left: 0; top: 0;" `);
        }
        return svg;
    }
}
