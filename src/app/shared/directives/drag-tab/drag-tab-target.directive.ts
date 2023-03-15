import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';
import { TabDto } from '../../dtos';
import { MessageService } from '../../services';

@Directive({
    selector: '[appDragTabTarget]'
})
export class DragTabTargetDirective implements OnInit {
    @Input('appDragTabTarget') tab: TabDto = null;

    subscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private messageService: MessageService
    ) {
        this.subscription = this.messageService.get('tabs.dragstart').subscribe((tab: TabDto) => {
            this.elementRef.nativeElement.hidden = false;
        });

        this.subscription = this.messageService.get('tabs.dragend').subscribe((tab: TabDto) => {
            this.elementRef.nativeElement.hidden = true;
        });
    }

    @HostListener('dragenter', ['$event'])
    onDragEnter(event: DragEvent) {
        this.elementRef.nativeElement.classList.add('focused');
    }

    @HostListener('dragleave', ['$event'])
    onDragLeave(event: DragEvent) {
        this.elementRef.nativeElement.classList.remove('focused');
    }

    @HostListener('drop', ['$event'])
    onDrop(event: DragEvent) {
        event.preventDefault();
        const side = this.elementRef.nativeElement.classList.contains('left') ? 'left' : 'right';
        this.messageService.send('tabs.drop', { tab: this.tab, side});
        this.elementRef.nativeElement.classList.remove('focused');
    }

    @HostListener('dragover', ['$event'])
    onDragOver(event: DragEvent) {
        event.preventDefault();
    }

    ngOnInit() {
        this.elementRef.nativeElement.hidden = true;
    }
}
