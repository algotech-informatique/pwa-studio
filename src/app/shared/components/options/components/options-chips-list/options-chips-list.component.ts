import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { fromEvent, Subscription } from 'rxjs';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';

@Component({
    selector: 'options-chips-list',
    styleUrls: ['./options-chips-list.component.scss'],
    templateUrl: './options-chips-list.component.html',
})
export class OptionsChipsListComponent implements OnChanges {

    @Input() inputList: OptionsElementDto[];
    @Input() items: OptionsElementDto[];
    @Input() label: string;
    @Input() includeBottomBorder = true;
    @Output() changeValue = new EventEmitter<OptionsElementDto[]>();

    @ViewChild('addButton') addButton: ElementRef;
    @ViewChild('chipList') chipList: ElementRef;

    inputValue = '';
    inputError = false;
    showPopover = false;
    clickPosition: { x: number, y: number };
    popoverContainerWidth: number;
    filteredInputList: OptionsElementDto[];
    closePopoverSubscription: Subscription;
    scrollRealPosition: number;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.items?.currentValue) {
            this.updateInputList();
        }
    }

    removeItem(i: number) {
        this.items.splice(i, 1);
        this.updateInputList();
        this.changeValue.emit(this.items);
    }

    togglePopover(event: any) {
        this.clickPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        this.popoverContainerWidth = this.addButton.nativeElement.offsetWidth;
        this.scrollRealPosition = this.chipList.nativeElement.offsetHeight - this.chipList.nativeElement.scrollHeight;

        if (!this.showPopover) {
            this.closePopoverSubscription = fromEvent(document, 'click').subscribe((ev) => {
                const className = (<HTMLInputElement>ev.target).className;
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

    onInputSelected(input: OptionsElementDto) {
        this.items.push(input);
        this.updateInputList();
        this.changeValue.emit(this.items);
    }

    private updateInputList() {
        this.filteredInputList = this.inputList.filter((input) => !_.some(this.items, (item) => _.isEqual(input, item)));
    }

}

