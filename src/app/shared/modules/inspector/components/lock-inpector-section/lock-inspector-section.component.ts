import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../../services';
import { AppSelectionService, AppSelectorService, PageWidgetService } from '../../../app/services';

@Component({
    selector: 'lock-inspector-section',
    templateUrl: './lock-inspector-section.component.html',
    styleUrls: ['./lock-inspector-section.component.scss'],
})
export class LockInspectorSectionComponent {

    @Input() showLock = false;
    @Input() section: string;
    @Input() locked = false;
    @Output() lockChange = new EventEmitter<{ section: string; locked: boolean }>();

    change(data) {
        this.locked = data;
        this.lockChange.emit({ section: this.section, locked: this.locked });
    }
}
