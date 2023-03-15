import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos';
import { MessageService, SessionsService, EnvironmentService } from '../../services';

@Directive({
    selector: '[appDragExplorerSource]'
})
export class DragExplorerSourceDirective implements OnInit {
    @Input('appDragExplorerSource')
    line: ObjectTreeLineDto = null;

    @Input()
    multiple = false;

    @Input()
    key = '';

    // Drag handle
    private element: HTMLElement;

    constructor(
        private elementRef: ElementRef,
        private envService: EnvironmentService,
        private sessionsService: SessionsService,
        private messageService: MessageService) {
    }

    createComponent() {
        const element = document.createElement('span');
        element.style.position = 'absolute';
        element.style.top = '-1000px';
        element.innerHTML = this.line.name;
        element.style.fontSize = '12px';
        element.style.padding = '2px';

        return element;
    }

    ngOnInit() {
        this.elementRef.nativeElement.draggable = (this.line && this.line.type !== 'smartmodel');
    }

    @HostListener('dragstart', ['$event'])
    public onDragStart(event: DragEvent) {
        this.messageService.send('moveexplorer.dragstart', this.line);
        this.element = this.createComponent();

        this.line.state = false;
        this.line.active = true;

        this.refresh();

        document.body.appendChild(this.element);
        event.dataTransfer.setDragImage(this.element, -10, -10);
    }

    @HostListener('dragend', ['$event'])
    public onDragend($event) {
        this.messageService.send('moveexplorer.dragend', this.line);
        document.body.removeChild(this.element);

        if ($event.dataTransfer && $event.dataTransfer.dropEffect === 'none') {
            return;
        }

        this.sessionsService.refreshEnv(this.line.host, this.line.customerKey);

        // resource
        const ressource = this.sessionsService.getEnvByUUid(this.line.host, this.line.customerKey, this.line.refUuid);
        if (!ressource) {
            return;
        }
        ressource.active = true;

        // dirParent
        const parent = this.envService.findParent(
            this.sessionsService.getEnvByType(this.line.host, this.line.customerKey, this.line.type), ressource);
        if (parent) {
            parent.state = true;
        }

        // rm class
        const elements = document.getElementsByClassName('draghover');
        if (elements.length > 0) {
            elements[0].classList.remove('draghover');
        }
    }

    refresh() {
        this.messageService.send('moveexplorer.refresh', {});
    }
}
