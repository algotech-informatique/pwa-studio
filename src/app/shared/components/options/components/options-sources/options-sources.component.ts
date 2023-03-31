import { Component, EventEmitter, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { PairDto, SmartObjectDto, WorkflowVariableModelDto } from '@algotech-ce/core';
import { InputDisplay } from '@algotech-ce/business/src/lib/workflow-debugger/inputs-grid/dto/input-display.dto';
import { SoUtilsService } from '@algotech-ce/business';
import { EnvService } from '@algotech-ce/angular';

@Component({
    selector: 'options-sources',
    styleUrls: ['./options-sources.component.scss'],
    templateUrl: './options-sources.component.html',
})
export class OptionsSourcesComponent {

    @Input() inputs: PairDto[];
    @Input() variables:  WorkflowVariableModelDto[];
    @Output() update = new EventEmitter<PairDto[]>();

    environment: any;

    constructor(
        private envService: EnvService,
        private soUtils: SoUtilsService) {

        this.envService.environment.subscribe((environment) => {
            this.environment = environment;
        });
    }

    onUpdateValue(inputDisplay: InputDisplay) {
        const pairs = _.reduce(inputDisplay, (result, display: InputDisplay) => {
            if (!this._isNullValue(display.value)) {
                const pair: PairDto = {
                    key: display.key,
                    value: !this.soUtils.typeIsSmartObject(display.type) ?
                            display.value :
                            (
                                _.isArray(display.value) ?
                                    _.map(display.value, (value: SmartObjectDto) => value.uuid ? value.uuid : value) :
                                    display.value.uuid ? display.value.uuid : display.value
                            )
                };
                result.push(pair);
            }
            return result;
        }, []);
        this.update.emit(pairs);
    }

    _isNullValue(value: any): boolean {
        return (value === '' || value === undefined || value === null) ?
            true :
            false;
    }
}
