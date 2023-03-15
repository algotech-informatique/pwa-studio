import { Component, Input } from '@angular/core';
import { SnFormulaFields } from '../../sn-formulas-dto/sn-formula-fields';

@Component({
    selector: 'sn-formula-element',
    templateUrl: './sn-formula-element.component.html',
    styleUrls: ['./sn-formula-element.component.scss']
})
export class SnFormulaElement {

    @Input() codeFormula: string;
    @Input() fields: SnFormulaFields[] = [];

    constructor() {
    }
}
