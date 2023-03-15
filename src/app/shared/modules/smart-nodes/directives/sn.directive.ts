import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[sn-host]',
})
export class SnDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
