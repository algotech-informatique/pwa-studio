import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { PairDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { SessionsService } from '../../../../services';
import { VariablesServices } from './variables.service';
import { SourcesVariablesDto } from './dto/sources.dto';
import { TypeVariable } from './dto/type-variable.dto';
import { TranslateService } from '@ngx-translate/core';
import { ListItem } from '../../dto/list-item.dto';
import { VariableTypesService } from '../../services/variable-types.service';

@Component({
    selector: 'variables',
    templateUrl: './variables.component.html',
    styleUrls: ['./variables.component.scss'],
})
export class VariablesComponent implements OnChanges {
    @Input() disableMultiple = false;
    @Input() types: TypeVariable[] = [];
    @Input() sources: [];
    @Input() errors: [];
    @Input() variables: WorkflowVariableModelDto[];
    @Output() changed = new EventEmitter();

    dataSources: SourcesVariablesDto[] = [];
    addedIndex: number;

    filteredTypesAndMultiple: { filteredTypes: ListItem[]; disableMultiple: boolean }[];

    suggestionsList: PairDto[];

    constructor(
        private sessionsService: SessionsService,
        private variablesService: VariablesServices,
        private translateService: TranslateService,
        private variableTypeService: VariableTypesService,
    ) { }

    ngOnChanges() {
        this.dataSources = this.variablesService.returnSources(this.sources);
        this.suggestionsList = this.dataSources.map((data) => ({
            key: data.key,
            value: this.translateService.instant(data.title),
        }));

        this.types = (this.types.length === 0) ?
            this.variablesService.typeBuilder(this.sessionsService.active.datas.read.smartModels) :
            this.types;
        this.filteredTypesAndMultiple = this.variables.map((variable) =>
            this.variableTypeService.formatVariable(variable, this.dataSources, this.disableMultiple, this.types));
    }

    multipleChanged(multiple: boolean, index: number) {
        this.variables[index].multiple = multiple;
        this.changed.emit();
    }

    onKeyChange(key: string, index: number) {
        this.variables[index].key = key;
        this.filteredTypesAndMultiple[index] =
            this.variableTypeService.formatVariable(this.variables[index], this.dataSources, this.disableMultiple, this.types);
        this.changed.emit();
    }

    onTypeChanged(event: string, index: number) {
        this.variables[index].type = event;
        this.changed.emit();
    }

    deleteElement(i: number) {
        this.variables.splice(i, 1);
        this.filteredTypesAndMultiple.splice(i, 1);
        this.changed.emit();
    }

    addVariable() {
        const newVar: WorkflowVariableModelDto = {
            uuid: UUID.UUID(),
            key: '',
            type: '',
            multiple: false,
        };
        this.variables.push(newVar);
        this.filteredTypesAndMultiple[this.variables.length - 1] =
            this.variableTypeService.formatVariable(newVar, this.dataSources, this.disableMultiple, this.types);
        this.changed.emit();
        this.addedIndex = this.variables.length - 1;

    }

}
