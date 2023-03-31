import { PairDto, SnAppDto, SnPageDto, SnPageWidgetConditionDto, SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { UUID } from 'angular2-uuid';
import { AppSettings } from '../../../../app/dto';
import { SnContextmenu } from '../../../../smart-nodes';
import { ListItem } from '../../../dto/list-item.dto';

@Component({
    selector: 'rules-parameters',
    templateUrl: './rules-parameters.component.html',
    styleUrls: ['./rules-parameters.component.scss'],
})
export class RulesParametersComponent {

    @Input() snApp: SnAppDto;
    @Input() widget: SnPageWidgetDto;
    @Input() page: SnPageDto;
    @Input() rules: SnPageWidgetRuleDto[];
    @Input() settings: AppSettings;

    @Output() rulesChanged = new EventEmitter<SnPageWidgetRuleDto[]>();
    @Output() ruleSelected = new EventEmitter<string>();
    @Output() widgetChanged = new EventEmitter<SnPageWidgetDto>();

    addedIndex: number;
    operatorsList: ListItem[];

    mouse: number[] = [0, 0];
    menu: SnContextmenu;
    arrowClick = false;

    constructor(
        private translateService: TranslateService,
    ) {
        this.operatorsList = [
            { key: 'and', value: this.translateService.instant('INSPECTOR.WIDGET.RULE-AND') },
            { key: 'or', value: this.translateService.instant('INSPECTOR.WIDGET.RULE-OR') },
        ];
    }

    onNameChanged(name: PairDto, index: number) {
        this.rules[index].name = name.value;
        this.rules = [...this.rules];
        this.rulesChanged.emit(this.rules);
    }

    onColorChanged(color: string, index: number) {
        this.rules[index].color = color;
        this.rules = [...this.rules];
        this.rulesChanged.emit(this.rules);
    }

    onOperatorChanged(operator: 'and' | 'or', index: number) {
        this.rules[index].operator = operator;
        this.rulesChanged.emit(this.rules);
    }

    onConditionsChanged(conditions: SnPageWidgetConditionDto[], index: number) {
        this.rules[index].conditions = conditions;
        this.rulesChanged.emit(this.rules);
    }

    addRule() {
        const newRule: SnPageWidgetRuleDto = {
            id: UUID.UUID(),
            name: this.translateService.instant('INSPECTOR.WIDGET.NEW-RULE'),
            color: '#664a8d',
            conditions: [],
            operator: 'and',
            css: {},
            custom: {},
            events: [],
        };
        this.rules = [...this.rules, newRule];
        this.addedIndex = this.rules.length - 1;
        this.rulesChanged.emit(this.rules);
    }

    removeRule(index: number, ruleId: string) {
        this.rules?.splice(index, 1);
        this.rules = [...this.rules];
        if (this.widget.displayState.rule?.rule?.id === ruleId) {
            this.ruleSelected.emit(null);
        };
        this.rulesChanged.emit(this.rules);
    }

    arrowMoveEvent(direction: 'up' | 'down', rule, index: number) {
        this.rules.splice(index, 1);
        this.rules.splice(direction === 'up' ? index - 1 : index + 1, 0, rule);
        this.rulesChanged.emit(this.rules);
    }

    activeRule(index: number) {
        this.ruleSelected.emit(this.rules[index].id);
    }
}
