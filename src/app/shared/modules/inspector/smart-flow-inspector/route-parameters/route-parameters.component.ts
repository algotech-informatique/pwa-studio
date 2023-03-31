import { WorkflowApiModelDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SessionsService } from 'src/app/shared/services';
import { ListItem } from '../../dto/list-item.dto';

@Component({
    selector: 'route-parameters',
    templateUrl: './route-parameters.component.html',
    styleUrls: ['./route-parameters.component.scss'],
})
export class RouteParametersComponent implements OnChanges {

    @Input() api: WorkflowApiModelDto;
    @Input() variables: WorkflowVariableModelDto[];
    @Input() errors: any;
    @Input() sources;
    @Input() verbs: ListItem[];
    @Output() apiChanged = new EventEmitter<WorkflowApiModelDto>();
    @Output() variablesChanged = new EventEmitter<WorkflowVariableModelDto[]>();
    securityGroupList: ListItem[];
    urlSegments: WorkflowVariableModelDto[];
    headers: WorkflowVariableModelDto[];
    queryParameters: WorkflowVariableModelDto[];
    bodies: WorkflowVariableModelDto[];
    body: WorkflowVariableModelDto;

    constructor(
        private sessionsService: SessionsService,
    ) {
        this.securityGroupList = this.sessionsService.active.datas.read.groups.map((group) => ({
            key: group.key,
            value: group.name,
            icon: 'fa-solid fa-users',
        }));
    }

    ngOnChanges() {
        this.urlSegments = this.variables?.filter((variable) => variable.use === 'url-segment');;
        this.headers = this.variables?.filter((variable) => variable.use === 'header');
        this.queryParameters = this.variables?.filter((variable) => variable.use === 'query-parameter');
    }

    onVariableRemoved(varKey: string) {
        const index: number = this.variables?.findIndex((variable) => variable.key === varKey);
        if (index > -1) {
            this.variables.splice(index, 1);
            this.variablesChanged.emit(this.variables);
        }
    }

    onChangeUrlName(name: string) {
        this.api.route = name;
        this.apiChanged.emit(this.api);
    }

    onChangeVerb(verb: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE') {
        this.api.type = verb;
        this.apiChanged.emit(this.api);
    }

    onJwtChanged(jwt: boolean) {
        this.updateJwt(jwt);
        this.updateWebhook(false);
        this.apiChanged.emit(this.api);
    }

    onGroupsChanged(restrictByGroups: boolean) {
        this.api.auth.groups = restrictByGroups ? [] : null;
        this.apiChanged.emit(this.api);
    }

    onChangeSecurityGroups(securityGroups: string[]) {
        this.api.auth.groups = securityGroups;
        this.apiChanged.emit(this.api);
    }

    onWebhookChanged(useWebhook: boolean) {
        this.updateWebhook(useWebhook);
        this.updateJwt(false);
        this.apiChanged.emit(this.api);
    }

    onWebhookHeaderChanged(header: string) {
        this.api.auth.webhook.key = header;
        this.apiChanged.emit(this.api);
    }

    onWebhookValueChanged(value: string) {
        this.api.auth.webhook.value = value;
        this.apiChanged.emit(this.api);
    }

    onVariablesChanged(use: 'header' | 'url-segment' | 'query-parameter', toConcat: WorkflowVariableModelDto[]) {
        this.variables = this.variables?.filter((variable) => variable.use !== use).concat(toConcat);
        this.variablesChanged.emit(this.variables);
    }

    onBodyVariablesChanged(variables: WorkflowVariableModelDto[]) {
        this.variables = variables;
        this.variablesChanged.emit(this.variables);
    }

    private updateJwt(jwt: boolean) {
        this.api.auth.jwt = jwt;
        if (!jwt) {
            this.api.auth.groups = null;
        }
    }

    private updateWebhook(useWebhook: boolean) {
        this.api.auth.webhook = useWebhook ? { key: '', value: '' } : null;
    }

}
