import { Component, Input, Output, EventEmitter, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { OptionsElementDto } from '../../../../dtos/options-element.dto';

@Component({
    selector: 'options-popover',
    templateUrl: './options-popover.component.html',
    styleUrls: ['./options-popover.component.scss'],
})
export class OptionsPopoverComponent implements OnInit, AfterViewInit {

    @Input() inputList: OptionsElementDto[];
    @Input() clickPosition: { x: number, y: number };
    @Input() containerWidth: number;
    @Input() containerLeft: number;
    @Input() withArrow = false;
    @Input() scrollRealPosition: number;
    @Output() selectedInput = new EventEmitter<OptionsElementDto>();

    @ViewChild('popover') popover: ElementRef;

    filteredInputList: OptionsElementDto[];
    yPosition: 'top' | 'bottom' = 'bottom';
    arrowLeftMargin = 0;
    top: number;
    left = 0;
    barHeight = 25;
    search = '';

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.filteredInputList = this.inputList;

        if (this.withArrow) {
            this.arrowLeftMargin = (this.containerWidth / 2) - 10;
        }

        if (this.containerLeft) {
            this.left = this.containerLeft;
        }
    }

    ngAfterViewInit() {
        if (this.withArrow && this.clickPosition.x + this.popover.nativeElement.offsetWidth > window.innerWidth) {
            this.left = this.left - this.popover.nativeElement.offsetWidth + (window.innerWidth - this.clickPosition.x);
            if (this.withArrow) {
                this.arrowLeftMargin = this.arrowLeftMargin - this.left;
            }
        }
        if (this.scrollRealPosition) {
            this.top = this.scrollRealPosition;
        }

        if (this.clickPosition.y + this.popover.nativeElement.offsetHeight > window.innerHeight - this.barHeight) {
            this.yPosition = 'top';
            this.top = (this.scrollRealPosition) ?
             -(this.popover.nativeElement.offsetHeight - this.scrollRealPosition + 36 ) :
             -(this.popover.nativeElement.offsetHeight);
        }

        this.changeDetectorRef.detectChanges();
    }

    selectInput(input: OptionsElementDto) {
        this.selectedInput.emit(input);
    }

    onSearch(search: string) {
        this.filteredInputList = this.inputList.filter((input: OptionsElementDto) =>
            input.value.toUpperCase().includes(search.toUpperCase())
        );
    }

}
