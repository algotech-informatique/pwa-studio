import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
    selector: 'design-style-shadow-parameters',
    templateUrl: './design-style-shadow-parameters.component.html',
    styleUrls: ['./design-style-shadow-parameters.component.scss'],
})
export class DesignStyleShadowParametersComponent implements OnChanges {
    @Input()
    defaultValue: any;

    @Output()
    changed = new EventEmitter();

    shadowValues = [0, 0, 0, 0, '#000', 80];

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.defaultValue.currentValue || changes.defaultValue.currentValue !== 'unset') {
            this._setBoxShadowValue(changes.defaultValue.currentValue);
        }
    }

    onChanged(order: number, value: any) {
        this.shadowValues[order] = value;
        const newBoxShadowvalue = this._getBoxShadow();
        this.changed.emit(newBoxShadowvalue);
    }

    resetShadow() {
        this.defaultValue = 'unset';
        this.changed.emit(this.defaultValue);
        this.shadowValues = [0, 0, 0, 0, '#000', 80];
    }

    onShowShadowChanged(show: boolean) {
        if (show) {
            this.shadowValues = [0, 2, 5, 0, '#000000a6'];
            const newBoxShadowvalue = this._getBoxShadow();
            this.changed.emit(newBoxShadowvalue);
        } else {
            this.resetShadow();
        }
    }

    _setBoxShadowValue(value: string) {
        if (!value) {
            return;
        }
        const rawValues = value.split(' ');
        if (rawValues.length !== 5) {
            // if error return default values
            return this.shadowValues;
        }
        for (let i = 0; i < 4; i++) {
            this.shadowValues[i] = parseInt(rawValues[i].replace('px', ''), 10);
        }
        const color = rawValues[4];
        this.shadowValues[4] = color;
    }

    _getBoxShadow(): string {
        return `${this.shadowValues[0]}px ${this.shadowValues[1]}px ${this.shadowValues[2]}px ${this.shadowValues[3]}px ${this.shadowValues[4]}`
    }

}
