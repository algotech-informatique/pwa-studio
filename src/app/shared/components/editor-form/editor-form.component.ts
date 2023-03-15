import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'editor-form',
    templateUrl: './editor-form.component.html',
    styleUrls: ['./editor-form.component.scss'],
})
export class EditorFormComponent {

    @Input() enabled = false;
    @Output() toggleChange = new EventEmitter<boolean>();
    constructor() { }

    onEmitChanged(event) {
        this.toggleChange.emit(event);
    }
}
