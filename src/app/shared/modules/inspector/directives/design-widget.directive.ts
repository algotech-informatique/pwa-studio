import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[designWidgetHost]',
})
export class DesignWidgetDirective {
    constructor(
        public viewContainerRef: ViewContainerRef,
    ) { }
}
