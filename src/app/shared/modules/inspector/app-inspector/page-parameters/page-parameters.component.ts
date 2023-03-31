import { LangDto, SnAppDto, SnPageDto, SnPageEventDto } from '@algotech-ce/core';
import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { AppCustomService } from '../../../app-custom/services';
import { PageZoom } from '../../dto/page-zoom.dto';

@Component({
    selector: 'page-parameters',
    templateUrl: './page-parameters.component.html',
    styleUrls: ['./page-parameters.component.scss'],
})
export class PageParametersComponent implements OnChanges {

    @Input() snApp: SnAppDto;
    @Input() page: SnPageDto;
    @Output() changed = new EventEmitter();
    @Output() changedMain = new EventEmitter<SnPageDto>();
    dataSourceEv: SnPageEventDto;

    constructor(
        private appCustom: AppCustomService,
    ) { }

    ngOnChanges() {
        this.dataSourceEv = this.appCustom.getDataSourcesEvent(this.page);
    }

    onChanged() {
        this.changed.emit();
    }

    onMainChanged(value: boolean) {
        this.page.main = value;
        this.changedMain.emit(this.page);
    }

    onDisplayTranslateChanged(data: LangDto[]) {
        this.page.displayName = data;
        this.changed.emit();
    }

    onZoomChanged(zoom: PageZoom) {
        if (this.page.custom) {
            this.page.custom.zoom = zoom;
        } else {
            this.page.custom = {
                zoom,
            };
        }
        this.changed.emit();
    }

    onDataSourceChanged(event: SnPageEventDto) {
        this.page.dataSources = event.pipe;
        this.changed.emit();
    }

    onEventsChanged(events: SnPageEventDto[]) {
        this.page.events = events;
        this.changed.emit();
    }

}
