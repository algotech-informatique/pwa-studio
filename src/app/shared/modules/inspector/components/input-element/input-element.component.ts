import { InputItem } from '../../dto/input-item.dto';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, ChangeDetectorRef, OnInit } from '@angular/core';
import { WidgetInput } from '../../../app-custom/dto/widget-input.dto';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { DataSelectorResult } from '../../dto/data-selector-result.dto';

@Component({
  selector: 'input-element',
  templateUrl: './input-element.component.html',
  styleUrls: ['./input-element.component.scss'],
})
export class InputElementComponent implements OnInit {

    @ViewChild('container') container: ElementRef;
    @Input() title: string;
    @Input() subTitle: string;
    @Input() input: InputItem;
    @Input() dataItems: Observable<WidgetInput[]>;
    @Output() inputChanged = new EventEmitter<DataSelectorResult>();

    dataItemsContainer: PopupContainerDto;
    popupMargin = 3;
    showDataSelector = false;
    inputType: 'object' | 'text' | 'number' | 'date' | 'datetime-local' | 'time' | 'checkbox';

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        if (this.input.types?.length === 1) {
            switch (this.input.types[0]) {
                case 'string':
                    this.inputType = 'text';
                    break;
                case 'number':
                    this.inputType = 'number';
                    break;
                case 'date':
                    this.inputType = 'date';
                    break;
                case 'datetime':
                    this.inputType = 'datetime-local';
                    break;
                case 'time':
                    this.inputType = 'time';
                    break;
                case 'boolean':
                    this.inputType = 'checkbox';
                    break;
                default:
                    this.inputType = 'object';
            }
        } else {
            this.inputType = 'object';
        }
    }

    onSelectedData(data: DataSelectorResult) {
        if (data.path !== this.input.value) {
            this.input.value = data.path;
            this.inputChanged.emit(data);
        }
        this.closeDataSelector();
    }

    onInputChanged(value: string) {
        this.inputChanged.emit({path: value, type: this.input.types[0], multiple: this.input.multiple });
    }

    openDataSelector() {
        this.dataItemsContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.showDataSelector = !this.showDataSelector;
        this.changeDetectorRef.detectChanges();
    }

    closeDataSelector() {
        this.showDataSelector = false;
    }

}
