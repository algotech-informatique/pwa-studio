import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'design-style-margin-padding-parameters',
    templateUrl: './design-style-margin-padding-parameters.component.html',
    styleUrls: ['./design-style-margin-padding-parameters.component.scss']
})
export class DesignStyleMarginPaddingParametersComponent {

    @Input() style: any;
    @Output() changed = new EventEmitter();
    showMore = false;

    toggleShowMore() {
        this.showMore = !this.showMore;
    }

    onMarginChanged(value: string) {
        this.style.margin = value;
        this.changed.emit({
            path: 'margin',
            value: this.style.margin,
        });
    }

    onPaddingChanged(value: string) {
        this.style.padding = value;
        this.changed.emit({
            path: 'padding',
            value: this.style.padding,
        });
    }

}
