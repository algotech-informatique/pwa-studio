import {
    Directive,
    Output,
    EventEmitter,
    HostBinding,
    HostListener,
    Input
} from '@angular/core';

@Directive({
    selector: '[appGridDnd]'
})
export class DragNdDropDirective {
    @Input('appGridDnd')
    public loaded: boolean;

    @HostBinding('class.fileover') fileOver: boolean;
    @HostBinding('class.dropDisabled') dropDisabled: boolean;

    @Output() fileDropped = new EventEmitter<any>();

    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.fileOver = true;
        this.dropDisabled = !this.loaded || ev.dataTransfer.items.length > 1 || (
            ev.dataTransfer.items.length > 0 && !ev.dataTransfer.items[0].type.endsWith('csv'));
    }

    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.fileOver = false;
        this.dropDisabled = false;
    }

    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        this.fileOver = false;
        if (!this.dropDisabled) {
            this.fileDropped.emit({ target: { files: ev.dataTransfer.files } });
        }
        this.dropDisabled = false;
    }
}
