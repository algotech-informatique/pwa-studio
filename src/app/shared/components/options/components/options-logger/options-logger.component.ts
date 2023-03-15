import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DialogMessageService, MessageService } from '../../../../services';
import * as _ from 'lodash';
import { OptionLoggerMessage } from './option-logger-message.dto';
import { Subscription } from 'rxjs';

@Component({
    selector: 'options-logger',
    templateUrl: './options-logger.component.html',
    styleUrls: ['./options-logger.component.scss'],
})
export class OptionsLoggerComponent implements OnInit, OnDestroy {

    @Input() readOnly = true;
    @Input() rows = 6;
    @Input() loadLog = '';
    @Input() clearLog = '';
    @Input() exportLog = false;

    @Output() inputChanged = new EventEmitter<OptionLoggerMessage[]>();

    listMessage:  OptionLoggerMessage[] = [];
    subscription: Subscription;

    constructor(
        private messageService: MessageService,
        private dialogMessageService: DialogMessageService,
        private ref: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.subscription = this.messageService.get(this.loadLog).subscribe(
            (data: OptionLoggerMessage) => {
                if (data.message === '#') {
                    this.listMessage.push({ message: '<hr>', isError: false, isWarning: false });
                } else {
                    const mess: OptionLoggerMessage = {
                        message: data.message,
                        isError: data.isError,
                        isWarning: data.isWarning,
                    };
                    this.listMessage.push(mess);
                }
                this.ref.detectChanges();
        });

        this.subscription.add(this.messageService.get(this.clearLog).subscribe(() => {
            this.listMessage = [];
            this.ref.detectChanges();
        }));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    onInputChange() {
        this.inputChanged.emit(this.listMessage);
    }

    onExportLog() {

        if (this.listMessage.length === 0) {
            return false;
        }

        const logArray = typeof this.listMessage !== 'object' ? JSON.parse(this.listMessage) : this.listMessage;
        let str = '';
        const keys = Object.keys(this.listMessage[0]);
        str += keys.join(';')  + '\r\n';
        const lines = _.reduce(this.listMessage, (res, message: OptionLoggerMessage) => {
            if (message.message !== '<hr>') {
                const elements = _.reduce(keys, (result, key) => {
                    result.push( (message[key]) ? message[key] : '');
                    return result;
                }, []);
                res.push(elements.join(';'));
            }
            return res;
        }, []);

        str += lines.join('\r\n');
        this.dialogMessageService.getSaveMessage(
            str,
            'text/csv;encoding:utf-8',
            'export_log.csv'
        );
    }
}
