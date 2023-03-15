import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { SnSection } from '../../../../smart-nodes/models';
import { SnFormulaService } from '../sn-formula.service';

@Component({
    selector: 'sn-formula-preview',
    templateUrl: './sn-formula-preview.component.html',
    styleUrls: ['./sn-formula-preview.component.scss']
})
export class SnFormulaPreviewComponent implements OnChanges {

    @Input() formula: string;
    @Input() hasKeyError: boolean;
    @Input() section: SnSection;
    @Output() formulaError = new EventEmitter<boolean>();
    formulaPreview: string;
    formulaHasError: boolean;

    constructor(private formulaService: SnFormulaService) {
    }

    ngOnChanges() {
        if (!this.hasKeyError) {
            const parserResult = this.formulaService.parseFormula(this.formula);
            if (parserResult.error) {
                this.formulaError.emit(true);
                this.formulaPreview = parserResult.error;
                this.formulaHasError = true;
            } else {
                this.formulaError.emit(false);
                this.formulaPreview = parserResult.result;
                this.formulaHasError = false;
            }
        } else {
            this.formulaPreview = this.formula;
            this.formulaHasError = true;
        }
    }

}
