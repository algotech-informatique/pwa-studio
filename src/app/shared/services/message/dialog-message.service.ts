import { MessageService } from './message.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertMessageDto } from '../../dtos';
import { map, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class DialogMessageService {

    private dialogResponse = new Subject<boolean>();

    constructor(
        private messageService: MessageService,
        private translateService: TranslateService,
    ) { }

    setDialogResponse(value) {
        this.dialogResponse.next(value);
    }

    public getMessageConfirm(alertMessage: AlertMessageDto) {
        this.messageService.send('dialog-message-open', alertMessage);
        return this.dialogResponse.pipe(
            take(1),
            map((response) => {
                return response;
            }),
        );
    }

    public getSaveMessage(file: any, fileType: string, fileName: string, fileExt = ''): boolean {
        try {
            const downloadLink = document.createElement('a');
            downloadLink.href = URL.createObjectURL( new Blob([file], { type: fileType }));
            downloadLink.download = fileName;
            downloadLink.title = this.translateService.instant('DIALOGBOX.SAVE-MESSAGE-TITLE', {type: fileExt });
            downloadLink.click();
            return true;
        } catch (err) {
            return false;
        }
    }

}
