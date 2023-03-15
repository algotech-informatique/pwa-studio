import { SnAppDto, SnPageDto, SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import * as _ from 'lodash';
import { AppSelectionService, PageWidgetService } from '../../../app/services';
import { AppSettings } from '../../../app/dto';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'widget-parameters',
    templateUrl: './widget-parameters.component.html',
    styleUrls: ['./widget-parameters.component.scss'],
})
export class WidgetParametersComponent implements OnChanges {

    @Input() page: SnPageDto;
    @Input() settings: AppSettings;
    @Input() widget: SnPageWidgetDto;
    @Input() snApp: SnAppDto;
    @Input() selectedTab: string;
    @Output() changed = new EventEmitter();
    @Output() rulesChanged = new EventEmitter<SnPageWidgetRuleDto[]>();
    selectedWidget: SnPageWidgetDto;

    constructor(
        private appSelection: AppSelectionService,
        private widgetsService: PageWidgetService,
    ) { }

    ngOnChanges() {
        this.selectedWidget = this.widget;
    }

    onWidgetChanged(widget: SnPageWidgetDto) {
        this.selectedWidget = widget;
        this.appSelection.select(null, this.snApp, { element: this.selectedWidget, type: 'widget' });
    }

    onChanged() {
        this.widgetsService.updateRule(this.widget);
        this.changed.emit();
    }

    onRulesChanged(rules: SnPageWidgetRuleDto[]) {
        this.rulesChanged.emit(rules);
    }

    onRuleSelected(ruleId: string) {
        const selectedRule = !ruleId || this.widget.displayState.rule?.rule?.id === ruleId ?
            null :
            this.widget.rules.find((rule) => rule.id === ruleId);
        this.widgetsService.enableRule(this.snApp, this.widget, selectedRule);
    }

}
