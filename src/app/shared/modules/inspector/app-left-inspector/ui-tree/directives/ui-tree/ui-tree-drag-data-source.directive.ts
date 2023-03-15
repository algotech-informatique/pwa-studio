import { Directive, Input, HostListener, OnInit, ElementRef } from '@angular/core';
import { MessageService } from '../../../../../../services';
import * as d3 from 'd3';
import { AppActionsService } from '../../../../../app/services';
import { UITree } from '../../models/ui-tree';

@Directive({
    selector: '[appUITreeDragSource]'
})
export class UITreeDragSourceDirective implements OnInit {
    @Input('appUITreeDragSource')
    line: UITree = null;

    constructor(
        private messageService: MessageService,
        private elementRef: ElementRef,
        private appActions: AppActionsService) { }

    @HostListener('dragstart', ['$event'])
    onDragStart(event: DragEvent) {
        this.messageService.send('uitree.dragstart', this.line);
        event.dataTransfer.setDragImage(document.createElement('img'), 0, 0);

        setTimeout(() => {
            d3
                .selectAll('.ui-tree-line')
                .classed('drag-hook', true);
        }, 0);
    }

    @HostListener('dragend', ['$event'])
    onDragend($event) {
        this.messageService.send('uitree.dragend', this.line);
        const dragHook = d3
            .selectAll('.ui-tree-line')
            .classed('drag-hook', false)
            .selectAll('.ui-tree-line-item-drag-hook');

        dragHook
            .select('.top')
            .classed('draghover', false)
            .classed('dragrefused', false);

        dragHook
            .select('.middle')
            .classed('draghover', false)
            .classed('dragrefused', false);

        dragHook
            .select('.bottom')
            .classed('draghover', false)
            .classed('dragrefused', false);

        this.appActions.resetHighlight(this.line.snApp);
    }

    ngOnInit() {
        this.elementRef.nativeElement.draggable = this.line.type === 'widget';
    }
}
