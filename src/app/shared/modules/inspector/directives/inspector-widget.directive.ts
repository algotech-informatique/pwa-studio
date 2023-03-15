import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[inspectorWidgetHost]',
})
export class InspectorWidgetDirective {
    constructor(
        public viewContainerRef: ViewContainerRef,
    ) { }
}
