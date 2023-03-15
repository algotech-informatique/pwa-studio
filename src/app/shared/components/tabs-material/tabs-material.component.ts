import { Component, Input, ContentChildren, AfterContentInit, QueryList, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormTabContentDirective } from '@algotech/angular';
import * as _ from 'lodash';

@Component({
    selector: 'app-tabs-material',
    templateUrl: './tabs-material.component.html',
    styleUrls: ['./tabs-material.component.scss']
})
export class TabsMaterialComponent implements AfterContentInit, OnChanges {

    @Input() tabs: { key: string; name: string; visible: boolean; disabled?: boolean }[];
    @Output() closeTab = new EventEmitter();
    @ContentChildren(FormTabContentDirective) containers: QueryList<FormTabContentDirective>;

    _selectedKey = '';
    @Input()
    get selectedKey() {
        return this._selectedKey;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Output() selectedKeyChange = new EventEmitter();
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set selectedKey(key: string) {
        this._selectedKey = key;
        this.selectedKeyChange.emit(key);
    }

    constructor() { }

    ngOnChanges() {
        this.changeSelect(_.findIndex(this.tabs, { key: this.selectedKey }));
    }

    ngAfterContentInit() {
        this.containers.forEach((container: FormTabContentDirective, index: number) => {
            container.setVisible(this.tabs[index].visible);
        });
    }

    changeSelect(i) {
        if (this.containers) {
            this.containers.forEach((container: FormTabContentDirective, index: number) => {
                this.tabs[index].visible = i === index;
                container.setVisible(i === index);
            });
        }
    }

    onTabClick(i) {
        this.changeSelect(i);
        this.selectedKey = this.tabs[i].key;
    }

    closeTabs() {
        this.closeTab.emit();
    }
}
