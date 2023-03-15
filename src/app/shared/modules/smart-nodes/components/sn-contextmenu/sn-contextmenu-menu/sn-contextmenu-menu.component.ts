import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SnContextmenu, SnContextmenuAction } from '../../../dto';

@Component({
    selector: 'sn-contextmenu-menu',
    templateUrl: './sn-contextmenu-menu.component.html',
    styleUrls: ['./sn-contextmenu-menu.component.scss'],
})
export class SnContextmenuMenuComponent implements OnChanges {

    @Input() menu: SnContextmenu;
    @Output() actionClicked = new EventEmitter<SnContextmenuAction>();
    @Output() actionSelected = new EventEmitter<SnContextmenuAction>();
    @Output() subMenuSelected = new EventEmitter<{ menu: SnContextmenu, parentId: string }>();

    actions: SnContextmenuAction[];

    ngOnChanges() {
        this.actions = _.flatten(this.menu.subMenus);
        this.unselectActions();
    }

    unselectActions() {
        this.actions = _.map(this.actions, (action: SnContextmenuAction) => {
            action.selected = false;
            return action;
        });
    }

    hover(selectedAction: SnContextmenuAction) {
        this.unselectActions();
        if (!selectedAction.disabled) {
            selectedAction.selected = true;
        }

        if (selectedAction.subActions) {
            this.subMenuSelected.emit({ menu: selectedAction.subActions, parentId: selectedAction.id });
        } else {
            this.actionSelected.emit(selectedAction);
        }
    }

    click($event, clickedAction: SnContextmenuAction) {
        $event.stopPropagation();
        if ((!clickedAction.subActions || clickedAction.subActions.subMenus.length === 0) && !clickedAction.disabled) {
            this.actionClicked.emit(clickedAction);
        }
    }

}
