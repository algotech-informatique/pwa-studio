import { Component, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
@Component({
    selector: 'sn-input-date',
    templateUrl: './sn-input-date.component.html',
    styleUrls: ['./sn-input-date.component.scss'],
})
export class SnInputDateComponent {

    @Input() value: Date;
    @Output() updateValue = new EventEmitter<string>();

    update(value: Date) {
        const formatValue = moment(value).isValid() ? moment(value).startOf('day').format() : null;
        this.updateValue.emit(formatValue);
    }
}
