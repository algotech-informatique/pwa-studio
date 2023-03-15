import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SnItem, SnNode, SnView } from '../../../models';

@Component({
    selector: 'sn-inputs',
    templateUrl: './sn-inputs.component.html',
})
export class SnInputsComponent implements OnChanges {

    @Input() snView: SnView;
    @Input() types: string | string[];
    @Input() value: any;
    @Input() display: string;
    @Input() items: SnItem[] = null;
    @Input() multiple: boolean;
    @Input() node: SnNode;
    @Output() updateValue = new EventEmitter<string | boolean | Date | number>();

    fastTypes = ['string', 'boolean', 'datetime', 'date', 'time', 'number'];
    inFastTypes = false;
    fastType: string;

    ngOnChanges() {
        if (this.types) {
            if (_.isArray(this.types)) {
                this.inFastTypes = _.find(this.types, (type: string) => {
                    if (_.find(this.fastTypes, (fastType: string) => fastType === type)) {
                        this.fastType = type;
                        return true;
                    }
                });
            } else {
                this.inFastTypes = _.find(this.fastTypes, (fastType: string) => fastType === this.types);
                this.fastType = _.toString(this.types);
            }
        }
    }

    onUpdateValue(value: string | boolean | Date | number) {
        this.updateValue.emit(value);
    }

}
