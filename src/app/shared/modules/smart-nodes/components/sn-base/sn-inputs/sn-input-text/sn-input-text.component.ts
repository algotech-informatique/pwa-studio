import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';

@Component({
    selector: 'sn-input-text',
    templateUrl: './sn-input-text.component.html',
    styleUrls: ['./sn-input-text.component.scss'],
})
export class SnInputTextComponent implements OnChanges {

    @Input() value: string;
    @Input() type: 'text' | 'password' = 'text';
    @Output() updateValue = new EventEmitter<string>();

    ngOnChanges() {
        this.value = this.value ? this.value : '';
    }

    update(value: string) {
        this.updateValue.emit(value);
    }

}
