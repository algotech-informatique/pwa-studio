import { Component, EventEmitter, Input, Output, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { themeColorsList } from './theme-colors';

@Component({
    selector: 'color-element',
    templateUrl: './color-element.component.html',
    styleUrls: ['./color-element.component.scss'],
})
export class ColorElementComponent implements AfterViewInit, OnChanges {

    @ViewChild('container') container: ElementRef;
    @Input() color: string;
    @Input() outputFormat = 'hex';
    @Input() showApptheme = false;
    @Input() title = 'INSPECTOR.SMART_FLOW.PROPERTIES_COLOR';
    @Output() changed = new EventEmitter();

    top: number;
    showColorPicker = false;
    colorContainer: PopupContainerDto;
    popupMargin = 3;
    themeColors: {
        display: string;
        colors: { hint: string; color: string }[];
    }[];
    realColor: string;
    plainColor: string;

    constructor(
        public translate: TranslateService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
        this.themeColors = themeColorsList;
    }

    ngOnChanges() {
        this.updateAllColors();
    }

    ngAfterViewInit() {
        this.updateAllColors();
    }

    colorPopUp(event: any) {
        event.stopPropagation();
        this.colorContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.changeDetectorRef.detectChanges();
        this.showColorPicker = !this.showColorPicker;
    }

    onColorChange(event: string) {
        this.changed.emit(event);
    }

    private updateAllColors() {
        this.realColor = _.isString(this.color) && this.color?.startsWith('var') && this.container ?
            getComputedStyle(this.container.nativeElement).getPropertyValue(this.color.split('(')[1].split(')')?.[0]) :
            this.color;
        this.plainColor = this.realColor?.length === 9 ? this.realColor?.slice(0, -2) : this.realColor;
        if (this.realColor?.substr(7, 2)?.toLowerCase() === 'ff') {
            this.realColor = this.realColor.slice(0, -2);
        }
        this.changeDetectorRef.detectChanges();
    }

}
