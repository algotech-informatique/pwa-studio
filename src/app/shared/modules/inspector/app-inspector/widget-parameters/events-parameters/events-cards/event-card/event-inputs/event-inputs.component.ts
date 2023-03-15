import { InputItem } from '../../../../../../dto/input-item.dto';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { WidgetInput } from '../../../../../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import { DataSelectorResult } from 'src/app/shared/modules/inspector/dto/data-selector-result.dto';

@Component({
  selector: 'event-inputs',
  templateUrl: './event-inputs.component.html',
  styleUrls: ['./event-inputs.component.scss'],
})
export class EventInputsComponent {

    @Input() data: Observable<WidgetInput[]>;
    @Input() inputs: InputItem[];
    @Output() inputsChanged = new EventEmitter<InputItem[]>();

    onEventInputChanged(input: DataSelectorResult, index: number) {
        this.inputs[index].value = input.path;
        this.inputsChanged.emit(this.inputs);
    }

}
