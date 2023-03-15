import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ListItem } from '../../dto/list-item.dto';

@Component({
    selector: 'sn-display-radio',
    templateUrl: './display-radio-element.component.html',
    styleUrls: ['./display-radio-element.component.scss'],
})
export class DisplayRadioElementComponent {

    @Input() title: string;
    @Input() subTitle: string;
    @Input() radioList: ListItem[] = [];
    @Input() mode: 'radio' | 'checkbox' = 'checkbox';
    @Input() selected: string[];
    @Input() hideOverflow: true;
    @Output() changed = new EventEmitter<string>();

    onElementClick(radioElement: ListItem) {
        if (this.mode === 'checkbox') {
            this.checkboxSelection(radioElement);
        } else {
            this.radioSelection(radioElement);
        }
        this.changed.emit(radioElement.key);
    }

    private checkboxSelection(radioElement: ListItem) {
        const selectedIndex = this.selected.indexOf(radioElement.key);
        if (selectedIndex > -1) {
            this.selected.splice(selectedIndex, 1);
        } else {
            this.selected.push(radioElement.key);
        }
        this.selected = [...this.selected];
    }

    private radioSelection(radioElement: ListItem) {
        this.selected = [radioElement.key];
    }

}
