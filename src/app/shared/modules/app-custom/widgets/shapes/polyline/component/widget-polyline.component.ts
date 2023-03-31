import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { ChangeDetectorRef, Component, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { WidgetComponentInterface } from '../../../../../app/interfaces';
import { PolylineDrawService } from '../../services/polyline-draw.service';
@Component({
    selector: 'widget-polyline',
    templateUrl: './widget-polyline.component.html',
    styleUrls: ['widget-polyline.component.scss'],
})
export class WidgetPolylineComponent implements WidgetComponentInterface {
    points = [];
    widget: SnPageWidgetDto;
    snApp: SnAppDto;

    constructor(private polylineDrawService: PolylineDrawService, private ref: ChangeDetectorRef) {}

    initialize(): void {

        if (this.widget) {
            let path = this.widget.custom.d;
            if (this.widget?.custom.d.includes('Z')) {
                path = path.split('Z')[0];
            }

            if (this.widget?.custom.d.includes('z')) {
                path = path.split('z')[0];
            }
            this.points = path.split('M')[1].split('L').map(p => ({ cx: p.split(',')[0], cy: p.split(',')[1] }));
        }

        this.ref.detectChanges();
        this.calculate();
    }

    calculate() {
        this.polylineDrawService.initializeEdit(this.snApp);
    }
}
