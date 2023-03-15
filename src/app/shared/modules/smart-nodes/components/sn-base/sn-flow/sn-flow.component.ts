import {
    Component, Input
} from '@angular/core';
import * as _ from 'lodash';
import { SnFlow, SnNode, SnView } from '../../../models';
import { SnSelectionService } from '../../../services';

@Component({
    selector: 'sn-flow',
    templateUrl: './sn-flow.component.html',
    styleUrls: ['./sn-flow.component.scss'],
})
export class SnFlowComponent {

    @Input()
    snView: SnView;

    @Input()
    flow: SnFlow;

    @Input()
    node: SnNode;

    constructor(
        private snSelection: SnSelectionService,
    ) { }

    select(event, contextmenu = false) {
        event.preventDefault();
        this.snSelection.select(event, this.snView, { element: this.flow, type: 'flow', rightClickMode: contextmenu });
    }
}
