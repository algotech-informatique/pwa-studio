import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'sn-edit-button-formatting',
    templateUrl: './sn-edit-button-formatting.component.html',
    styleUrls: ['./sn-edit-button-formatting.component.scss']
})
export class SnEditButtonFormattingComponent implements OnInit {

    @Output() buttonClick = new EventEmitter();
    constructor() { }

    ngOnInit(): void {
    }

    onButtonClick(event) {
        this.buttonClick.emit(event);
    }
}
