import { WorkflowVariableModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SessionsService } from 'src/app/shared/services';
import { VariablesServices } from '../../../../components/variables/variables.service';
import { ListItem } from '../../../../dto/list-item.dto';

@Component({
    selector: 'route-variable-inside-card',
    templateUrl: './route-variable-inside-card.component.html',
    styleUrls: ['./route-variable-inside-card.component.scss'],
})
export class RouteVariableInsideCardComponent implements OnInit {

    @Input() variable: WorkflowVariableModelDto;
    @Input() use: 'header' | 'url-segment' | 'query-parameter' | 'body';
    @Input() disableMove = false;
    @Output() variableChanged = new EventEmitter();
    @Output() variableMoved = new EventEmitter<{ direction: 'up' | 'down'; urlSegment: WorkflowVariableModelDto }>();
    @Output() variableDeleted = new EventEmitter();
    types: ListItem[];

    constructor(
        private variablesService: VariablesServices,
        private sessionsService: SessionsService,
    ) { }

    ngOnInit() {
        const types = this.use === 'body' ?
            this.variablesService.objectTypesBuilder(this.sessionsService.active.datas.read.smartModels) :
            this.variablesService.primitiveTypesBuilder()
                .concat(this.variablesService.objectTypesBuilder(this.sessionsService.active.datas.read.smartModels));
        this.types = types.reduce((res: ListItem[], t) => {
            if (t.key !== 'html') {
                res.push({
                    key: t.key,
                    icon: t.icon,
                    value: t.value,
                    color: t.color,
                });
            }
            return res;
        }, []);
    }

    onChangeName(name: string) {
        this.variable.key = name;
        this.variableChanged.emit();
    }

    onSelectType(type: string) {
        this.variable.type = type;
        this.variableChanged.emit();
    }

    onChangeMultiple(multiple: boolean) {
        this.variable.multiple = multiple;
        this.variableChanged.emit();
    }

    onChangeDescription(description: string) {
        this.variable.description = description;
        this.variableChanged.emit();
    }

    onChangeRequired(required: boolean) {
        this.variable.required = required;
        this.variableChanged.emit();
    }

    onChangeDeprecated(deprecated: boolean) {
        this.variable.deprecated = deprecated;
        this.variableChanged.emit();
    }

    onChangeAllowEmpty(allowEmpty: boolean) {
        this.variable.allowEmpty = allowEmpty;
        this.variableChanged.emit();
    }

    arrowMoveEvent(direction: 'up' | 'down') {
        this.variableMoved.emit({ direction, urlSegment: this.variable });
    }

    deleteVariable() {
        this.variableDeleted.emit();
    }

}
