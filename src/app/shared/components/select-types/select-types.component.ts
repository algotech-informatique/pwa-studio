import { Component, OnChanges, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import * as _ from 'lodash';
import { TypeVariable } from '../../modules/inspector/components/variables/dto/type-variable.dto';
import { SourcesVariablesDto } from '../../modules/inspector/components/variables/dto/sources.dto';
import { VariablesServices } from '../../modules/inspector/components/variables/variables.service';

@Component({
    selector: 'select-types',
    templateUrl: './select-types.component.html',
    styleUrls: ['./select-types.component.scss'],
})
export class SelectTypesComponent implements OnChanges {

    @ViewChild('search') searchEdit: ElementRef;

    @Input() sources: [];
    @Input() variableType;
    @Input() visibleTitle = true;
    @Input() title: string;
    @Input() disabled = false;
    @Input() variableTypes: TypeVariable[];
    @Input() types: TypeVariable[] = [];
    @Output() typeChange = new EventEmitter();
    @Output() disabledVariableClicked = new EventEmitter();

    filteredTypesAfterSearch: TypeVariable[] = [];

    dataSources: SourcesVariablesDto[] = [];

    showVariableDropDown = false;

    typeSearch = '';

    constructor(
        private ref: ChangeDetectorRef,
        private variablesService: VariablesServices,
    ) { }

    ngOnChanges() {
        if (!this.sources || !this.types) {
            return;
        }

        this.dataSources = this.variablesService.returnSources(this.sources);
        this.filteredTypesAfterSearch = this.types;
        this.variableTypes = !this.variableTypes ? this.types : this.variableTypes;
    }

    searchLoseFocus() {
        this.showVariableDropDown = false;
        this.typeSearch = '';
    }

    onTypeClicked($event, key: string) {
        $event.stopImmediatePropagation();
        this.showVariableDropDown = false;
        this.typeChange.emit(key);
    }

    onSearchChange() {
        if (this.typeSearch.length > 0) {
            this.filteredTypesAfterSearch = _.reduce(this.types, (results, result) => {
                if (result.value.toLowerCase().search(this.typeSearch.toLowerCase()) !== -1) {
                    results.push(result);
                }

                return results;
            }, []);
        } else {
            this.filteredTypesAfterSearch = this.types;
        }
    }

    onVariableClicked() {
        if (!this.disabled) {
            this.showVariableDropDown = true;
            this.typeSearch = '';
            this.ref.detectChanges();
            if (this.searchEdit) {
                this.searchEdit.nativeElement.focus();
            }
        } else {
            this.disabledVariableClicked.emit();
        }
    }

}
