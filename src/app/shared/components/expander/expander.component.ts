import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos';
@Component({
    selector: 'app-expander',
    styleUrls: ['./expander.component.scss'],
    templateUrl: './expander.component.html',
})
export class ExpanderComponent {

    @Input() name: string;
    @Input() icons = [['fad', 'chevron-down'], ['fad', 'chevron-right']];
    @Input() icon = [];
    @Input() selected = false;
    @Input() active = false;
    @Input() actions = [];
    @Input() renaming: boolean;
    @Input() line: ObjectTreeLineDto = null;
    @Input() type: string = null;
    @Input() host: string = null;
    @Input() customerKey: string = null;
    @Output() handleExpand = new EventEmitter;
    @Output() handleAction = new EventEmitter;

    _expand: any = undefined;
    @Input()
    get expand() {
        return this._expand;
    }

    @Output()
    expandChange = new EventEmitter();
    set expand(data) {
        this._expand = data;
        this.expandChange.emit(data);
    }

    constructor() { }

    expandAction() {
        this.expand = !this.expand;
        this.handleExpand.emit();
    }

    actionClicked(index: number) {
        this.handleAction.emit(index);
    }
}
