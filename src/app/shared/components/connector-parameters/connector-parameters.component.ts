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

    custom: EnvironmentParameterDto[] = [];
    parameters: EnvironmentParameterDto[] = [];
    passwords: EnvironmentParameterDto[] = [];

    constructor(
        private messageService: MessageService,
        private sessionService: SessionsService,
        private datasService: DatasService) {
    }

    ngOnChanges() {
        if (this.line) {
            this.custom = this.sessionService.getConnectorCustom(this.line.host,
                this.line.customerKey, this.line.type, this.line.refUuid);

            this.parameters = this.custom.filter((p) => !p.password).filter((p) => !!p.key);
            this.passwords = this.custom.filter((p) => p.password).filter((p) => !!p.key);

            this.parameters.push(this.newValue(false));
            this.passwords.push(this.newValue(true));
        }
    }

    ngOnDestroy() {
        if (this.line && this.custom) {
            this.custom.splice(0, this.custom.length);
            this.custom.push(...[...this.parameters, ...this.passwords].filter((p) => !!p.key));

            this.messageService.send('connector-parameters.save', this.custom);
            this.datasService.notifyPatchEnvironment(this.line.customerKey, this.line.host);
        }
    }

    newValue(password: boolean) {
        return {
            key: '',
            value: '',
            active: null,
            password
        };
    }
}
