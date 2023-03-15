import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OptionsMultipleDto } from '../../../dtos';
import { SnView } from '../../../modules/smart-nodes';

@Component({
    selector: 'check-list-pop-up',
    templateUrl: './check-list-pop-up.component.html',
    styleUrls: ['./check-list-pop-up.component.scss'],
})
export class CheckListPopUpComponent {

    @Input() listItems: OptionsMultipleDto[] = [];
    @Input() snView: SnView;
    @Input() title: string;

    _top: any = null;
    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }
    @Output() checkedChanged = new EventEmitter();

    constructor() { }

    onCheckedChanged(key) {
        this.checkedChanged.emit(key);
    }

    close() {
        this.top = 0;
    }
}
