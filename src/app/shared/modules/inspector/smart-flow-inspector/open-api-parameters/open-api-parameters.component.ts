import { PairDto, WorkflowApiModelDto } from '@algotech/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SessionsService } from 'src/app/shared/services';
import { VariablesServices } from '../../components/variables/variables.service';
import { ListItem } from '../../dto/list-item.dto';

@Component({
    selector: 'open-api-parameters',
    templateUrl: './open-api-parameters.component.html',
    styleUrls: ['./open-api-parameters.component.scss'],
})
export class OpenApiParametersComponent {

    @Input() api: WorkflowApiModelDto;
    @Output() apiChanged = new EventEmitter<WorkflowApiModelDto>();
    codeSuggestionsList: PairDto[];
    contentSuggestionsList: PairDto[];
    commonCodes = ['default', '200', '400', '401', '404', '5XX'];
    types: ListItem[];

    constructor(
        private variablesService: VariablesServices,
        private sessionsService: SessionsService,
    ) {
        this.types = this.variablesService.typeBuilder(this.sessionsService.active.datas.read.smartModels);
        this.types.unshift({ key: 'none', value: '' });

        this.contentSuggestionsList = [
            { key: 'application/json', value: 'application/json' },
            { key: 'application/xml', value: 'application/xml' },
            { key: 'text/plain', value: 'text/plain' },
        ];

        this.codeSuggestionsList = [
            { key: 'default', value: 'default' },
            { key: '200', value: '200' },
            { key: '400', value: '400' },
            { key: '401', value: '401' },
            { key: '404', value: '404' },
            { key: '5XX', value: '5XX' },
        ];
    }

    onSummaryChanged(summary: string) {
        this.api.summary = summary;
        this.apiChanged.emit(this.api);
    }

    onDescriptionChanged(description: string) {
        this.api.description = description;
        this.apiChanged.emit(this.api);
    }

    onResponseCodeChanged(code: string, index: number) {
        this.api.result[index].code = code;
        this.apiChanged.emit(this.api);
    }

    onResponseDescriptionChanged(description: string, index: number) {
        this.api.result[index].description = description;
        this.apiChanged.emit(this.api);
    }

    onResponseContentChanged(content: string, index: number) {
        this.api.result[index].content = content;
        this.apiChanged.emit(this.api);
    }

    onResponseTypeChanged(type: string, index: number) {
        this.api.result[index].type = type === 'none' ? null : type;
        this.apiChanged.emit(this.api);
    }

    onResponseMultipleChanged(multiple: boolean, index: number) {
        this.api.result[index].multiple = multiple;
        this.apiChanged.emit(this.api);
    }

    addResponse() {
        this.api.result.push({
            code: '',
            description: '',
            content: '',
            multiple: false,
            type: '',
        });
        this.apiChanged.emit(this.api);
    }

    deleteResponse(index: number) {
        this.api.result.splice(index, 1);
        this.apiChanged.emit(this.api);
    }

}
