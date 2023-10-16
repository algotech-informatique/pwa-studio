import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import moment from 'moment';
import { IconsService } from '../../../../../services';
import { WidgetInput } from '../../../../app-custom/dto/widget-input.dto';
import { InputItem } from '../../../dto/input-item.dto';

@Component({
    selector: 'primitive-input',
    templateUrl: './primitive-input.component.html',
    styleUrls: ['./primitive-input.component.scss'],
})
export class PrimitiveInputComponent implements OnInit, OnChanges {

    @Input() input: InputItem;
    @Input() inputType: string;
    @Input() dataItems: WidgetInput[];
    @Input() dataSelectorShowed: boolean;
    @Output() dataSelector = new EventEmitter();
    @Output() inputChanged = new EventEmitter<any>();
    icon: string;
    valueIsPath = false;
    value = false;
    dateFormat: string[] = null;

    constructor(
        private iconsService: IconsService,
    ) { }

    ngOnInit() {
        this.icon = this.iconsService.getIconByType(this.input.types[0])?.value;
    }

    ngOnChanges() {
        this.value = (this.inputType === 'checkbox') ? Boolean(this.input.value) : false;
        this.valueIsPath = ('' + this.input.value).startsWith('{{') && this.input.value?.endsWith('}}');
        this.assignDateFormat();
    }

    onInputChanged(value: any) {
        if (this.inputType === 'number') {
            this.input.value = +value || 0;
        } else if (this.inputType === 'date') {
            this.input.value = moment(value).isValid() ? moment(value).utc(true).startOf('day').format() : null;
        } else if (this.inputType === 'datetime-local') {
            this.input.value = moment(value).isValid() ? moment(value).format() : null;
        } else if (this.inputType === 'time') {
            this.input.value = moment(value, 'HH:mm').isValid() ? moment(value, 'HH:mm').format('HH:mm:ss') : null;
        } else {
            this.input.value = value;
        }
        this.inputChanged.emit(this.input.value);
    }

    onCheck() {
        this.value = !this.value;
        this.input.value = this.value;
        this.onInputChanged(this.input.value);
    }
    openDataSelector(event: any) {
        event.stopPropagation();
        this.dataSelector.emit();
    }

    assignDateFormat() {
        if (!this.valueIsPath) {
            switch (this.inputType) {
                case 'date':
                    this.dateFormat = ['YYYY-MM-DD', null];
                    break;
                case 'datetime-local':
                    this.dateFormat = ['YYYY-MM-DDTHH:mm', null];
                    break;
                case 'time':
                    this.dateFormat = ['HH:mm:ss', 'HH:mm:ss'];
                    break;
                default:
                    this.dateFormat = null;
                    break;
            }
        } else {
            this.dateFormat = null;
        }
    }

    resetInput() {
        this.valueIsPath = false;
        this.assignDateFormat();
        switch (this.inputType) {
            case 'text':
                this.input.value = '';
                break;
            case 'number':
                this.input.value = 0;
                break;
            case 'checkbox':
                this.value = false;
                this.input.value = false;
                break;
            default:
                this.input.value = null;
                break;
        }
        this.inputChanged.emit(this.input.value);
    }

}
