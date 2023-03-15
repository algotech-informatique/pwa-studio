import { Component, Input, Output, EventEmitter } from '@angular/core';
import moment from 'moment';
@Component({
    selector: 'sn-input-time',
    templateUrl: './sn-input-time.component.html',
    styleUrls: ['./sn-input-time.component.scss'],
})
export class SnInputTimeComponent {

    @Input() value: Date;
    @Output() updateValue = new EventEmitter<string>();

    update(value: string) {
        const formatValue = moment(value, 'HH:mm').isValid() ? moment(value, 'HH:mm').format('HH:mm:ss') : null;
        this.updateValue.emit(formatValue);
    }
}
