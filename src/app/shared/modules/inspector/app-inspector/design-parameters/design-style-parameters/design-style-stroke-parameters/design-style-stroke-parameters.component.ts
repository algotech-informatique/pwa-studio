import { SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as _ from 'lodash';

interface EleInterface {
    path: string;
    ref: SnPageWidgetDto;
}

interface StyleInterface {
    style: string;
    value: any;
    elements: EleInterface[];
}

@Component({
    selector: 'design-style-stroke-parameters',
    templateUrl: './design-style-stroke-parameters.component.html',
    styleUrls: ['./design-style-stroke-parameters.component.scss'],
})
export class DesignStyleStrokeParametersComponent implements OnChanges {

    @Input() strokeStyles: StyleInterface[];
    @Output() changed = new EventEmitter<StyleInterface[]>();

    width: StyleInterface;
    lineCap: StyleInterface;
    dashArray: StyleInterface;
    color: StyleInterface;
    gap: number;
    dash: number;
    thickness: number;

    ngOnChanges() {
        this.selectProperties();
    }

    selectlineCap(selectedlineCap: 'butt' | 'round' | 'square') {
        this.lineCap.value = selectedlineCap;
        this.updateStyles();
    }

    updateWidth(thickness: number) {
        this.width.value = `${thickness}px`;
        this.updateStyles();
    }

    selectColor(color: string) {
        this.color.value = color;
        this.updateStyles();
    }

    updateGap(gap: number) {
        this.gap = gap;
        this.dashArray.value = `${this.dash},${this.gap}`;
        this.updateStyles();
    }
    updateDash(dash: number) {
        this.dash = dash;
        this.dashArray.value = `${this.dash},${this.gap}`;
        this.updateStyles();
    }

    private selectProperties() {
        this.width = _.find(this.strokeStyles, (style: StyleInterface) => (style.style === 'stroke-width'));
        this.lineCap = _.find(this.strokeStyles, (style: StyleInterface) => (style.style === 'stroke-linecap'));
        this.dashArray = _.find(this.strokeStyles, (style: StyleInterface) => (style.style === 'stroke-dasharray'));
        this.color = _.find(this.strokeStyles, (style: StyleInterface) => (style.style === 'stroke-color'));
        this.thickness = (this.width) ? this.width.value.split('px')[0] : 3;
        this.dash = (this.dashArray?.value !== '' && this.dashArray?.value !== 'none') ? this.dashArray.value.split(',')[0] : 0;
        this.gap = (this.dashArray?.value !== '' && this.dashArray?.value !== 'none') ? this.dashArray.value.split(',')[1] : 0;
    }


    private updateStyles() {
        this.changed.emit(this.strokeStyles);
    }

}
