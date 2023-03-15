import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'options-object-list',
    templateUrl: './options-object-list.component.html',
    styleUrls: ['./options-object-list.component.scss'],
})
export class OptionsObjectListComponent implements OnInit {

    @Input() optionObjects: OptionsObjectDto[] = [];
    @Input() selectId: string;
    @Input() showLine = true;
    @Output() selectedObject = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    onObjectClick(object) {
        this.selectedObject.emit(object);
    }
}
