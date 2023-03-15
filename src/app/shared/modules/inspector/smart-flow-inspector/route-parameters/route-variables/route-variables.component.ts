import { WorkflowVariableModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'route-variables',
    templateUrl: './route-variables.component.html',
    styleUrls: ['./route-variables.component.scss'],
})
export class RouteVariablesComponent {

    @Input() variables: WorkflowVariableModelDto[];
    @Input() use: 'header' | 'url-segment' | 'query-parameter';
    @Input() title: string;
    @Input() buttonAdd: string;
    @Input() emptyString: string;
    @Input() errors: [];
    @Output() variablesChanged = new EventEmitter();
    addedIndex: number;

    onVariableChanged() {
        this.variablesChanged.emit();
    }

    onVariableMoved(ev: { direction: 'up' | 'down'; urlSegment: WorkflowVariableModelDto }, index: number) {
        this.variables.splice(index, 1);
        this.variables.splice(ev?.direction === 'up' ? index - 1 : index + 1, 0, ev?.urlSegment);
        this.variablesChanged.emit();
    }

    onVariableDeleted(index: number) {
        this.variables.splice(index, 1);
        this.variablesChanged.emit();
    }

    addVariable() {
        let key = '';
        if (this.use === 'url-segment') {
            key = 'path-parameter';
        } else if (this.use === 'header') {
            key = 'header';
        } else if (this.use === 'query-parameter') {
            key = 'query-parameter';
        }

        const variable: WorkflowVariableModelDto = {
            uuid: UUID.UUID(),
            key,
            type: 'string',
            multiple: false,
        };

        if (this.use) {
            variable.use = this.use;
            variable.description = '';
            variable.required = true;
        }

        this.variables.push(variable);
        this.addedIndex = this.variables.length - 1;
        this.variablesChanged.emit();
    }

}
