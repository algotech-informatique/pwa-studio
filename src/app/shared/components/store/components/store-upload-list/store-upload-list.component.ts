import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'store-upload-list',
    templateUrl: './store-upload-list.component.html',
    styleUrls: ['./store-upload-list.component.scss'],
})
export class StoreUploadListComponent implements OnInit {

    @Input() listObjects: OptionsObjectDto[] = [];
    @Input() clearLog: string;
    @Input() inputLog: string;
    @Input() forceSend: boolean;
    @Output() sendStore = new EventEmitter();
    @Output() removeItem = new EventEmitter();
    @Output() checkedChanged = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onSend() {
        this.sendStore.emit();
    }

    onRemoveObject(data) {
        this.removeItem.emit(data);
    }

    onChecked(data) {
        this.checkedChanged.emit(data);
    }
}
