import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs-datetime',
    styleUrls: ['./data-inputs-datetime.component.scss'],
    templateUrl: './data-inputs-datetime.component.html',
})
export class DataInputsDatetimeComponent {

    @Input() value;
    @Input() iconVisible = false;
    @Output() changed = new EventEmitter();

    constructor() { }

    onChangeValue() {
        this.changed.emit(this.value);
    }

}
