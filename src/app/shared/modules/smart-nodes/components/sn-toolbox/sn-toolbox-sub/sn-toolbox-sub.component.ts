import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { SnToolbox } from '../../../dto';

@Component({
    selector: 'sn-toolbox-sub',
    styleUrls: ['./sn-toolbox-sub.component.scss'],
    templateUrl: './sn-toolbox-sub.component.html',
}) export class SnToolboxSubComponent implements OnChanges {

    @Input() tools: SnToolbox[] = [];
    @Input() displayVisible = false;
    @Input() direction: string;
    @Output() launchEvent = new EventEmitter;

    hover = false;
    subItemsVisible = '';

    constructor() {
    }

    ngOnChanges() {
        this.subItemsVisible = '';
    }

    onItemEnter($event, tool) {
        this.hover = true;
        if (tool.subItems) {
            this.subItemsVisible = tool.id;
        } else {
            this.subItemsVisible = '';
        }
        $event.stopPropagation();
    }

    onItemLeave() {
        this.hover = false;
        setTimeout(() => {
            if (!this.hover) {
                this.subItemsVisible = '';
            }
        }, 100);
    }

    onItemClick($event, tool: SnToolbox) {
        if (tool.subItems) {
            if (tool.id === this.subItemsVisible) {
                this.subItemsVisible = '';
            } else {
                this.subItemsVisible = tool.id;
            }
        } else {

            if (!this.hideTool(tool)) {
                this.hover = false;
                this.subItemsVisible = '';
            }
            this.onLaunchEvent(tool);
        }
        $event.stopPropagation();
    }

    hideTool(tool: SnToolbox): boolean {
        if (tool.item) {
            return (tool.item.noHideOnClick);
        }
        return false;
    }

    onLaunchEvent(subtool: SnToolbox) {
        if (!this.hideTool(subtool)) {
            this.subItemsVisible = '';
        }
        this.launchEvent.emit(subtool);
    }

    onDeleteClick($event, tool: SnToolbox) {
        $event.stopPropagation();
        this.hover = false;
        this.subItemsVisible = '';
        tool.item.onDelete();
    }
}
