import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'options-toggle',
    templateUrl: './options-toggle.component.html',
    styleUrls: ['./options-toggle.component.scss'],
})
export class OptionsToggleComponent implements OnChanges {

    @Input() checked = false;
    @Output() checkedChanged = new EventEmitter<boolean>();

    constructor() { }

    ngOnChanges() {
        this.checked = (this.checked === undefined || this.checked === null) ? false : this.checked;
    }

    update($event) {
        $event.stopPropagation();
        this.checked = !this.checked;
        this.checkedChanged.emit(this.checked);
    }

}
