import { Component, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';

@Component({
    selector: 'sn-input-datetime',
    templateUrl: './sn-input-datetime.component.html',
    styleUrls: ['./sn-input-datetime.component.scss'],
})
export class SnInputDatetimeComponent {

    @Input() value: Date;
    @Output() updateValue = new EventEmitter<string>();

    update(value: Date) {
        const formatValue = moment(value).isValid() ? moment(value).format() : null;
        this.updateValue.emit(formatValue);
    }

}
