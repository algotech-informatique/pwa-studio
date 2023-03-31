import { PairDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'options-radio',
    styleUrls: ['./options-radio.component.scss'],
    templateUrl: './options-radio.component.html',
})
export class OptionsRadioComponent {

    @Input() listRadio: PairDto[];
    @Input() value: any;
    @Input() name: string;
    @Output() radioChanged = new EventEmitter();

    constructor() {
    }

    updateLink(event, key) {
        this.radioChanged.emit(key);
        event.stopPropagation();
    }
}
