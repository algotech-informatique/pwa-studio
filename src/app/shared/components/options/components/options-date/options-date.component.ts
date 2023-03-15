import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'options-date',
    styleUrls: ['./options-date.component.scss'],
    templateUrl: './options-date.component.html',
})
export class OptionsDateComponent {

    @Input() label = '';
    @Input() readOnly = false;
    @Input() duration: Date;
    @Input() includeBottomBorder = false;
    @Output() updateDate = new EventEmitter<Date>();

    constructor() {
    }

    onSelectDate(value: Date) {
        this.updateDate.emit(value);
    }
}
