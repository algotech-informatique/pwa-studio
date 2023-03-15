import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { SnParam, SnView, SnNode } from '../../../models';
import { SnActionsService, SnSelectionService } from '../../../services';

@Component({
    selector: 'sn-param',
    templateUrl: './sn-param.component.html',
    styleUrls: ['./sn-param.component.scss'],
})
export class SnParamComponent {
    @Input()
    param: SnParam;

    @Input()
    params: SnParam[];

    @Input()
    node: SnNode;

    @Input()
    snView: SnView;

    constructor(private snActions: SnActionsService, private snSelection: SnSelectionService) { }

    onUpdateKey(value: string) {
        this.snActions.editParam(this.snView, this.node, this.param, this.params, 'key', value);
    }

    onUpdateValue(value: string | boolean | Date | number) {
        this.snActions.editParam(this.snView, this.node, this.param, this.params, 'value', value);
    }

    select($event, contextmenu = false) {
        $event.preventDefault();
        this.snSelection.select(
            $event,
            this.snView,
            { element: this.param, type: 'param', rightClickMode: contextmenu },
        );
    }

}
