import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
    selector: 'design-position-parameters',
    templateUrl: './design-position-parameters.component.html',
    styleUrls: ['./design-position-parameters.component.scss'],
})
export class DesignPositionParametersComponent implements OnChanges {

    @Input() snApp: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() positionChanged = new EventEmitter();
    constrainRatio: { height?: number; width?: number; active: boolean} = { active: false };

    ngOnChanges() {
        this.constrainRatio.active = false;
    }

    onPosXChanged(x: number) {
        if (!this.widget) { return; }
        this.widget.box.x = x;
        this.positionChanged.emit();
    }

    onPosYChanged(y: number) {
        if (!this.widget) { return; }
        this.widget.box.y = y;
        this.positionChanged.emit();
    }

    onPageWidthChanged(width: number) {
        if (this.widget) { return; }
        this.page.pageWidth = width;
        this.positionChanged.emit();
    }

    onWidgetWidthChanged(width: number) {
        if (!this.widget) { return; }
        this.widget.box.width = width;
        if (this.constrainRatio.active) {
            this.widget.box.height = Math.round(this.constrainRatio.height * this.widget.box.width);
        }
        this.positionChanged.emit();
    }

    onPageHeightChanged(height: number) {
        if (this.widget) { return; }
        this.page.pageHeight = height;
        this.positionChanged.emit();
    }

    onWidgetHeightChanged(height: number) {
        if (!this.widget) { return; }
        this.widget.box.height = height;
        if (this.constrainRatio.active) {
            this.widget.box.width = Math.round(this.constrainRatio.width * this.widget.box.height);
        }
        this.positionChanged.emit();
    }

    onConstrainSize() {
        if (!this.widget) { return; }
        this.constrainRatio.active = !this.constrainRatio.active;
        if (this.constrainRatio.active) {
            this.constrainRatio.width = this.widget.box.width / this.widget.box.height;
            this.constrainRatio.height = this.widget.box.height / this.widget.box.width;
        }
    }

    onHiddenChanged(event: boolean) {
        this.widget.custom.hidden = event;
        this.positionChanged.emit();
    }
}
