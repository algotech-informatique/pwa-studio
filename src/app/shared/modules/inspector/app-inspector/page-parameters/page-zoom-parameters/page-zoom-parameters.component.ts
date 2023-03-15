import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PageZoom } from '../../../dto/page-zoom.dto';

@Component({
    selector: 'page-zoom-parameters',
    templateUrl: './page-zoom-parameters.component.html',
    styleUrls: ['./page-zoom-parameters.component.scss'],
})
export class PageZoomParametersComponent {

    @Input() zoom: PageZoom;
    @Output() changed = new EventEmitter<PageZoom>();

    onZoomMinChanged(min: number) {
        this.zoom.min = min;
        this.changed.emit(this.zoom);
    }

    onZoomMaxChanged(max: number) {
        this.zoom.max = max;
        this.changed.emit(this.zoom);
    }

    onZoomScaleChanged(scale: number) {
        this.zoom.scale = scale;
        this.changed.emit(this.zoom);
    }

    onZoomAutoChanged(activeZoom: boolean) {
        this.zoom = activeZoom ? { min: 0.1, max: 10, scale: 0.7, auto: true } : null;
        this.changed.emit(this.zoom);
    }

    onZoomScaleAutoChanged(zoomScaleAuto: boolean) {
        this.zoom.auto = zoomScaleAuto;
        this.changed.emit(this.zoom);
    }

}
