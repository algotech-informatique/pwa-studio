import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ListItem } from '../../../../dto/list-item.dto';

@Component({
  selector: 'design-style-text-parameters',
  templateUrl: './design-style-text-parameters.component.html',
  styleUrls: ['./design-style-text-parameters.component.scss'],
})
export class DesignStyleTextParametersComponent implements OnChanges {

    @Input() defaultValue: any;
    @Input() insideSection = false;
    @Output() changed = new EventEmitter();

    styleElements: ListItem[];
    alignmentElements: ListItem[];
    layoutElements: ListItem[];
    styleSelectedKeys: string[] = [];
    alignmentSelectedKeys: string[] = [];
    layoutSelectedKeys: string[] = [];

    constructor() {}

    ngOnChanges() {
        this.initStyleElements();
        this.initAlignmentElements();
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
        if (propName === 'justify-content') {
            switch (value) {
                case 'flex-start':
                    this.onChanged('text-align', 'left');
                    break;
                case 'center':
                    this.onChanged('text-align', 'center');
                    break;
                case 'flex-end':
                    this.onChanged('text-align', 'right');
                    break;
            }
            this.alignmentSelectedKeys = [this.defaultValue['justify-content']];
        }
        this.changed.emit({ path: propName, value });
    }

    onSizeChanged(value: number) {
        this.defaultValue['font-size'] = `${value}px`;
        this.changed.emit({
            path: 'font-size',
            value: this.defaultValue['font-size']
        });
    }

    onMarginPaddingChanged(value: any) {
        this.changed.emit(value);
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

    private initStyleElements() {
        this.styleElements = [
            { key: 'font-weight', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.BOLD', icon: 'fa-solid fa-bold' },
            { key: 'font-style', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.ITALIC', icon: 'fa-solid fa-italic' },
            { key: 'text-decoration', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.STYLE.UNDERLINE', icon: 'fa-solid fa-underline' },
        ];
        this.updateStyleSelectedKeys();
    }

    private initAlignmentElements() {
        this.alignmentElements = [
            { key: 'flex-start', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.ALIGNMENT.LEFT', icon: 'fa-solid fa-align-left' },
            { key: 'center', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.ALIGNMENT.CENTER', icon: 'fa-solid fa-align-center' },
            { key: 'flex-end', value: 'INSPECTOR.APP.TAB.DESIGN.TEXT.ALIGNMENT.RIGHT', icon: 'fa-solid fa-align-right' },
        ];
        this.alignmentSelectedKeys = [this.defaultValue['justify-content']];
    }

}
