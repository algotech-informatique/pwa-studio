import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Time } from '@angular/common';

@Component({
    selector: 'data-inputs-time',
    styleUrls: ['./data-inputs-time.component.scss'],
    templateUrl: './data-inputs-time.component.html',
})
export class DataInputsTimeComponent {

    @Input() value: Time;
    @Input() iconVisible = false;
    @Output() changed = new EventEmitter();

    constructor() { }

    onChangeValue() {
        this.changed.emit(this.value);
    }

}
