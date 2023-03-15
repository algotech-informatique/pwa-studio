import { Component, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { SnContextmenuAction } from '../../../modules/smart-nodes';


@Component({
    selector: 'app-data-base-context-menu',
    templateUrl: './context-menu.component.html',
    styleUrls: ['./context-menu.component.scss']
})

export class AppDataBaseContextMenuComponent {
    @Input() id: string;
    @Input() dismiss: Subject<any>;
    @Input() actions: SnContextmenuAction[];
    constructor() { }

    click(action) {
        action.onClick(this.id);
        if (this.dismiss) {
            this.dismiss.next(null);
        }
    }

    unselectActions() {
        this.actions = this.actions.map((action: SnContextmenuAction) => {
            action.selected = false;
            return action;
        });
    }

    hover(selectedAction: SnContextmenuAction) {
        this.unselectActions();
        if (!selectedAction.disabled) {
            selectedAction.selected = true;
        }
    }
}
