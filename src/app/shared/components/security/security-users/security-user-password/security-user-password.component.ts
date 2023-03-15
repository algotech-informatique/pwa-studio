import { UserDto } from '@algotech/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../../../../services';
import { SecurityUserPasswordService } from './security-user-password.service';

@Component({
    selector: 'security-user-password',
    templateUrl: './security-user-password.component.html',
    styleUrls: ['./security-user-password.component.scss'],
})
export class SecurityUserPasswordComponent implements OnInit {

    @Input() user: UserDto;
    @Output() close = new EventEmitter();

    newPassword = '';
    sendMail = true;

    constructor(
        private translateService: TranslateService,
        private toastService: ToastService,
        private securityUserPassword: SecurityUserPasswordService,
    ) { }

    ngOnInit() { }

    onClose(event) {
        this.close.emit(event);
    }

    onChangePassword(data) {
        this.newPassword = data;
    }

    onChangeSendMail(data) {
        this.sendMail = data;
    }

    onSendMail() {
        this.securityUserPassword.resetPasswordByAdmin(this.newPassword, this.sendMail, this.user.uuid).pipe(
            map((res) => ({ modify: res, err: '' })),
            catchError((err: HttpErrorResponse) => {
                return of({
                    modify: false,
                    err: this.translateService.instant('SETTINGS.SECURITY.USERS.ACTIONS.PASSWORD-ERROR'),
                });
            }),
        ).subscribe((result) => {
            if (result.modify) {
                this.toastService.addToast('success', '',
                    this.translateService.instant('SETTINGS.SECURITY.USERS.ACTIONS.PASSWORD-OK'), 1500);
                this.close.emit(null);
            } else {
                this.toastService.addToast('error', '', result.err, 3000);
            }
        });
    }
}
