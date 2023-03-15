import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';

@Directive({
    selector: '[appDragSelectorWidget]'
})
export class DragSelectorWidgetDirective implements OnInit {

    @Input('appDragSelectorWidget') widget: string;

    @HostListener('dragstart', ['$event'])
    public onDragStart(event: DragEvent) {
        // On drag start
    }

    @HostListener('dragend', ['$event'])
    public onDragend($event) {
        // On drag end
    }

    constructor(
        private elementRef: ElementRef,
    ) { }

    ngOnInit() {
        this.elementRef.nativeElement.draggable = true;
    }

}
