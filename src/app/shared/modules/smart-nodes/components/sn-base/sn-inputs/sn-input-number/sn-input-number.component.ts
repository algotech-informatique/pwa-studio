import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sn-input-number',
    templateUrl: './sn-input-number.component.html',
    styleUrls: ['./sn-input-number.component.scss'],
})
export class SnInputNumberComponent {

    @Input() value: number;
    @Output() updateValue = new EventEmitter<number>();

    update(value: number) {
        this.updateValue.emit(+value);
    }

}
