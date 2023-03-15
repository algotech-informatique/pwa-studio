import { SnPageWidgetDto } from '@algotech/core';
import { Component, Input } from '@angular/core';
import { AppSelectionService, AppZoomService, PageUtilsService } from '../../services';

@Component({
    selector: 'app-resize',
    templateUrl: 'app-resize.component.html',
    styleUrls: ['app-resize.component.scss'],
})
export class AppResizeComponent {

    @Input() widget: SnPageWidgetDto;
    @Input() id: string;

    constructor(
        public appZoom: AppZoomService,
        public appSelection: AppSelectionService,
        public pageUtils: PageUtilsService) {}
}
