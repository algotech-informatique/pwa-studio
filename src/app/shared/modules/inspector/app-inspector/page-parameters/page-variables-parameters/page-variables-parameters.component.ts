import { SnPageDto, SnPageVariableDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { SessionsService } from '../../../../../services';
import { TypeVariable } from '../../../components/variables/dto/type-variable.dto';
import { VariablesServices } from '../../../components/variables/variables.service';
import { ListItem } from '../../../dto/list-item.dto';

@Component({
  selector: 'page-variables-parameters',
  templateUrl: './page-variables-parameters.component.html',
  styleUrls: ['./page-variables-parameters.component.scss'],
})
export class PageVariablesParametersComponent implements OnChanges {

    @Input() variables: SnPageVariableDto[] = [];
    @Input() page: SnPageDto;
    @Output() changed = new EventEmitter();

    listTypes: ListItem[];
    addedIndex;

    constructor(private variablesService: VariablesServices, private sessionsService: SessionsService) { }

    ngOnChanges() {
        this.listTypes = this.getTypes();
    }

    getTypes(): ListItem[] {
        return this.variablesService.typeBuilder(this.sessionsService.active.datas.read.smartModels).map((t: TypeVariable) => {
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
        this.changed.emit();
    }

    removeVariable(variable: SnPageVariableDto) {
        this.variables.splice(this.variables.indexOf(variable), 1);
        this.changed.emit();

        this.listTypes =  this.getTypes();
    }

    addVariable() {
        this.variables.push({
            key: '',
            multiple: false,
            type: 'so:*',
            uuid: UUID.UUID()
        });
        this.changed.emit();
        this.addedIndex = this.variables.length - 1;

        this.listTypes =  this.getTypes();
    }

}
