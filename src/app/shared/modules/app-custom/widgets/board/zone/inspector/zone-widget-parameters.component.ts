import { KeyFormaterService } from '@algotech/angular';
import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { PageUtilsService } from '../../../../../app/services';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';

@Component({
    selector: 'zone-widget-parameters',
    templateUrl: './zone-widget-parameters.component.html',
    styleUrls: ['./zone-widget-parameters.component.scss']
})

export class ZoneWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    snApp: SnAppDto;
    widget: SnPageWidgetDto;
    error = false;

    key = '';

    constructor(
        private pageUtils: PageUtilsService,
        private keyFormaterService: KeyFormaterService,
    ) { }

    initialize() {
        this.key = this.widget.custom.key;
        this.error = this.hasError();
    }

    onKeyChanged() {
        this.error = this.hasError();
        if (!this.error) {
            this.widget.custom.key = this.keyFormaterService.format(this.key).toLowerCase();
            this.changed.emit();
        }
    }

    onKeyChanging() {
        this.onKeyChanged();
    }

    onOverlayChanged(overlay: boolean) {
        this.widget.custom.overlay = overlay;
        this.changed.emit();
    }

    onGridChanged(displayGrid: boolean) {
        this.widget.custom.grid = displayGrid ? { width: 50, height: 50 } : null;
        this.changed.emit();
    }

    onGridWidthChanged(width: number) {
        this.widget.custom.grid.width = width;
        this.changed.emit();
    }

    onGridHeightChanged(height: number) {
        this.widget.custom.grid.height = height;
        this.changed.emit();
    }

    private hasError() {
        if (!this.widget) { return false; }
        const widgets = this.pageUtils.getWidgets(this.snApp).filter((w) =>
            w.typeKey === 'zone' && w !== this.widget && w.custom.key === this.keyFormaterService.format(this.key).toLowerCase()
        );
        return widgets ? !!(widgets.length > 0) || this.key === '' : this.key === '';
    }

}
