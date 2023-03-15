import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { TabDto } from '../../dtos';
import { MessageService } from '../../services';

@Directive({
    selector: '[appDragTabSource]'
})
export class DragTabSourceDirective implements OnInit {
    @Input('appDragTabSource') tab: TabDto = null;

    private element: HTMLElement;

    constructor(
        private elementRef: ElementRef,
        private messageService: MessageService
    ) { }

    @HostListener('dragstart', ['$event'])
    onDragStart(event: DragEvent) {
        this.messageService.send('tabs.dragstart', this.tab);
        this.element = this.createComponent();

        document.body.appendChild(this.element);
        event.dataTransfer.setDragImage(this.element, -10, -10);
    }

    @HostListener('dragend', ['$event'])
    onDragEnd(event: DragEvent) {
        this.messageService.send('tabs.dragend', this.tab);
        document.body.removeChild(this.element);
    }

    ngOnInit() {
        this.elementRef.nativeElement.draggable = true;
    }

    createComponent() {
        const element = document.createElement('span');
        element.style.position = 'absolute';
        element.style.top = '-1000px';
        element.innerHTML = this.tab.title;
        element.style.fontSize = '12px';
        element.style.padding = '2px';

        return element;
    }
}
