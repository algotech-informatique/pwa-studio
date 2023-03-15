import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Component, EventEmitter, Output } from '@angular/core';
import { WidgetParametersInterface } from '../../../models/widget-parameters.interface';

@Component({
    selector: 'header-widget-parameters',
    templateUrl: './header-widget-parameters.component.html',
    styleUrls: ['./header-widget-parameters.component.scss'],
})
export class HeaderWidgetParametersComponent implements WidgetParametersInterface {

    changed = new EventEmitter();

    widget: SnPageWidgetDto;

    snApp: SnAppDto;

    initialize() {
    }

    onHideRevealEffectChanged(hideRevealEffect: boolean) {
        this.widget.custom.hideRevealEffect = hideRevealEffect;
        this.changed.emit();
    }

}
