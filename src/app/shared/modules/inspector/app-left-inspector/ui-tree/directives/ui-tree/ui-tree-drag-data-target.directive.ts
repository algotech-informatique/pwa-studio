import { Directive, Input, ElementRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { SnPageDto, SnPageWidgetDto } from '@algotech/core';
import * as _ from 'lodash';
import { AppActionsService, AppSelectionService, PageUtilsService, PageWidgetService } from '../../../../../app/services';
import { UITreeMoveService } from '../../ui-tree-move.service';
import { MessageService } from '../../../../../../services';
import { UITreeMoveData } from '../../models/ui-tree-move-data.interface';
import { UITree } from '../../models/ui-tree';

@Directive({
    selector: '[appUITreeDragTarget]'
})
export class UITreeDragTargetDirective {
    @Input('appUITreeDragTarget')
    line: UITree = null;

    counter = 0;
    subscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private appActions: AppActionsService,
        private appSelection: AppSelectionService,
        private pageUtils: PageUtilsService,
        private pageWidget: PageWidgetService,
        private uiTreeMoveService: UITreeMoveService,
        private messageService: MessageService) {
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: DragEvent): void {
        event.stopImmediatePropagation();
        if (!this.uiTreeMoveService.checkAccept(this.line.snApp, this.getMoveData())) {
            return;
        }

        event.preventDefault();
    }

    @HostListener('dragenter', ['$event'])
    public onDragEnter(event): void {
        event.stopImmediatePropagation();
        if (!this.uiTreeMoveService.checkAccept(this.line.snApp, this.getMoveData())) {
            this.elementRef.nativeElement.classList.add('dragrefused');
            this.refresh();
            return;
        }

        this.counter++;

        // after 1000ms, open the folder
        setTimeout(() => {
            if (this.counter > 0) {
                if (this.line && !this.appSelection.selections.widgets.some((w) => w.id === this.line.element.id)) {
                    this.line.open = true;
                    this.refresh();
                }
            }
        }, 1000);

        if (this.elementRef.nativeElement.classList.contains('center')) {
            this.appActions.applyHighlight(this.line.snApp, this.line.element);
            this.refresh();
        } else if (this.line.parent) {
            this.appActions.applyHighlight(this.line.snApp, this.line.parent.element);
            this.refresh();
        }
        if (!this.elementRef.nativeElement.classList.contains('draghover')) {
            this.elementRef.nativeElement.classList.add('draghover');
        }
    }

    @HostListener('dragleave', ['$event'])
    public onDragLeave(event): void {
        event.stopImmediatePropagation();
        if (!this.uiTreeMoveService.checkAccept(this.line.snApp, this.getMoveData())) {
            return;
        }

        this.counter--;
        if (this.counter === 0) {
            this.elementRef.nativeElement.classList.remove('draghover');
        }
    }

    @HostListener('drop', ['$event'])
    public onDrop(event): void {
        event.stopImmediatePropagation();
        if (!this.uiTreeMoveService.checkAccept(this.line.snApp, this.getMoveData())) {
            return;
        }

        this.uiTreeMoveService.move(this.line.snApp, this.getMoveData());
        this.counter = 0;
    }

    getMoveData(): UITreeMoveData {
        let data: UITreeMoveData;
        switch (this.line.type) {
            case 'page': {
                const page = (this.line.element as SnPageDto);
                data = {
                    destination: page,
                    page,
                    brothers: page.widgets,
                    index: page.widgets.length,
                    type: 'page',
                };
            }
                break;
            case 'widget': {
                const target = (this.line.element as SnPageWidgetDto);
                if (this.elementRef.nativeElement.classList.contains('center')) {
                    data = {
                        destination: target,
                        page: this.pageUtils.findPage(this.line.snApp, target),
                        brothers: target.group.widgets,
                        index: target.group.widgets.length,
                        type: 'widget',
                    };
                } else {
                    data = {
                        destination: this.pageUtils.getParent(this.line.snApp, target),
                        page: this.pageUtils.findPage(this.line.snApp, target),
                        brothers: this.pageUtils.getBrothers(this.line.snApp, target),
                        index: -1,
                        type: this.pageUtils.isMasterWidget(this.line.snApp, target) ? 'page' : 'widget'
                    };
                    if (this.elementRef.nativeElement.classList.contains('top')) {
                        data.index = data.brothers.indexOf(target) + 1;
                    } else {
                        data.index = data.brothers.indexOf(target);
                    }
                }
            }
        }
        return data;
    }

    refresh() {
        this.messageService.send('uitree.refresh', {});
    }
}
