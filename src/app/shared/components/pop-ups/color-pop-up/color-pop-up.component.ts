import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';

@Component({
    selector: 'color-pop-up',
    templateUrl: './color-pop-up.component.html',
    styleUrls: ['./color-pop-up.component.scss'],
})
export class ColorPopUpComponent {

    maxHeight = 250;

    @Input() snView: SnView;
    @Input() color = '';
    @Input() withHeader = true;
    @Input() outputFormat = 'hex';

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
    @Output() closed = new EventEmitter();

    constructor() {
    }

    onColorChange(event) {
        this.color = event;
        this.changed.emit(this.color);
    }

    close() {
        this.top = null;
        this.closed.emit();
    }
}
