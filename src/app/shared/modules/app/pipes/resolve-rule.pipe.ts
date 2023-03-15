import { SnPageWidgetDto, SnPageWidgetRuleDto } from '@algotech/core';
import { Pipe, PipeTransform } from '@angular/core';
import { PageWidgetService } from '../services';

@Pipe({
    name: 'resolveRule'
})

export class ResolveRulePipe implements PipeTransform {
    constructor(private widgetsService: PageWidgetService) {}
    transform(rule: any, widget: SnPageWidgetDto): any {
        return rule?.widget ? rule.widget : widget;
    }
}
