import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SnSettings } from '../../../dto/sn-settings';
import { SnView } from '../../../models';

@Component({
    selector: 'sn-dark-layout',
    template: `
        <sn-layout
            [settings]="settings"
            [snView]="snView"
            (selected)="onSelected($event)"
            (changed)="onChanged($event)">
        </sn-layout>
    `,
    styleUrls: ['../sn-layout.component.scss', '../../../theme/_variables.scss', '../../../theme/_dark.scss'],
})
export class SnDarkLayoutComponent {

    @Input()
    settings: SnSettings;

    @Input()
    snView: SnView;

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
