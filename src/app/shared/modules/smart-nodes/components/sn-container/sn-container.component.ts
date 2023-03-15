import {
    Component, Input, ChangeDetectorRef, OnChanges, SimpleChanges,
} from '@angular/core';
import { SnView, SnElement } from '../../models';
import { SnActionsService, SnSelectionService } from '../../services';

@Component({
    selector: 'sn-container',
    templateUrl: './sn-container.component.html',
    styleUrls: ['./sn-container.component.scss']
})
export class SnContainerComponent implements OnChanges {

    @Input() container: SnElement;
    @Input() snView: SnView;
    @Input() type: 'group' | 'box';

    constructor(
        private snActionsService: SnActionsService,
        private snSelection: SnSelectionService,
        private ref: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            this.ref.detectChanges();
        }
    }

    openComment() {
        this.snActionsService.openComment(this.snView, this.container);
    }

    onContainerClose() {
        this.snActionsService.closeContainer(this.snView, this.container);
    }

    select($event) {
        this.snSelection.select($event, this.snView, { element: this.container, type: this.type });
    }
}
