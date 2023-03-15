import { Component, Input, Output, EventEmitter, ElementRef, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { SnActionsService, SnSelectionService } from '../../../../smart-nodes/services';
import { SnView } from '../../../../smart-nodes/models';
import { Subscription } from 'rxjs';

@Component({
    selector: 'sn-select-modal',
    template: `
    <div *ngIf="top" #modal (click)="onClick($event)" class="scrollable" (clickOutside)="close($event)" clickOutsideEvents='mousedown'>
        <div class="modal" [ngStyle]="{'top.px': top}">
            <ng-content></ng-content>
        </div>
    </div>
    `,
    styleUrls: ['./sn-select-modal.component.scss']
})
export class SnSelectModalComponent implements AfterViewInit, OnDestroy {

    @Input() snView: SnView;

    @Input()
    get top() {
        return this._top;
    }

    @ViewChild('modal') modal: ElementRef;
    _top: any = null;

    @Output()
    topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }

    subscription: Subscription;

    constructor(private snSelection: SnSelectionService, private snActions: SnActionsService) {
    }

    onClick($event) {
        $event.stopPropagation();
    }

    ngAfterViewInit() {
        if (this.snView) {
            this.subscription = this.snSelection.onSelect(this.snView).subscribe(() => {
                if (this._top) {
                    this.close();
                    this.snActions.notifyRefresh(this.snView);
                }
            });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
          this.subscription.unsubscribe();
        }
    }

    close() {
        this.top = null;
    }
}
