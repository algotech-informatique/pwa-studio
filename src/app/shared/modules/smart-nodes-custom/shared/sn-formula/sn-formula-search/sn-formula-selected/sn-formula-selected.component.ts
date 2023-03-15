import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SnFormula, SnFormulaFields } from '../../sn-formulas-dto';

@Component({
    selector: 'sn-formula-selected',
    templateUrl: './sn-formula-selected.component.html',
    styleUrls: ['./sn-formula-selected.component.scss']
})
export class SnFormulaSelected {

    @Input() selectedFormula: SnFormula;
    @Output() selectField = new EventEmitter();

    constructor() {
    }

    onSelectField(field: SnFormulaFields) {
        this.selectField.emit(field);
    }
}
