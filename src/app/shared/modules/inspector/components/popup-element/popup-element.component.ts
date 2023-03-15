import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { PopupElementService } from './popup-element.service';

@Component({
    selector: 'popup-element',
    templateUrl: './popup-element.component.html',
    styleUrls: ['./popup-element.component.scss'],
})
export class PopupElementComponent implements OnChanges {

    @ViewChild('popup') popup: ElementRef;
    @ViewChild('background') background: ElementRef;
    @Input() container: PopupContainerDto;
    @Input() show: boolean;
    @Input() popupMargin: number;
    @Input() containerWidth = true;
    @Output() closePopup = new EventEmitter();

    width: number;
    top: number;
    bottom: number;
    scrollHeight: number;
    showToTop: boolean;
    margin: string;
    rightPos = false;

    constructor(
        private popupElement: PopupElementService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.container?.currentValue) {
            this.width = this.container.containerClientRect.width;

            if (!changes.show) {
                this.updatePopoverPosition();
            }
        }
        if (changes.show?.currentValue) {
            this.updatePopoverPosition();
        }
        this.margin = this.showToTop ? `0 0 ${this.popupMargin}px 0` : `${this.popupMargin}px 0 0 0`;
    }

    outsideClicked(event: any) {
        if (event) {
            event.preventDefault();
        }
        this.closePopup.emit();
    }

    private getPopupTotalHeight(): number {
        return this.container.containerClientRect?.height + this.popupMargin + this.popup?.nativeElement.offsetHeight;
    }

    private updatePopoverPosition() {
        this.changeDetectorRef.detectChanges();
        this.scrollHeight = this.popupElement.view ? this.popupElement.view.nativeElement.scrollTop : 0;
        this.showToTop = (this.container.containerClientRect?.y + this.getPopupTotalHeight()) > window.innerHeight;
        this.rightPos = this.container.containerClientRect?.x + this.popup?.nativeElement.offsetWidth > window.innerWidth;
        if (this.showToTop) {
            this.bottom = this.scrollHeight ?
                this.background.nativeElement.offsetHeight - (this.container.top - this.scrollHeight) :
                this.background.nativeElement.offsetHeight - this.container.top;
        } else {
            const containerBottom: number = this.container.top + this.container.height;
            this.top = this.scrollHeight ? containerBottom - this.scrollHeight : containerBottom;
        }
    }

}
