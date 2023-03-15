import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs-date',
    styleUrls: ['./data-inputs-date.component.scss'],
    templateUrl: './data-inputs-date.component.html',
})
export class DataInputsDateComponent {

    @Input() value: Date;
    @Input() iconVisible = false;
    @Output() changed = new EventEmitter();

    constructor() { }

    onChangeValue() {
        this.changed.emit(this.value);
    }

}
