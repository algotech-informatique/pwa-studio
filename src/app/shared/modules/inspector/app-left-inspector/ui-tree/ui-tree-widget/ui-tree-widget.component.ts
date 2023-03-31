import { SnAppDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, Input, OnChanges } from '@angular/core';
import { AppSettings } from '../../../../app/dto';
import { AppActionsService, AppSelectionService, PageWidgetService } from '../../../../app/services';
import { UITree } from '../models/ui-tree';

@Component({
    selector: 'ui-tree-widget',
    templateUrl: './ui-tree-widget.component.html',
    styleUrls: ['ui-tree-widget.component.scss'],
})
export class UITreeWidgetComponent implements OnChanges {

    @Input() snApp: SnAppDto;
    @Input() item: UITree;
    @Input() settings: AppSettings;
    name: string;
    icon: string;

    constructor(
        public appSelection: AppSelectionService,
        private appActions: AppActionsService,
    ) { }

    ngOnChanges() {
        this.name = (this.item.element as SnPageWidgetDto).name;
        this.icon = PageWidgetService.getType(this.item.element as SnPageWidgetDto)?.icon ||
            ((this.item.element as SnPageWidgetDto).group ? 'fa-solid fa-object-group' : 'fa-solid fa-genderless');
    }

    onWidgetSelected($event) {
        this.appSelection.select($event, this.snApp, { element: this.item.element, type: 'widget',
            ignoreUnselect: $event instanceof DragEvent || $event.button });
    }

    onToggleLine(open: boolean) {
        this.item.open = open;
    }

    onNameChanged(name: string) {
        (this.item.element as SnPageWidgetDto).name = name;
        this.appActions.notifyUpdate(this.snApp);
    }

    onLockClick(event: any) {
        event.stopPropagation();
        this.item.element.custom.locked = !this.item.element.custom.locked;
        this.appActions.notifyUpdate(this.snApp);
    }

    onEyeClick(event: any) {
        event.stopPropagation();
        this.item.element.custom.hidden = !this.item.element.custom.hidden;
        this.appActions.notifyUpdate(this.snApp);
    }

}
