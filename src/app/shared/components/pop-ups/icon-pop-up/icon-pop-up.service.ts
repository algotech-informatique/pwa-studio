import { Injectable } from '@angular/core';
import { BaseService, AuthService, EnvService } from '@algotech-ce/angular';
import { IconDto } from '@algotech-ce/core';
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
}
