import { PairDto } from '@algotech-ce/core';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { OptionsMultipleDto } from '../../../../dtos';
import { SnView } from '../../../../modules/smart-nodes';
import * as _ from 'lodash';

@Component({
    selector: 'scheduled-task-combined-list',
    templateUrl: './scheduled-task-combined-list.component.html',
    styleUrls: ['./scheduled-task-combined-list.component.scss'],
})
export class ScheduledTaskCombinedListComponent implements OnChanges {

    @Input() label: string;
    @Input() endLabel: string;
    @Input() items: PairDto[];
    @Input() selected = false;
    @Input() selectedItems: number[];
    @Input() popupTitle: string;
    @Output() listChanged = new EventEmitter();

    snView: SnView = null;
    listItems: OptionsMultipleDto[] = [];
    top = 0;
    showItems: string;

    constructor() { }

    ngOnChanges() {
        this.loadLists();
    }

    onOpenList(event) {
        if (this.selected) {
            this.top = event.srcElement.offsetTop;
        }
    }

    onListChange(event) {
        this.loadSelectedList(event);
        this.loadLists();
        this.listChanged.emit(this.selectedItems);
    }

    loadSelectedList(key) {
        const index = _.findIndex(this.selectedItems, (item) => item.toString() === key);
        if (index === -1) {
            this.selectedItems.push(key);
        } else {
            this.selectedItems.splice(index, 1);
        }
    }

    loadLists() {
        this.listItems = _.map(this.items, (item: PairDto) => {
            const index = _.findIndex(this.selectedItems, (selecItem) => (selecItem).toString() === item.key);
            const multiple: OptionsMultipleDto = {
                key: item.key,
                value: item.value,
                selected: (index !== -1)
            };
            return multiple;
        });
        const listShowItems: string[] = _.reduce(this.listItems, (result, item: OptionsMultipleDto) => {
            if (item.selected) {
                result.push(item.value);
            }
            return result;
        }, []);
        this.showItems = listShowItems.join(', ');
    }
}
