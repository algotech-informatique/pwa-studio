import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';

@Component({
    selector: 'connector-pop-up',
    templateUrl: './connector-pop-up.component.html',
    styleUrls: ['./connector-pop-up.component.scss'],
})
export class ConnectorPopUpComponent {

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
    @Output() changed = new EventEmitter();

    snView: SnView = null;

    constructor() {
    }

    createServer(event) {
        this.top = null;
        this.changed.emit('custom');
    }

    createCloud(event) {
        this.top = null;
        this.changed.emit('cloud');
    }
}
