import { AuthService, BaseService, EnvService } from '@algotech/angular';
import { ResetPasswordAdminDto, UserDto } from '@algotech/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, flatMap } from 'rxjs/operators';
import { SessionsService } from '../../../../services';

@Injectable()
export class SecurityUserPasswordService extends BaseService<UserDto> {

    constructor(
        protected authService: AuthService,
        protected http: HttpClient,
        protected env: EnvService,
        private sessionService: SessionsService,
    ) {
        super(authService, http, env);
        this.serviceUrl = '/auth';
    }

    public resetPasswordByAdmin(newPassword: string, sendMail: boolean, userUuid: string): Observable<boolean> {
        const resetPassword: ResetPasswordAdminDto = {
            url:  this.sessionService.active.connection.host.replace('/api', ''),
            newPassword: newPassword,
            userUuid: userUuid,
            sendMail: sendMail,
        };

        return this.obsHeaders()
            .pipe(
                flatMap((headers: HttpHeaders) => {
                    return this.http.post(`${this.api}${this.serviceUrl}/resetPasswordAdmin`, resetPassword, { headers });
                }),
                catchError((error: HttpErrorResponse) =>
                    this.handleError(this.resetPasswordByAdmin(newPassword, sendMail, userUuid), error))
        );
    }
}
