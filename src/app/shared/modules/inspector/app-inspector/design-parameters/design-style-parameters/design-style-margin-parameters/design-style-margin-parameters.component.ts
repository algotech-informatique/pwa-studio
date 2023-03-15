import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'design-style-margin-parameters',
    templateUrl: './design-style-margin-parameters.component.html',
    styleUrls: ['./design-style-margin-parameters.component.scss']
})
export class DesignStyleMarginParametersComponent implements OnChanges {

    @Input() title: string;
    @Input() marginValue: string;
    @Output() changed = new EventEmitter<string>();
    marginValues: string[];
    showAllMargins = false;
    same: boolean;

    ngOnChanges() {
        this.marginValues = this.marginValue?.split(' ');
        this.same = !this.marginValue ? true : this.marginValues?.every((val) => val === this.marginValues[0]);
        this.showAllMargins = !this.same;
    }

    cornersButtonClicked(all: boolean) {
        this.showAllMargins = !all;
    }

    onChanged(event: number) {
        this.changed.emit(event + 'px ' + event + 'px ' + event + 'px ' + event + 'px');
    }

    onCornerChanged(value: number, position: number) {
        this.marginValues[position] = `${value}px`;
        this.changed.emit(this.marginValues.join(' '));
    }

}
