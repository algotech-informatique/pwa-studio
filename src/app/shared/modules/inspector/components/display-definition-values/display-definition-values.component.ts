import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'display-definition-values',
    templateUrl: './display-definition-values.component.html',
    styleUrls: ['./display-definition-values.component.scss'],
})
export class DisplayDefinitionValuesComponent implements OnChanges {

    @ViewChild('widthInput') widthInput: ElementRef;
    @ViewChild('heightInput') heightInput: ElementRef;
    @Input() widthLabel = 'W';
    @Input() heightLabel = 'H';
    @Input() width: number | string;
    @Input() height: number | string;
    @Input() unit = 'px';
    @Input() roundValue = false;
    @Input() minWidth = 0;
    @Input() minHeight = 0;
    @Input() title: string;
    @Input() subTitle: string;
    @Input() heightDisabled = false;
    @Input() widthDisabled = false;
    @Output() changedWidth = new EventEmitter<number>();
    @Output() changedHeight = new EventEmitter<number>();

    ngOnChanges() {
        this.width = typeof this.width === 'string' ? this.width.split('px')?.[0] : this.width;
        this.height = typeof this.height === 'string' ? this.height.split('px')?.[0] : this.height;
    }

    changeWidth(width: number) {
        if (parseFloat(width.toString()) >= parseFloat(this.minWidth.toString())) {
            this.width = +(this.roundValue ? Math.round(width) : width);
            this.changedWidth.emit(this.width);
        } else {
            this.widthInput.nativeElement.value = this.width;
        }
    }

    changeHeight(height: number) {
        if (height && height >= this.minHeight) {
            this.height = +(this.roundValue ? Math.round(height) : height);
            this.changedHeight.emit(this.height);
        } else {
            this.heightInput.nativeElement.value = this.height;
        }
    }

}
