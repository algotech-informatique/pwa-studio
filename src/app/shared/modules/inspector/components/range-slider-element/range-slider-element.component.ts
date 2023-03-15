import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'range-slider-element',
  templateUrl: './range-slider-element.component.html',
  styleUrls: ['./range-slider-element.component.scss'],
})
export class RangeSliderElementComponent {

    @Input() min: number;
    @Input() max: number;
    @Input() value: number;
    @Output() changed = new EventEmitter<number>();

    onRangeChange() {
        this.changed.emit(this.value);
    }

}
