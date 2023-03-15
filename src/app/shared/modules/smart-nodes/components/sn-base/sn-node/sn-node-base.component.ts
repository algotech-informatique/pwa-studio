import {
    Component, Input, OnDestroy, EventEmitter, ChangeDetectorRef
} from '@angular/core';
import { SnNode, SnView } from '../../../models';
import { SN_BASE_METADATA } from './sn-node-base.metadata';
import {SnActionsService } from '../../../services';
import { SnNodeSchema, SnSectionClickEvent } from '../../../dto';
import { Subscription } from 'rxjs';
import { SnSettings } from '../../../dto/sn-settings';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnNodeBaseComponent implements OnDestroy {

    @Input()
    node: SnNode;

    @Input()
    snView: SnView;

    @Input()
    settings: SnSettings;

    protected subscription: Subscription;
    sectionClicked: EventEmitter<any> = new EventEmitter();

    constructor(protected snActions: SnActionsService, protected ref: ChangeDetectorRef) { }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    calculate() {
        this.ref.detectChanges();
    }

    initialize(schema: SnNodeSchema) {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = new Subscription();
    }

    onSectionClicked(section: SnSectionClickEvent) {
    }

}
