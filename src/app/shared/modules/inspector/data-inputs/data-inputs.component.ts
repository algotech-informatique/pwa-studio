import { PairDto } from '@algotech-ce/core';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'data-inputs',
    styleUrls: ['./data-inputs.component.scss'],
    templateUrl: './data-inputs.component.html',
})
export class DataInputsComponent {

    @Input() typeInput;
    @Input() title = '';
    @Input() subTitle: string;
    @Input() inputKey;
    @Input() value;
    @Input() iconVisible = false;
    @Input() placeholder: string;
    @Output() changed = new EventEmitter<PairDto>();

    constructor() { }

    onDataChanged(data) {
        this.changed.emit({key: this.inputKey, value: data });
    }
}
