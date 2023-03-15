import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';
import * as _ from 'lodash';

@Component({
    selector: 'display-input-pop-up',
    templateUrl: './display-input-pop-up.component.html',
    styleUrls: ['./display-input-pop-up.component.scss'],
})
export class DisplayInputPopUpComponent {

    @Input() snView: SnView;

    @Input()
    get value() {
        return this._value;
    }
    _value: any = null;

    @Output()
    valueChange = new EventEmitter();
    set value(data) {
        this._value = data;
        this.changeValue();
    }



    _top: any = null;
    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        if (!data) {
            this.changeValue();
        }
        this._top = data;
        this.topChange.emit(data);
    }

    constructor() { }

    changeValue() {
        this.valueChange.emit(this.value);
    }

    close() {
        this.top = null;
    }
}
