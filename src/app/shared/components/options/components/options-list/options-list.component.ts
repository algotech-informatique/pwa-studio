import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';
import * as _ from 'lodash';

@Component({
    selector: 'options-list',
    styleUrls: ['./options-list.component.scss'],
    templateUrl: './options-list.component.html',
})
export class OptionsListComponent implements OnDestroy {

    @Input() label = '';
    @Input() readOnly = false;
    @Input() inputList: OptionsElementDto[];
    @Input() selected: OptionsElementDto;
    @Input() relativeLeft: number;
    @Output() selectValue = new EventEmitter<OptionsElementDto>();

    @ViewChild('select') select: ElementRef;

    clickPosition: { x: number; y: number };
    showPopover = false;
    closePopoverSubscription: Subscription;
    popoverContainerWidth: number;
    popoverContainerLeft: number;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    togglePopover(event: any) {
        this.clickPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        this.popoverContainerWidth = this.select.nativeElement.offsetWidth;
        if (this.relativeLeft) {
            this.popoverContainerLeft = this.select.nativeElement.getBoundingClientRect()?.x - this.relativeLeft;
        }

        if (!this.showPopover) {
            this.closePopoverSubscription = fromEvent(document, 'click').subscribe((event) => {
                const className = (<HTMLInputElement>event.target).className;
                if ((!_.isString(className) || (_.isString(className) && !className.includes('options-popover'))) && this.showPopover) {
                    this.showPopover = false;
                    this.closePopoverSubscription.unsubscribe();
                } else if (!this.showPopover) {
                    this.showPopover = true;
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    onInputSelected(selected: OptionsElementDto) {
        this.togglePopover(false);
        this.selectValue.emit(selected);
    }

    ngOnDestroy() {
        if (this.closePopoverSubscription) {
            this.closePopoverSubscription.unsubscribe();
        }
    }

}
