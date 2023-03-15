import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'design-style-radius-parameters',
    templateUrl: './design-style-radius-parameters.component.html',
    styleUrls: ['./design-style-radius-parameters.component.scss']
})
export class DesignStyleRadiusParametersComponent implements OnChanges {

    @Input() radiusValue: string;
    @Output() changed = new EventEmitter<string>();
    radiusValues: string[];
    showRadiusCorners = false;
    same: boolean;

    ngOnChanges() {

        this.radiusValues = this.radiusValue?.split(' ');
        this.same = !this.radiusValue ? true : this.radiusValues?.every((val) => val === this.radiusValues[0]);
        this.showRadiusCorners = !this.same;
    }

    cornersButtonClicked(all: boolean) {
        this.showRadiusCorners = !all;
    }

    onChanged(event: number) {
        this.changed.emit(event + 'px ' + event + 'px ' + event + 'px ' + event + 'px');
    }

    onCornerChanged(value: number, position: number) {
        this.radiusValues[position] = `${value}px`;
        this.changed.emit(this.radiusValues.join(' '));
    }

}
