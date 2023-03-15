import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs-number',
    styleUrls: ['./data-inputs-number.component.scss'],
    templateUrl: './data-inputs-number.component.html',
})
export class DataInputsNumberComponent {

    @Input() value: number;
    @Input() iconVisible = false;
    @Input() placeholder: string;
    @Output() changed = new EventEmitter();

    constructor() { }

    onChangeValue() {
        this.changed.emit(this.value);
    }

}
