import { SnPageDto, SnPageVariableDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { SessionsService } from '../../../../../services';
import { TypeVariable } from '../../../components/variables/dto/type-variable.dto';
import { VariablesServices } from '../../../components/variables/variables.service';
import { ListItem } from '../../../dto/list-item.dto';
import { VariableTypesService } from '../../../services/variable-types.service';

@Component({
  selector: 'page-variables-parameters',
  templateUrl: './page-variables-parameters.component.html',
  styleUrls: ['./page-variables-parameters.component.scss'],
})
export class PageVariablesParametersComponent implements OnChanges {

    @Input() disableMultiple = false;
    @Input() variables: SnPageVariableDto[] = [];
    @Input() page: SnPageDto;
    @Output() changed = new EventEmitter();
    @Input() types: TypeVariable[] = [];
    listTypes: ListItem[];

    addedIndex;

    filteredTypesAndMultiple: { filteredTypes: ListItem[]; disableMultiple: boolean }[];

    constructor(
        private variablesService: VariablesServices,
        private sessionsService: SessionsService,
        private variableTypeService: VariableTypesService,
    ) { }

    ngOnChanges() {
        this.types = (this.types?.length === 0) ?
            this.variablesService.typeBuilder(this.sessionsService.active.datas.read.smartModels) :
            this.types;
        this.listTypes = this.getTypes();
        this.filteredTypesAndMultiple = this.variables.map((variable) =>
            this.variableTypeService.formatVariable(variable, {}, this.disableMultiple, this.types));
    }

    getTypes(): ListItem[] {
        return this.types?.map((t: TypeVariable) => {
            const item: ListItem = {
                key: t.key,
                icon: t.icon,
                value: t.value,
            };
            return item;
        });
    }

    onMultipleChanged(variable: SnPageVariableDto, value: boolean) {
        variable.multiple = value;
        this.changed.emit();
    }

    onSelectType(variable: SnPageVariableDto, type: string) {
        variable.type = type;
        this.changed.emit();
    }

    onKeyChanged(key: string, index: number) {
        this.variables[index].key = key;
        this.filteredTypesAndMultiple[index] =
            this.variableTypeService.formatVariable(this.variables[index], {}, this.disableMultiple, this.types);
        this.changed.emit();
    }

    removeVariable(variable: SnPageVariableDto) {
        const index = this.variables.indexOf(variable);
        this.filteredTypesAndMultiple.splice(index, 1);
        this.variables.splice(index, 1);
        this.changed.emit();

        this.listTypes =  this.getTypes();
    }

    addVariable() {
        const newVar: WorkflowVariableModelDto = {
            uuid: UUID.UUID(),
            key: '',
            type: 'so:*',
            multiple: false,
        };
        this.variables.push(newVar);
        this.filteredTypesAndMultiple[this.variables.length - 1] =
            this.variableTypeService.formatVariable(newVar, {}, this.disableMultiple, this.types);

        this.changed.emit();
        this.addedIndex = this.variables.length - 1;

        this.listTypes =  this.getTypes();
    }

}
