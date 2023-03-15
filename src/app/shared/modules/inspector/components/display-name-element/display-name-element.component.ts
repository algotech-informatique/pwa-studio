import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'display-name-element',
    templateUrl: './display-name-element.component.html',
    styleUrls: ['./display-name-element.component.scss'],
})
export class DisplayNameElementComponent {

    @Input() title: string;
    @Input() name: string;
    @Output() changed = new EventEmitter<string>();

    changeValue() {
        this.changed.emit(this.name);
    }

}
