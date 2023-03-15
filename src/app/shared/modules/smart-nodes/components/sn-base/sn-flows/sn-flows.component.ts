import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
import { SnFlow, SnView, SnNode, SnLang, SnSection, SnParam } from '../../../models';
import { SnActionsService } from '../../../services';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'sn-flows',
    templateUrl: './sn-flows.component.html',
    styleUrls: ['./sn-flows.component.scss'],
})
export class SnFlowsComponent {
    @Input()
    snView: SnView;

    @Input()
    node: SnNode;

    @Input()
    editable: boolean;

    @Input()
    flows: SnFlow[] = [];

    @Input()
    languages: SnLang[];

    @Input() notifyParam = false;
    @Input() section: SnSection;
    @Input() connectedParam: SnParam;

    constructor(private  snActions:  SnActionsService) {}

    addFlow($event) {
        $event.stopPropagation();
        this.snActions.addFlow(this.snView, this.node, this.flows, this.languages, this.notifyParam, this.connectedParam, this.section);
    }
}
