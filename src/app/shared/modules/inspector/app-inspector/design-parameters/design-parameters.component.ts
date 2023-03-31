import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import {
    Component, EventEmitter, Input, Output,
} from '@angular/core';
import { PageWidgetService } from '../../../app/services';
@Component({
    selector: 'design-parameters',
    templateUrl: './design-parameters.component.html',
})
export class DesignParametersComponent {
    @Input() snApp: SnAppDto;
    @Input() page: SnPageDto;
    @Input() widget: SnPageWidgetDto;
    @Output() changed = new EventEmitter();

    constructor(
        private widgetsService: PageWidgetService,
    ) {}

    onChanged() {
        this.widgetsService.updateRule(this.widget);
        this.changed.emit();
    }
}
