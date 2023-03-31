import { WorkflowVariableModelDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { ListItem } from '../../../dto/list-item.dto';
import { VariablesServices } from '../../../components/variables/variables.service';
import { SessionsService } from 'src/app/shared/services';
import { TranslateService } from '@ngx-translate/core';
import { TypeVariable } from '../../../components/variables/dto/type-variable.dto';

@Component({
    selector: 'route-body',
    templateUrl: './route-body.component.html',
    styleUrls: ['./route-body.component.scss'],
})
export class RouteBodyComponent implements OnChanges {

    @Input() variables: WorkflowVariableModelDto[];
    @Input() errors: any;
    @Input() sources;
    @Output() variablesChanged = new EventEmitter<WorkflowVariableModelDto[]>();
    body: WorkflowVariableModelDto;
    bodies: WorkflowVariableModelDto[];
    formDataKeys: WorkflowVariableModelDto[];
    modes: ListItem[];
    selectedMode: string;
    smartModels: ListItem[];
    formDataTypes: TypeVariable[] = [];

    constructor(
        private variablesServices: VariablesServices,
        private sessionsService: SessionsService,
        private translateService: TranslateService,
    ) {
        this.modes = [
            { key: 'uniqueBody', value: this.translateService.instant('INSPECTOR.SMART_FLOW.API.BODY.SINGLE') },
            { key: 'composedBodies', value: this.translateService.instant('INSPECTOR.SMART_FLOW.API.BODY.MULTI') },
            { key: 'formData', value: this.translateService.instant('INSPECTOR.SMART_FLOW.API.BODY.FORMDATA') }
        ];

        this.smartModels = this.variablesServices.objectTypesBuilder(this.sessionsService.active.datas.read.smartModels).map((object) => ({
            key: object.key,
            value: object.value,
            icon: object.icon,
            color: object.color,
        }));

        this.formDataTypes = this.variablesServices.formDatatypeBuilder();
    }

    ngOnChanges() {
        this.body = this.variables.find((variable) => variable.use === 'body');
        this.bodies = this.variables?.filter((variable) => !variable.use);
        this.formDataKeys = this.variables?.filter((variable) => variable.use === 'formData');
        this.selectedMode = (this.selectedMode === undefined) ?
            (this.body ? 'uniqueBody' : this.formDataKeys?.length > 0 ? 'formData' : 'composedBodies') :
            this.selectedMode;
    }

    onModeChanged(mode: string) {
        this.variables = (mode === 'formData') ? this.variables?.filter((variable) => (variable.use && variable.use !== 'body')) :
            (mode === 'composedBodies') ? this.variables?.filter((variable) => (variable.use !== 'body' && variable.use !== 'formData')) :
                this.variables?.filter((variable) => (variable.use && variable.use !== 'formData'));

        if (mode === 'uniqueBody') {
            this.bodies = [];
            if (!this.body) {
                this.body = {
                    uuid: UUID.UUID(),
                    key: 'body',
                    type: '',
                    multiple: false,
                    use: 'body',
                    description: '',
                };
                this.variables.push(this.body);
            }
            this.variablesChanged.emit(this.variables);
        } else if (this.body) {
            this.body = null;
        }

        this.variablesChanged.emit(this.variables);
        this.selectedMode = mode;
    }

    onChangeBodyKey(key: string) {
        this.body.key = key;
        this.variablesChanged.emit(this.variables);
    }

    onChangeBodyType(type: string) {
        this.body.type = type;
        this.variablesChanged.emit(this.variables);
    }

    onChangeBodyMultiple(multiple: boolean) {
        this.body.multiple = multiple;
        this.variablesChanged.emit(this.variables);
    }

    onChangeBodyDescription(description: string) {
        this.body.description = description;
        this.variablesChanged.emit(this.variables);
    }

    onVariablesChanged() {
        this.variables = this.variables?.filter((variable) => variable.use && variable.use !== 'formData')
            .concat((this.selectedMode === 'formData') ? this.formDataKeys.map(v => {
                v.use = 'formData';
                return v;
            }) : this.bodies);
        this.variablesChanged.emit(this.variables);
    }

}
