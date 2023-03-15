import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'options-input',
    styleUrls: ['./options-input.component.scss'],
    templateUrl: './options-input.component.html',
})
export class OptionsInputComponent {

    @ViewChild('input') input: ElementRef;

    @Input() label = '';
    @Input() endLabel = '';
    @Input() readOnly = false;
    @Input() inputText: string;
    @Input() type = 'text';
    @Input() multiline = false;
    @Input() includeBottomBorder = false;
    @Input() isPassword = false;

    @Output() updateText = new EventEmitter<string>();
    @Output() keyPress = new EventEmitter<string>();

    showPassword = false;

    constructor() {
    }

    onInputChange() {
        this.updateText.emit(this.inputText);
    }

    focus() {
        this.input.nativeElement.focus();
    }

    onKeyPress(event) {
        this.keyPress.emit(this.inputText);
    }
}
