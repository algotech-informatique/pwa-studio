import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SnParam, SnView } from '../../../../smart-nodes/models';

@Component({
    selector: 'sn-formula-input',
    templateUrl: './sn-formula-input.component.html',
    styleUrls: ['./sn-formula-input.component.scss']
})
export class SnFormulaInputComponent {

    @Input() formula: string;
    @Input() snView: SnView;
    @Input() formulaHasError: boolean;
    @Input() sources: SnParam[];
    @Output() formulaChange = new EventEmitter<string>();
    @Output() createSource = new EventEmitter();

    top = null;
    searchshown = false;
    formulaFilter = '';
    currentPage = 0;

    constructor() {
    }

    update(formula: string) {
        this.currentPage = 0;
        this.formulaFilter = formula;
        this.formulaChange.emit(formula);
    }

    onFormulaclick(event) {
        if (!this.searchshown) {
            this.currentPage = 0;
            this.formulaFilter = this.formula;
            this.top = event.offsetY + 105;
        }
        this.searchshown = !this.searchshown;
        event.stopPropagation();
    }

    onkeyup(formula: string) {
        this.searchshown = false;
        this.currentPage = 0;
        this.formulaFilter = formula;
        this.top = 120;
    }

    onFormulaSelect(formula: string) {
        this.update(formula);
    }

    onCreateSource(event) {
        this.createSource.emit(event);
    }

}
