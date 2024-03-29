import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SnSearchDto } from '../../../../../dtos';
import { SnSettings } from '../../../dto/sn-settings';
import { SnView } from '../../../models';

@Component({
    selector: 'sn-light-layout',
    template: `
        <sn-layout
            [settings]="settings"
            [snView]="snView"
            [search]="search"
            (selected)="onSelected($event)"
            (changed)="onChanged($event)">
        </sn-layout>
    `,
    styleUrls: ['../sn-layout.component.scss', '../../../theme/_variables.scss', '../../../theme/_light.scss'],
})
export class SnLightLayoutComponent {

    @Input()
    settings: SnSettings;

    @Input()
    snView: SnView;

    @Input()
    search: SnSearchDto;

    @Output()
    changed = new EventEmitter();

    @Output()
    selected = new EventEmitter();

    onChanged($event) {
        this.changed.emit($event);
    }

    onSelected($event) {
        this.selected.emit($event);
    }
}
