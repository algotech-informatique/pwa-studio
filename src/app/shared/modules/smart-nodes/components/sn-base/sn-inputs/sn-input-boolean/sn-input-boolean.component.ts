import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'sn-input-boolean',
    templateUrl: './sn-input-boolean.component.html',
    styleUrls: ['./sn-input-boolean.component.scss'],
})
export class SnInputBooleanComponent implements OnChanges {

    @Input() value = false;
    @Output() updateValue = new EventEmitter<boolean>();

    update($event) {
        $event.stopPropagation();
        this.value = !this.value;
        this.updateValue.emit(this.value);
    }

    ngOnChanges() {
        this.value = (this.value === undefined || this.value === null) ? false : this.value;
    }
}
