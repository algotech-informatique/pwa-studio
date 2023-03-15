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
    selector: 'design-style-border-parameters',
    templateUrl: './design-style-border-parameters.component.html',
    styleUrls: ['./design-style-border-parameters.component.scss'],
})
export class DesignStyleBorderParametersComponent implements OnChanges {

    @Input() bordersStyles: StyleInterface[];
    @Output() changed = new EventEmitter<StyleInterface[]>();

    same: boolean;
    selected: 'top' | 'right' | 'bottom' | 'left' | 'all';
    typeSelected: 'solid' | 'dashed' | 'dotted';
    thicknessSelected: number;
    colorSelected: string;

    ngOnChanges() {
        this.same = this.bordersStyles?.every((style) => style.value === this.bordersStyles[0].value);
        this.selected = this.same ?
            'all' :
            this.selected ? this.selected : 'top';
        this.selectProperties();
    }

    selectBorder(selection: 'top' | 'right' | 'bottom' | 'left' | 'all') {
        this.selected = selection;
        this.selectProperties();
    }

    selectType(type: 'solid' | 'dashed' | 'dotted') {
        this.typeSelected = type;
        if (!this.thicknessSelected) {
            this.thicknessSelected = 1;
        }
        if (!this.colorSelected) {
            this.colorSelected = '#000000';
        }
        this.updateStyles();
    }

    updateThickness(thickness: number) {
        this.thicknessSelected = thickness;
        this.updateStyles();
    }

    selectColor(color: string) {
        this.colorSelected = color;
        this.updateStyles();
    }

    private selectProperties() {
        const style: StyleInterface = this.selected === 'all' ?
            this.bordersStyles[0] :
            _.find(this.bordersStyles, (borderStyle: StyleInterface) => borderStyle.style === `border-${this.selected}`);
        const splitStyled: string[] = style?.value?.split(' ');
        this.thicknessSelected = splitStyled?.length === 3 ? +splitStyled[0].slice(0, splitStyled[0].length - 2) : 0;
        this.typeSelected = splitStyled?.length === 3 ? splitStyled[1] as 'solid' | 'dashed' | 'dotted' : null;
        this.colorSelected = splitStyled?.length === 3 ? splitStyled[2] : '#000000';
    }

    private createStyleValue(): string {
        return this.typeSelected ? `${this.thicknessSelected}px ${this.typeSelected} ${this.colorSelected}` : 'none';
    }

    private updateStyles() {
        if (this.selected === 'all') {
            this.bordersStyles.map((borderStyle) => {
                borderStyle.value = this.createStyleValue();
                return borderStyle;
            });
            this.same = true;
        } else {
            const index: number = this.bordersStyles.findIndex((borderStyle) => borderStyle.style === `border-${this.selected}`);
            this.bordersStyles[index].value = this.createStyleValue();
            this.same = false;
        }
        this.changed.emit(this.bordersStyles);
    }

}
