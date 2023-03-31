import { EnvironmentParameterDto } from '@algotech-ce/core';
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos';
import { DatasService, SessionsService, MessageService } from '../../services';

@Component({
    selector: 'app-connector-parameters',
    styleUrls: ['./connector-parameters.component.scss'],
    templateUrl: './connector-parameters.component.html',
})
export class ConnectorParametersComponent implements OnChanges, OnDestroy {
    @Input() line: ObjectTreeLineDto;

    parameters: EnvironmentParameterDto[] = [];

    constructor(
        private messageService: MessageService,
        private sessionService: SessionsService,
        private datasService: DatasService) {
    }

    ngOnChanges() {
        if (this.line) {
            this.parameters = this.sessionService.getConnectorCustom(this.line.host,
                this.line.customerKey, this.line.type, this.line.refUuid);
            if (this.parameters && this.parameters.length === 0) {
                this.addNewValue();
            }
        }
    }

    ngOnDestroy() {
        if (this.line && this.parameters) {
            this.messageService.send('connector-parameters.save', this.parameters);
            this.datasService.notifyPatchEnvironment(this.line.customerKey, this.line.host);
        }
    }

    activeParameter(parameter: EnvironmentParameterDto) {
        parameter.active = !parameter.active;
    }

    editParameter(parameter: EnvironmentParameterDto) {
        if (parameter.active === null) {
            parameter.active = true;
        }

        if (this.parameters[this.parameters.length - 1] === parameter) {
            this.addNewValue();
        }
    }

    removeParameter(parameter: EnvironmentParameterDto) {
        const index = this.parameters.indexOf(parameter);
        if (index > -1) {
            this.parameters.splice(index, 1);
        }
    }

    addNewValue() {
        this.parameters.push({
            key: '',
            value: '',
            active: null,
        });
    }
}
