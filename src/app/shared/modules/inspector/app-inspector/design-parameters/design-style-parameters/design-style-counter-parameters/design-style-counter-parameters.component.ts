import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ListItem } from '../../../../dto/list-item.dto';

interface PositionInterface {
    position: string;
    value: any;
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'design-style-counter-parameters',
  templateUrl: './design-style-counter-parameters.component.html',
  styleUrls: ['./design-style-counter-parameters.component.scss'],
})
export class DesignStyleCounterParametersComponent implements OnChanges {

    @Input() defaultValue: any;
    @Output() changed = new EventEmitter();
    @Output() deleteItem = new EventEmitter();
    styleElements: ListItem[];
    styleSelectedKeys: string[] = [];
    absolutePosition: PositionInterface[] = [];

    constructor() {}

    ngOnChanges() {
        this.initAbsolutePosition();
        this.initStyleElements();
    }

    onStyleChanged(propName: string) {
        let value: string;
        switch (propName) {
            case 'font-weight':
                value = this.defaultValue['font-weight'] === 'bold' ? 'normal' : 'bold';
                break;
            case 'font-style':
                value = this.defaultValue['font-style'] === 'italic' ? 'normal' : 'italic';
                break;
            case 'text-decoration':
                value = this.defaultValue['text-decoration'] === 'underline' ? 'none' : 'underline';
                break;
        }
        this.defaultValue[propName] = value;
        this.updateStyleSelectedKeys();
        this.changed.emit({ path: propName, value });
    }

    onChanged(propName: string, value: any) {
        this.defaultValue[propName] = value;
        this.changed.emit({ path: propName, value });
    }

    onSizeChanged(value: number) {
        this.defaultValue['font-size'] = `${value}px`;
        this.changed.emit({
            path: 'font-size',
            value: this.defaultValue['font-size']
        });
    }

    onColorChanged(value: string) {
        this.defaultValue.color = value;
        this.changed.emit({
            path: 'color',
            value: this.defaultValue.color,
        });
    }

    onBackColorChanged(value: string) {
        this.defaultValue['background-color'] = value;
        this.changed.emit({
            path: 'background-color',
            value: this.defaultValue['background-color'],
        });
    }

    onChangedRadius(value: string) {
        this.defaultValue['border-radius'] = value;
        this.changed.emit({
            path: 'border-radius',
            value: this.defaultValue['border-radius'],
        });
    }

    onSizeCounterChanged(value: string, type: string) {
        this.defaultValue[type]=value;
        this.changed.emit({
            path: type,
            value: this.defaultValue[type],
        });
    }

    onPaddingChanged(value: string) {
        this.defaultValue.margin = value;
        this.changed.emit({
            path: 'margin',
            value: this.defaultValue.margin,
        });
    }

    onChangedAbsPosition(value: string) {
        if (this.defaultValue[value]) {
            this.deleteItem.emit(value);
        } else {
            this.onChangedAbsPositionValue({value: '0', type: value});
            this.initAbsolutePosition();
        }
    }
    onChangedAbsPositionValue(update: {value: any; type: string}) {
        this.defaultValue[update.type] = `${update.value}px`;
        this.changed.emit({
            path: update.type,
            value: this.defaultValue[update.type],
        });
    }

    private updateStyleSelectedKeys() {
        this.styleSelectedKeys = [];
        if (this.defaultValue['font-weight'] === 'bold') {
            this.styleSelectedKeys.push('font-weight');
        }
        if (this.defaultValue['font-style'] === 'italic') {
            this.styleSelectedKeys.push('font-style');
        }
        if (this.defaultValue['text-decoration'] === 'underline') {
            this.styleSelectedKeys.push('text-decoration');
        }
    }

    private initAbsolutePosition() {
        this.absolutePosition = [];
        if (this.defaultValue.top) {
            this.absolutePosition.push({position: 'top', value: this.defaultValue.top});
        }
        if (this.defaultValue.bottom) {
            this.absolutePosition.push({position: 'bottom', value: this.defaultValue.bottom});
        }
        if (this.defaultValue.left) {
            this.absolutePosition.push({position: 'left', value: this.defaultValue.left});
        }
        if (this.defaultValue.right) {
            this.absolutePosition.push({position: 'right', value: this.defaultValue.right});
        }
    }

    private initStyleElements() {
        this.styleElements = [
            { key: 'font-weight', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.BOLD', icon: 'fa-solid fa-bold' },
            { key: 'font-style', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.ITALIC', icon: 'fa-solid fa-italic' },
            { key: 'text-decoration', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.UNDERLINE', icon: 'fa-solid fa-underline' },
        ];
        this.updateStyleSelectedKeys();
    }
}
