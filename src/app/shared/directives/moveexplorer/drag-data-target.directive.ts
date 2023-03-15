import { Directive, Input, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos';
import { MessageService, SessionsService, DatasService } from '../../services';
import { Subscription } from 'rxjs';

@Directive({
    selector: '[appDragExplorerTarget]'
})
export class DragExplorerTargetDirective implements OnDestroy {
    @Input('appDragExplorerTarget')
    line: ObjectTreeLineDto = null;

    @Input()
    type: string = null;

    @Input()
    host: string = null;

    @Input()
    customerKey: string = null;

    source: ObjectTreeLineDto = null;

    counter = 0;
    subscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private datasService: DatasService,
        private sessionsService: SessionsService,
        private messageService: MessageService) {
        this.subscription = this.messageService.get('moveexplorer.dragstart').subscribe((line: ObjectTreeLineDto) => {
            this.source = line;
        });

        this.subscription.add(this.messageService.get('moveexplorer.dragend').subscribe(() => {
            this.source = null;
        }));
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: DragEvent): void {
        event.stopImmediatePropagation();
        if (!this.checkAccept()) {
            return ;
        }

        event.preventDefault();
    }

    @HostListener('dragenter', ['$event'])
    public onDragEnter(event): void {
        event.stopImmediatePropagation();
        if (!this.checkAccept()) {
            return ;
        }

        this.counter++;

        // after 500ms, open the folder
        setTimeout(() => {
            if (this.counter > 0) {
                if (this.line && this.line !== this.source && this.line.isFolder) {
                    this.line.state = true;
                    this.refresh();
                }
            }
        }, 500);

        if (!this.elementRef.nativeElement.classList.contains('draghover')) {
            this.elementRef.nativeElement.classList.add('draghover');
        }
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event): void {
        event.stopImmediatePropagation();
        if (!this.checkAccept()) {
            return ;
        }

        this.counter--;
        if (this.counter === 0) {
            this.elementRef.nativeElement.classList.remove('draghover');
        }
    }

    @HostListener('drop', ['$event'])
    public onDrop(event): void {
        event.stopImmediatePropagation();
        if (!this.checkAccept()) {
            return ;
        }

        this.counter = 0;
        this.datasService.notifyMoveEnv(this.source, this.line);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    checkAccept() {
        if (!this.source) {
            return false;
        }

        if (!this.line) {
            if (this.type === 'smartflow') {
                return false;
            }
            if (this.host === this.source.host && this.customerKey === this.source.customerKey && this.type === this.source.type) {
                const env = this.sessionsService.getEnvByType(this.host, this.customerKey, this.type);
                return env && !env.some((e) => e.refUuid === this.source.refUuid) &&
                    !env.some((e) => e.isFolder === this.source.isFolder && e.name === this.source.name);
            }
        }

        if (this.line.customerKey !== this.source.customerKey || this.line.host !== this.source.host) {
            return false;
        }

        if (this.line.type !== this.source.type) {
            return false;
        }

        if (this.source.type === 'smartflow' && this.source.isConnector) {
            return false;
        }

        if (!this.line.isFolder) {
            return false;
        }

        if (this.line === this.source || this.line.children.find((child) => child.refUuid === this.source.refUuid)) {
            return false;
        }

        if (this.line.children.find((child) => child.isFolder === this.source.isFolder && child.name === this.source.name)) {
            return false;
        }

        return true;
    }

    refresh() {
        this.messageService.send('moveexplorer.refresh', {});
    }
}
