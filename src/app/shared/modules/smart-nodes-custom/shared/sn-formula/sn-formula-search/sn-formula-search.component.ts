import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { SnFormula, SnFormulaFields, SnGroupFormula } from '../sn-formulas-dto';
import { SnParam, SnView } from '../../../../smart-nodes/models';
import { SnFormulaService } from '../sn-formula.service';

@Component({
    selector: 'sn-formula-search',
    templateUrl: './sn-formula-search.component.html',
    styleUrls: ['./sn-formula-search.component.scss']
})
export class SnFormulaSearch implements OnChanges, OnDestroy, AfterViewInit {
    @ViewChild('previous') previousBt;
    @ViewChild('next') nextBt;
    @ViewChild('formulas') formulas;
    @Input() formulaFilter = '';
    @Input() currentPage = 0;
    @Input() formulaValue = '';
    @Input() snView: SnView;
    @Input() sources: SnParam[];
    @Output() formulaSelect = new EventEmitter<string>();
    @Output() createSource = new EventEmitter();

    @Output() topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }

    @Input()
    get top() {
        return this._top;
    }

    pageLimit = 1;
    formulaSearchList: SnGroupFormula[];
    groupFormulaFiltered: SnGroupFormula[] = [];
    selectedFormula: SnFormula;
    filter$ = new Subject();
    reload$ = new Subject();
    _top: any = null;

    constructor(
        private snFormulaService: SnFormulaService,
    ) {
        this.filter$.pipe(
            debounceTime(300),
            tap(() => {
                this.currentPage = 0;
                this.snFormulaService.getFilterFormulas(this.formulaSearchList, this.formulaFilter).subscribe(
                    (groups: SnGroupFormula[]) => {
                        this.groupFormulaFiltered = groups;
                    });
            })
        ).subscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes && changes.formulaFilter) {
            this.formulaSearchList = this.snFormulaService.createFormulaGroups();
            this.filterElements();
        }

    }

    ngAfterViewInit() {
        if (this.formulas) {
            this.formulas.nativeElement.onmousewheel = (ev) => {
                ev.stopPropagation();
            };
        }
    }

    ngOnDestroy() {
        this.filter$.unsubscribe();
    }

    filterElements() {
        if (this.previousBt && this.nextBt) {
            this.previousBt.nativeElement.disabled = this.currentPage === 0;
            this.nextBt.nativeElement.disabled = this.currentPage === this.formulaSearchList.length - 1;
        }

        if (!this.formulaFilter) {
            this.selectedFormula = null;
            this.groupFormulaFiltered = _.slice(this.formulaSearchList, (this.pageLimit * this.currentPage),
                (this.pageLimit * this.currentPage) + this.pageLimit);
            return;
        }
        const index: number = this.formulaFilter.indexOf(')');
        if (index !== -1) {
            this.selectFormula();
            return;
        } else {
            this.selectedFormula = null;
        }
        this.filter$.next(null);
    }

    selectFormula() {
        const codeFormula = this.formulaFilter.substring(0, this.formulaFilter.indexOf('('));
        this.selectedFormula = this.snFormulaService.getFormula(codeFormula);
        if (this.selectedFormula) {
            this.updateFields();
        }
    }

    updateFields() {
        if (this.sources.length !== 0) {
            _.forEach(this.sources, (source: SnParam) => {
                this.updateField(source.key);
            });
        }
    }

    updateField(sourceKey: string) {
        const findIndex: number = _.findIndex(this.selectedFormula.fields, { code: sourceKey });
        if (findIndex > -1) {
            const field: SnFormulaFields = this.selectedFormula.fields[findIndex];
            field.addedSource = true;
            field.disabled = true;
            if (field.isOptional && this.selectedFormula.fields[findIndex + 1]) {
                this.selectedFormula.fields[findIndex + 1].disabled = false;
            }
        }
    }

    onFormulaClick(formula: SnFormula) {
        this.selectedFormula = formula;
        this.formulaSelect.emit(this.snFormulaService.getFormulaWithoutOptionals(formula.formula, formula.fields));
    }

    changePage(inc) {
        this.currentPage += inc;
        this.currentPage = (this.currentPage < 0) ? 0 : (this.currentPage > this.formulaSearchList.length - 1) ?
            this.formulaSearchList.length - 1 : this.currentPage;
        this.filterElements();
    }

    setPage(index) {
        this.currentPage = index;
        this.filterElements();
    }

    onSelectField(field: SnFormulaFields) {
        const param = this.createSourceParam(field);
        this.updateField(field.code);
        this.createSource.emit(param);
        const value = field.isOptional ?
            this.snFormulaService.addOptionalParam(this.formulaValue, field.code) :
            this.snFormulaService.replaceParams(this.formulaValue, field.id, field.code);
        this.formulaSelect.emit(value);
    }

    createSourceParam(source: SnFormulaFields) {
        const param: SnParam = {
            id: UUID.UUID(),
            direction: 'in',
            key: source.code,
            toward: null,
            types: source.type,
            multiple: source.isArray,
            display: 'input',
            pluggable: true,
            displayState: {},
            displayName: source.code,
            required: !source.isOptional,
        };
        return param;
    }

    close() {
        this.top = null;
    }
}
