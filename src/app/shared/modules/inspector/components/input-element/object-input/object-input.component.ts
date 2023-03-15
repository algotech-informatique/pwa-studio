import { InputItem } from '../../../dto/input-item.dto';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'object-input',
  templateUrl: './object-input.component.html',
  styleUrls: ['./object-input.component.scss'],
})
export class ObjectInputComponent {

    @Input() input: InputItem;
    @Input() dataSelectorShowed: boolean;
    @Output() dataSelector = new EventEmitter();

    openDataSelector(event: any) {
        event.stopPropagation();
        this.dataSelector.emit();
    }

}
