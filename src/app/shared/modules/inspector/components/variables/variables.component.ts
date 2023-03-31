import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { PairDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { IconsService, SessionsService } from '../../../../services';
import { VariablesServices } from './variables.service';
import { SourcesVariablesDto } from './dto/sources.dto';
import { TypeVariable } from './dto/type-variable.dto';
import { TranslateService } from '@ngx-translate/core';
import { ListItem } from '../../dto/list-item.dto';

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
        private iconsService: IconsService,
    ) { }

    ngOnChanges() {
        this.dataSources = this.variablesService.returnSources(this.sources);
        this.suggestionsList = this.dataSources.map((data) => ({
            key: data.key,
            value: this.translateService.instant(data.title),
        }));

        this.types = (this.types.length === 0) ? this.variablesService.typeBuilder(this.sessionsService.active.datas.read.smartModels) : this.types;
        this.filteredTypesAndMultiple = this.variables.map((variable) => this.formatVariable(variable));
    }

    multipleChanged(multiple: boolean, index: number) {
        this.variables[index].multiple = multiple;
        this.changed.emit();
    }

    onKeyChange(key: string, index: number) {
        this.variables[index].key = key;
        this.filteredTypesAndMultiple[index] = this.formatVariable(this.variables[index]);
        this.changed.emit();
    }

    formatVariable(variable: WorkflowVariableModelDto): { filteredTypes: ListItem[]; disableMultiple: boolean } {
        let type: string;
        let multiple: boolean;
        const filteredTypesAndMultiple: { filteredTypes: ListItem[]; disableMultiple: boolean } = {
            filteredTypes: [],
            disableMultiple: true,
        };

        const source: SourcesVariablesDto = _.find(this.dataSources, { key: variable.key });
        if (!source && variable.key === '') {
            filteredTypesAndMultiple.filteredTypes = [];
            filteredTypesAndMultiple.disableMultiple = this.disableMultiple;
        } else if (!source && variable.key !== '') {
            filteredTypesAndMultiple.filteredTypes = _.cloneDeep(this.types).map((t: TypeVariable) => ({
                key: t.key,
                value: t.value,
                icon: t.icon,
                color: this.iconsService.getIconColor(t.key),
            }));
            filteredTypesAndMultiple.disableMultiple = this.disableMultiple;
        } else {
            filteredTypesAndMultiple.filteredTypes = this.variablesService.filterList(source.type, this.types).map((i) => ({
                key: i.key,
                value: i.value,
                icon: i.icon,
                color: this.iconsService.getIconColor(i.key),
            }));

            if (source.multiple !== null) {
                filteredTypesAndMultiple.disableMultiple = true;
                multiple = source.multiple;
            } else {
                filteredTypesAndMultiple.disableMultiple = false;
                multiple = false;
            }
        }

        if (filteredTypesAndMultiple.filteredTypes.length === 1) {
            type = filteredTypesAndMultiple.filteredTypes[0].key;
        } else if (!_.find(filteredTypesAndMultiple.filteredTypes, { key: variable.type })) {
            type = '';
        }

        if (multiple !== undefined && variable.multiple !== multiple) {
            variable.multiple = multiple;
            this.changed.emit();
        }
        if (type !== undefined && variable.type !== type) {
            variable.type = type;
            this.changed.emit();
        }

        return filteredTypesAndMultiple;
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
        this.filteredTypesAndMultiple[this.variables.length - 1] = this.formatVariable(newVar);
        this.changed.emit();
        this.addedIndex = this.variables.length - 1;
        
    }

}
