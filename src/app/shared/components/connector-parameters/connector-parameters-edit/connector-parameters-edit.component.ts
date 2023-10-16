import { EnvironmentsService } from '@algotech-ce/angular';
import { EnvironmentParameterDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'app-connector-parameters-edit',
    styleUrls: ['./connector-parameters-edit.component.scss'],
    templateUrl: './connector-parameters-edit.component.html',
})
export class ConnectorParametersEditComponent {
    @ViewChild('secret', { static: false }) secret: ElementRef;
    @Input() parameters: EnvironmentParameterDto[] = [];
    @Input() showData = true;

    displaySecret: {
        index: number;
        type: 'loading' | 'edit';
    } = null;

    constructor(private ref: ChangeDetectorRef, private environmentsService: EnvironmentsService) {
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
            password: !this.showData,
            active: null,
        });
    }

    onClickSecret(index: number) {
        this.displaySecret = {
            type: 'edit',
            index
        };
        this.ref.detectChanges();

        if (this.secret) {
            this.secret.nativeElement.focus();
        }
    }

    onKeyUpSecret(parameter: EnvironmentParameterDto, value: string, event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.onFocusOutSecret(parameter, value);
        }
        if (event.key === 'Escape') {
            this.displaySecret = null;
        }
    }

    onFocusOutSecret(parameter: EnvironmentParameterDto, value: string) {
        if (!value) {
            this.displaySecret = null;
            return;
        }
        this.displaySecret.type = 'loading';
        this.environmentsService.encryptPasssword(value).subscribe((res) => {
            this.displaySecret = null;
            parameter.value = res;
        });
    }
}
