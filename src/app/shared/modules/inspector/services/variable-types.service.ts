import { Injectable } from '@angular/core';
import { ListItem } from '../dto/list-item.dto';
import { WorkflowVariableModelDto } from '@algotech-ce/core';
import { SourcesVariablesDto } from '../components/variables/dto/sources.dto';
import * as _ from 'lodash';
import { TypeVariable } from '../components/variables/dto/type-variable.dto';
import { IconsService } from '../../../services';
import { VariablesServices } from '../components/variables/variables.service';

@Injectable()
export class VariableTypesService {

    constructor(
        private iconsService: IconsService,
        private variablesService: VariablesServices,
    ) { }

    formatVariable(variable: WorkflowVariableModelDto, dataSources, disableMultiple: boolean, types):
        { filteredTypes: ListItem[]; disableMultiple: boolean } {

        let type;
        let multiple;
        const filteredTypesAndMultiple: { filteredTypes: ListItem[]; disableMultiple: boolean } = {
            filteredTypes: [],
            disableMultiple: true,
        };

        const source: SourcesVariablesDto = _.find(dataSources, { key: variable.key });
        if (!source && variable.key === '') {
            filteredTypesAndMultiple.filteredTypes = [];
            filteredTypesAndMultiple.disableMultiple = disableMultiple;
        } else if (!source && variable.key !== '') {
            filteredTypesAndMultiple.filteredTypes = _.cloneDeep(types).map((t: TypeVariable) => ({
                key: t.key,
                value: t.value,
                icon: t.icon,
                color: this.iconsService.getIconColor(t.key),
            }));
            filteredTypesAndMultiple.disableMultiple = disableMultiple;
        } else {
            filteredTypesAndMultiple.filteredTypes = this.variablesService.filterList(source.type, types).map((i) => ({
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
        }
        if (type !== undefined && variable.type !== type) {
            variable.type = type;
        }

        return filteredTypesAndMultiple;
    }
}
