import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { ListItem } from '../../../../dto/list-item.dto';

@Component({
    selector: 'design-style-layout-parameters',
    templateUrl: './design-style-layout-parameters.component.html',
    styleUrls: ['./design-style-layout-parameters.component.scss']
})
export class DesignStyleLayoutParametersComponent implements OnChanges {

    @Input() layoutStyle: any;
    @Input() showDirection = true;
    @Input() showJustify = true;
    @Output() changed = new EventEmitter();
    directionList: ListItem[];
    justifyList: ListItem[];
    alignList: ListItem[];
    isColumnDirection = false;
    isReverse = false;
    justifyIconRotation = 0;
    alignIconRotation = 0;

    constructor() {
        this.directionList = [
            { key: 'row', value: 'INSPECTOR.APP.TAB.DESIGN.LAYOUT.DIRECTION.ROW', icon: 'fa-solid fa-arrow-right-long'},
            { key: 'column', value: 'INSPECTOR.APP.TAB.DESIGN.LAYOUT.DIRECTION.COLUMN', icon: 'fa-solid fa-arrow-down-long'},
            { key: 'row-reverse', value: 'INSPECTOR.APP.TAB.DESIGN.LAYOUT.DIRECTION.ROW-REVERSE', icon: 'fa-solid fa-arrow-left-long'},
            { key: 'column-reverse', value: 'INSPECTOR.APP.TAB.DESIGN.LAYOUT.DIRECTION.COLUMN-REVERSE', icon: 'fa-solid fa-arrow-up-long'}
        ];

        this.justifyList = [
            { key: 'flex-start', value: 'INSPECTOR.APP.TAB.DESIGN.START', icon: 'justify-start.svg'},
            { key: 'center', value: 'INSPECTOR.APP.TAB.DESIGN.CENTER', icon: 'justify-center.svg'},
            { key: 'flex-end', value: 'INSPECTOR.APP.TAB.DESIGN.END', icon: 'justify-end.svg'},
            { key: 'space-between', value: 'INSPECTOR.APP.TAB.DESIGN.BETWEEN', icon: 'justify-between.svg'},
            { key: 'space-around', value: 'INSPECTOR.APP.TAB.DESIGN.AROUND', icon: 'justify-around.svg'},
        ];

        this.alignList = [
            { key: 'flex-start', value: 'INSPECTOR.APP.TAB.DESIGN.START', icon: 'align-start.svg' },
            { key: 'center', value: 'INSPECTOR.APP.TAB.DESIGN.CENTER', icon: 'align-center.svg' },
            { key: 'flex-end', value: 'INSPECTOR.APP.TAB.DESIGN.END', icon: 'align-end.svg' },
        ];
    }

    ngOnChanges() {
        this.checkFlexDirection();
    }

    onChangedJustify(value: string) {
        this.layoutStyle['justify-content'] = value;
        this.changed.emit({ path: 'justify-content', value });
    }

    onChangedDirection(value: string) {
        if (value !== this.layoutStyle['flex-direction']) {
            this.layoutStyle['flex-direction'] = value;
            this.checkFlexDirection();
            this.changed.emit({ path: 'flex-direction', value });
        }
    }

    onChangedAlign(value: string) {
        this.layoutStyle['align-items'] = value;
        this.changed.emit({ path: 'align-items', value });
    }

    onMarginPaddingChanged(change: any) {
        this.changed.emit(change);
    }

    onChangedGap(gap: number) {
        this.layoutStyle.gap = gap + 'px';
        this.changed.emit({ path: 'gap', value: gap + 'px' });
    }

    private checkFlexDirection() {
        this.isColumnDirection = this.layoutStyle?.['flex-direction']?.startsWith('column');
        this.isReverse = this.layoutStyle?.['flex-direction']?.endsWith('-reverse');
        this.justifyIconRotation = this.isColumnDirection ?
            (this.isReverse ? 270 : 90) :
            (this.isReverse ? 180 : 0);
        this.alignIconRotation = this.isColumnDirection ? 270 : 0;
    }

}
