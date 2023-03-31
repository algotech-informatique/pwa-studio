import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppSettings } from '../../../../app/dto';
import { AppActionsService, AppSelectionService, PageDragService, PageWidgetService } from '../../../../app/services';
import { UITree } from '../models/ui-tree';
import * as d3 from 'd3';
@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ui-tree-shared-widget',
    templateUrl: './ui-tree-shared-widget.component.html',
    styleUrls: ['ui-tree-shared-widget.component.scss'],
})
export class UITreeWidgetSharedComponent implements OnChanges, OnDestroy, AfterViewInit {

    @Input() snApp: SnAppDto;
    @Input() item: UITree;
    @Input() settings: AppSettings;
    @Input() canSelectItem = true;
    name: string;
    icon: string;
    subscription: Subscription;

    constructor(
        public appSelection: AppSelectionService,
        private appActions: AppActionsService,
        private pageDrag: PageDragService
    ) {

    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        if (this.snApp) {
            this.subscription = this.appActions.onRenameShared(this.snApp).subscribe((data) => {
                this.item.editMode = (this.item.element as SnPageWidgetDto).sharedId != null &&
                    (this.item.element as SnPageWidgetDto).sharedId === data.sharedId;
            });
        }
    }

    ngOnChanges() {
        if (this.item.element) {
            this.name = (this.item.element as SnPageWidgetDto).name;
            try {
                this.icon = PageWidgetService.getType(this.item.element as SnPageWidgetDto)?.icon;
            } catch {
                this.icon = 'fa-solid fa-genderless';
            }
        }
    }

    handleEditing($ev) {
        this.item.editMode = $ev.editionMode;
    }

    onWidgetSelected($event) {
        if (this.canSelectItem) {
            this.appSelection.select($event, this.snApp, {
                element: this.item.element, type: 'sharedWidget',
                ignoreUnselect: $event instanceof DragEvent || $event.button
            });
        }
    }

    onToggleLine(open: boolean) {
        this.item.open = open;
    }

    onNameChanged(name: string) {
        (this.item.element as SnPageWidgetDto).name = name;
        this.appActions.notifyUpdate(this.snApp);
    }

}
