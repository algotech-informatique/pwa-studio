import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs-text',
    styleUrls: ['./data-inputs-text.component.scss'],
    templateUrl: './data-inputs-text.component.html',
})
export class DataInputsTextComponent {

    @Input() value: string;
    @Input() iconVisible = false;
    @Input() placeholder: string;
    @Output() changed = new EventEmitter();

    constructor() { }

    onChangeValue() {
        this.changed.emit(this.value);
    }

}
