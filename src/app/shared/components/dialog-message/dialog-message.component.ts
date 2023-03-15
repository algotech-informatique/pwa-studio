import { DialogMessageService } from './../../services/message/dialog-message.service';
import { AlertMessageDto } from './../../dtos/alert-message.dto';
import { Component, OnDestroy } from '@angular/core';
import { MessageService } from '../../services';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-dialog-message',
    styleUrls: ['./dialog-message.component.scss'],
    templateUrl: './dialog-message.component.html',
})
export class DialogMessageComponent implements OnDestroy {

    title: string;
    subtitle: string;
    text: string;
    cancel: string;
    confirm: string;
    open = false;
    type: string;
    subscription: Subscription;

    constructor(
        private messageService: MessageService,
        private dialogMessageService: DialogMessageService,
    ) {
        this.subscription = this.messageService.get('dialog-message-open').subscribe((message: AlertMessageDto) => {
            this.title = message.title;
            this.subtitle = message.message;
            this.text = message.detail;
            this.cancel = message.cancel;
            this.confirm = message.confirm;
            this.type = message.type;
            this.open = true;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickClose(open: boolean) {
        if (!open && this.open) {
            this.clickCancel();
        }
    }

    clickCancel() {
        this.dialogMessageService.setDialogResponse(false);
        this.open = false;
    }

    clickConfirm() {
        this.dialogMessageService.setDialogResponse(true);
        this.open = false;
    }

}
