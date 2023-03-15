import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'options-input-checkbox',
    templateUrl: './options-input-checkbox.component.html',
    styleUrls: ['./options-input-checkbox.component.scss'],
})
export class OptionsInputCheckboxComponent implements OnChanges {

    @ViewChild('input') input: ElementRef;

    @Input() label = '';
    @Input() endLabel = '';
    @Input() readOnly = false;
    @Input() inputText: string;
    @Input() includeBottomBorder = false;
    @Input() type = 'text';
    @Input() checkElement = false;

    @Output() updateText = new EventEmitter<string>();
    @Output() keyPress = new EventEmitter<string>();
    @Output() updateCheck = new EventEmitter<boolean>();

    activeText = false;
    selected = false;

    constructor() { }

    ngOnChanges() {
        this.onActive();
    }

    onActive() {
        this.activeText =  !(this.checkElement && (this.readOnly === false));
        this.selected = this.checkElement;
    }

    updateChecked() {
        this.onActive();
        this.updateCheck.emit(this.checkElement);
    }

    onInputChange() {
        this.updateText.emit(this.inputText);
    }

    onKeyPress() {
        this.keyPress.emit(this.inputText);
    }

}
