import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'options-color',
    templateUrl: './options-color.component.html',
    styleUrls: ['./options-color.component.scss'],
})
export class OptionsColorComponent implements OnChanges {

    @ViewChild('button') button: ElementRef;

    @Input() color: string;
    @Input() presetColors = [];

    @Output() changed = new EventEmitter();

    mdColors = ['#ffffff', '#d32f2f', '#c2185b', '#7b1fa2', '#512da8',
    '#303f9f', '#1976d2', '#0288d1', '#0097a7', '#00796b', '#388e3c',
    '#689f38', '#fbc02d', '#ffa000', '#f57c00', '#e64a19', '#5d4037',
    '#616161', '#455a64', '#263238', '#000000'];

    colors = this.mdColors;
    cmpActive = true;

    clickPosition: { x: number, y: number };
    showPopover = false;
    closePopoverSubscription: Subscription;
    popoverContainerWidth: number;

    constructor(private ref: ChangeDetectorRef) { }

    ngOnChanges() {
        this.colors = this.presetColors?.length > 0 ? this.presetColors : this.mdColors;
    }

    onColorChange(event) {
        this.color = event;
        this.changed.emit(this.color);

        // close
        if (this.colors.includes(event)) {
            this.cmpActive = false;
            this.ref.detectChanges();
            this.cmpActive = true;
        }
    }

    onClickIcon(event) {
        this.clickPosition = {
            x: event.clientX,
            y: event.clientY,
        };
        this.popoverContainerWidth = this.button.nativeElement.offsetWidth;

        if (!this.showPopover) {
            this.closePopoverSubscription = fromEvent(document, 'click').subscribe((ev) => {
                const className = (<HTMLInputElement>ev.target).className;
                if ((!_.isString(className) || (_.isString(className) && !className.includes('options-popover'))) && this.showPopover) {
                    this.showPopover = false;
                    this.closePopoverSubscription.unsubscribe();
                } else if (!this.showPopover) {
                    this.showPopover = true;
                    this.ref.detectChanges();
                }
            });
        }
    }
}
