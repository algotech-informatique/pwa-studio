import { PairDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';

@Component({
    selector: 'selector-pop-up',
    templateUrl: './selector-pop-up.component.html',
    styleUrls: ['./selector-pop-up.component.scss'],
})
export class SelectorPopUpComponent implements OnInit {

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

    @Input() listElements: SnPageWidgetDto[] = [];
    @Input() snView: SnView = null;
    @Input() selected: string;

    constructor() { }

    ngOnInit() { }

    onElementClick(element: SnPageWidgetDto) {
        this.changed.emit(element);
        this.top = 0;
    }
}
