import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'options-checkbox',
    styleUrls: ['./options-checkbox.component.scss'],
    templateUrl: './options-checkbox.component.html',
})
export class OptionsCheckboxComponent {

    @Input() label = '';
    @Input() checkElement: boolean;
    @Input() selected = false;
    @Input() readOnly = false;
    @Output() checkedChange = new EventEmitter();

    constructor() {
    }

    updateChecked() {
        this.checkedChange.emit(this.checkElement);
    }
}
