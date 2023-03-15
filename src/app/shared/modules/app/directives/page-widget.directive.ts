import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[widgetHost]',
})
export class PageWidgetDirective {
    constructor (
        public viewContainerRef: ViewContainerRef,
    ) { }
}
