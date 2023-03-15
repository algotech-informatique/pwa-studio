import { AfterViewInit, ChangeDetectorRef, Component,
    ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'color-popover',
    templateUrl: './color-popover.component.html',
    styleUrls: ['./color-popover.component.scss'],
})
export class ColorPopoverComponent implements OnInit, AfterViewInit {

    @ViewChild('popover') popover: ElementRef;

    @Input() color: string;
    @Input() dropdown: 'hover' | 'click';
    @Input() closeOnSelect = false;
    @Input() clickPosition: { x: number, y: number };
    @Input() containerWidth: number;
    @Input() containerLeft: number;

    popupVisible = false;
    top: number;
    left = 0;
    barHeight = 25;

    @Output() clicked = new EventEmitter();

    constructor(
        private ref: ChangeDetectorRef
    ) { }

    ngOnInit() {
        if (this.containerLeft) {
            this.left = this.containerLeft;
        }
    }

    ngAfterViewInit() {

        if (this.clickPosition.y + this.popover.nativeElement.offsetHeight > window.innerHeight - this.barHeight) {
            this.top = -(this.popover.nativeElement.offsetHeight);
        }

        this.ref.detectChanges();
    }

}
