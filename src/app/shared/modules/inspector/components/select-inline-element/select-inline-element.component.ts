import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ListItem } from '../../dto/list-item.dto';

@Component({
  selector: 'select-inline-element',
  templateUrl: './select-inline-element.component.html',
  styleUrls: ['./select-inline-element.component.scss'],
})
export class SelectInlineElementComponent {

    @Input() title: string;
    @Input() items: ListItem[];
    @Input() selectedKeys: string[] = [];
    @Input() withImages = false;
    @Input() iconRotation = 0;
    @Output() selectItem = new EventEmitter<string>();

    onItemClicked(key: string) {
        this.selectItem.emit(key);
    }

}
