import { SnPageDto, SnPageWidgetConditionDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { WidgetInput } from 'src/app/shared/modules/app-custom/dto/widget-input.dto';
import { AppCustomService } from 'src/app/shared/modules/app-custom/services';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'rule-conditions',
    templateUrl: './rule-conditions.component.html',
    styleUrls: ['./rule-conditions.component.scss'],
})
export class RuleConditionsComponent implements OnChanges {

    @Input() conditions: SnPageWidgetConditionDto[];
    @Input() page: SnPageDto;
    @Input() ruleId: string;
    @Input() widget: SnPageWidgetDto;
    @Output() conditionsChanged = new EventEmitter<SnPageWidgetConditionDto[]>();

    inputsData: Observable<WidgetInput[]>;

    constructor(
        private appCustomService: AppCustomService,
    ) { }

    ngOnChanges() {
        this.inputsData = this.appCustomService.getAvailableInputs$(this.page, this.widget);
    }

    onConditionChanged(condition: SnPageWidgetConditionDto, index: number) {
        this.conditions[index] = condition;
        this.conditionsChanged.emit(this.conditions);
    }

    onConditionRemoved(index: number)  {
        this.conditions.splice(index, 1);
        this.conditionsChanged.emit(this.conditions);
    }

    addCondition() {
        this.conditions.push({
            input: '',
            criteria: '',
            value: null,
        });
        this.conditionsChanged.emit(this.conditions);
    }

    arrowMoveEvent(direction: 'up' | 'down', condition, index) {
        this.conditions.splice(index, 1);
        this.conditions.splice(direction === 'up' ? index - 1 : index + 1, 0, condition);
        this.conditionsChanged.emit(this.conditions);
    }
}
