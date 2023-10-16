import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SnSearchDto } from '../../../../dtos';
import { SnSettings } from '../../dto/sn-settings';
import { SnView } from '../../models';

@Component({
    selector: 'sn-main-layout',
    template: `
        <sn-dark-layout *ngIf="settings && (!settings.theme || settings.theme === 'dark')"
            [settings]="settings"
            [snView]="snView"
            [search]="search"
            (selected)="onSelected($event)"
            (changed)="onChanged($event)">
        </sn-dark-layout>

        <sn-light-layout *ngIf="settings && settings.theme === 'light'"
            [settings]="settings"
            [snView]="snView"
            [search]="search"
            (selected)="onSelected($event)"
            (changed)="onChanged($event)">
        </sn-light-layout>
    `,
})
export class SnMainLayoutComponent {

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
