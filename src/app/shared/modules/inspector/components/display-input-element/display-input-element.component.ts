import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { WidgetInput } from '../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { DataSelectorResult } from '../../dto/data-selector-result.dto';

@Component({
    selector: 'display-input-element',
    templateUrl: './display-input-element.component.html',
    styleUrls: ['./display-input-element.component.scss'],
})
export class DisplayInputElementComponent {

    @ViewChild('textarea') textarea: ElementRef;
    @ViewChild('container') container: ElementRef;

    @Input() title: string;
    @Input() rows = 10;
    @Input() items: Observable<WidgetInput[]>;
    @Output() changed = new EventEmitter<string>();

    @Input()
    get value() {
        return this._value;
    }
    _value: any = null;

    @Output()
    valueChange = new EventEmitter<string>();
    set value(data) {
        this._value = data;
        this.valueChange.emit(this._value);
    }

    itemsContainer: PopupContainerDto;
    popupMargin = 3;
    showDataSelector = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    openDataSelector(event: any) {
        event.stopPropagation();
        this.itemsContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.showDataSelector = !this.showDataSelector;
        this.changeDetectorRef.detectChanges();
    }

    addInput(inputText: DataSelectorResult) {
        if (this.value) {
            const startPosition = this.textarea.nativeElement.selectionStart;
            const endPosition = this.textarea.nativeElement.selectionEnd;
            const startText: string = this.value.slice(0, startPosition);
            const endText: string = this.value.slice(endPosition);
            this.value = startText + inputText.path + endText;
            this.textarea.nativeElement.value = this.value;
            this.textarea.nativeElement.focus();
            this.textarea.nativeElement.selectionStart = startPosition + inputText.path.length;
            this.textarea.nativeElement.selectionEnd = startPosition + inputText.path.length;
        } else {
            this.value = inputText.path;
        }
        this.closeDataSelector();
        this.changeValue();
    }

    changeValue() {
        this.changed.emit(this.value);
    }

    closeDataSelector() {
        this.showDataSelector = false;
    }

}
