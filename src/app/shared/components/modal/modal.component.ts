import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MessageService } from '../../services';

@Component({
    selector: 'app-modal',
    styleUrls: ['./modal.component.scss'],
    templateUrl: './modal.component.html',
})
export class ModalComponent {
    @Input() iconTitle: string;
    @Input() title: string;
    @Input() closable = true;

    _open: any = true;
    @Input()
    get open() {
        return this._open;
    }
    @Output()
    openChange = new EventEmitter();
    set open(data) {
        this._open = data;
        this.openChange.emit(data);
    }

    constructor(public messageService: MessageService) { }

    close() {
        this.open = false;
        this.messageService.send('modal-closed', { title: this.title });
    }
}
