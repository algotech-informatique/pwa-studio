import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AngularDelegate } from '@ionic/angular';
import * as _ from 'lodash';

interface PositionInterface {
    position: string;
    value: any;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'design-style-absposition-parameters',
    templateUrl: './design-style-absposition-parameters.component.html',
    styleUrls: ['./design-style-absposition-parameters.component.scss'],
})
export class DesignStyleAbsPositionParametersComponent implements OnChanges {

    @Input() position: PositionInterface[];
    @Output() changePosition = new EventEmitter();
    @Output() changePositionValue = new EventEmitter();

    topSelected = false;
    bottomSelected = false;
    leftSelected = false;
    rightSelected = false;

    topValue = 0;
    bottomValue = 0;
    leftValue = 0;
    rightValue = 0;

    ngOnChanges() {
        this.topSelected = this.position.find((pos: PositionInterface) => pos.position === 'top') ? true : false;
        this.bottomSelected = this.position.find((pos: PositionInterface) => pos.position === 'bottom') ? true : false;
        this.leftSelected = this.position.find((pos: PositionInterface) => pos.position === 'left') ? true : false;
        this.rightSelected = this.position.find((pos: PositionInterface) => pos.position === 'right') ? true : false;

        this.topValue = (this.topSelected) ? this.position.find((pos: PositionInterface) => pos.position === 'top').value : 0;
        this.bottomValue = (this.bottomSelected) ? this.position.find((pos: PositionInterface) => pos.position === 'bottom').value : 0;
        this.leftValue = (this.leftSelected) ? this.position.find((pos: PositionInterface) => pos.position === 'left').value : 0;
        this.rightValue = (this.rightSelected) ? this.position.find((pos: PositionInterface) => pos.position === 'right').value : 0;
    }

    selectType(value: string) {
        this.changePosition.emit(value);
    }

    onSizeChanged(value: any, type: string) {
        this.changePositionValue.emit({value, type});
    }
}
