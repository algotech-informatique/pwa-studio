import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs-boolean',
    styleUrls: ['./data-inputs-boolean.component.scss'],
    templateUrl: './data-inputs-boolean.component.html',
})
export class DataInputsBooleanComponent {

    @Input() value;
    @Output() changed = new EventEmitter();

    constructor() {
    }

    activateBoolValue(event) {
        event.stopPropagation();
        this.value = !this.value;
        this.changed.emit(this.value);
    }
}
