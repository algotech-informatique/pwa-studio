import { SnPageWidgetConditionDto, SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech/core';

export class RuleWidget {
    element: SnPageWidgetDto;
    type: 'widget';
    rule?: SnPageWidgetRuleDto;
    condition?: SnPageWidgetConditionDto;
    path: string;
}
