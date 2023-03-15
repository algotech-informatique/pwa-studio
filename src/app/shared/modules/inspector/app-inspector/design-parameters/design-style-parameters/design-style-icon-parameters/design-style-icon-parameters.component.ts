import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'design-style-icon-parameters',
    templateUrl: './design-style-icon-parameters.component.html',
    styleUrls: ['./design-style-icon-parameters.component.scss']
})
export class DesignStyleIconParametersComponent {

    @Input() iconStyle: any;
    @Output() changed = new EventEmitter();

    onSizeChanged(value: number) {
        this.iconStyle['font-size'] = `${value}px`;
        this.changed.emit({
            path: 'font-size',
            value: this.iconStyle['font-size']
        });
    }

    onColorChanged(color: string) {
        this.iconStyle.color = color;
        this.changed.emit({
            path: 'color',
            value: this.iconStyle.color
        });
    }

    onMarginPaddingChanged(value: any) {
        this.changed.emit(value);
    }

}
