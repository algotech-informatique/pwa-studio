import { Injectable } from '@angular/core';
import { SnView, SnGroup, SnParam, SnConnector, SnNode, SnElement, SnFlow } from '../../../models';
import * as _ from 'lodash';
import { SnUtilsService } from '../../utils';
import { SnMessageService } from '../sn-message/sn-message.service';
import { Observable } from 'rxjs';
import { SnSelectionEvent, SnSelectionType } from '../../../dto';

@Injectable()
export class SnSelectionService extends SnMessageService {

    constructor(private snUtils: SnUtilsService) {
        super();
    }

    public unselect(snView: SnView) {
        this.applySelect(snView, false);
        this.notifySelect(snView);
    }

    public select($event, snView: SnView, event: SnSelectionEvent) {
        const ignoreUnselect = event.rightClickMode || event.ignoreUnselect;
        if ($event && (($event.sourceEvent && $event.sourceEvent.ctrlKey) || $event.ctrlKey)) {
            // ctrlKey

            switch (event.type) {
                case 'link':
                    event.element.displayState.selectedLink = ignoreUnselect ? true : !event.element.displayState.selectedLink;
                    break;
                default:
                    event.element.displayState.selected = ignoreUnselect ? true : !event.element.displayState.selected;
                    break;
            }

            this.notifySelect(snView, event);
        } else {
            if (ignoreUnselect && (event.element.displayState.selectedLink || event.element.displayState.selected)) {
                return;
            }

            //  unselect
            this.applySelect(snView, false);
            switch (event.type) {
                case 'link':
                    event.element.displayState.selectedLink = true;
                    break;
                default:
                    event.element.displayState.selected = true;
                    break;
            }

            this.notifySelect(snView, event);
        }
        if (!ignoreUnselect && $event && $event.stopPropagation) {
            $event.stopPropagation();
        }
    }

    selectAll(snView: SnView) {
        const all = [...snView.groups, ...snView.box, ...snView.nodes];

        for (const elt of all) {
            elt.displayState.selected = true;
        }

        const selections = this.getSelections(snView);
        if (selections.length > 0) {
            this.notifySelect(snView, selections[selections.length - 1]);
        }
    }

    getSelections(snView: SnView): SnSelectionEvent[] {
        return [
            ...this.pushSelections(snView.groups, 'group'),
            ...this.pushSelections(snView.box, 'box'),
            ...this.pushSelections(snView.nodes, 'node'),
            ...this.pushSelections(this.snUtils.getParams(snView), 'param'),
            ...this.pushSelections(this.snUtils.getFlows(snView), 'flow'),
            ..._.reduce(this.snUtils.getConnectors(snView), (results, connector: SnConnector) => {
                if (connector.displayState?.selectedLink) {
                    const selection: SnSelectionEvent = {
                        element: connector,
                        type: 'link'
                    };
                    results.push(selection);
                }
                return results;
            }, [])
        ];
    }

    pushSelections(elements: (SnElement | SnNode | SnConnector | SnParam)[], type: SnSelectionType) {
        return _.reduce(elements, (results, element: (SnElement | SnNode | SnConnector | SnParam)) => {
            if (element.displayState?.selected) {
                const selection: SnSelectionEvent = {
                    element,
                    type
                };
                results.push(selection);
            }
            return results;
        }, []);
    }

    onSelect(snView: SnView): Observable<SnSelectionEvent> {
        return this._get('sn.select', snView);
    }

    getSelectedParamsEditable(snView: SnView): { param: SnParam; params: SnParam[] }[] {
        return _.reduce(this.snUtils.getParamsWithNode(snView), (results, elt) => {
            if (elt.param.displayState.selected) {
                const findSection = elt.node.sections.find((s) => s.params.indexOf(elt.param) > -1);
                if (findSection && findSection.editable) {
                    results.push({
                        params: findSection.params,
                        param: elt.param,
                    });
                }
            }
            return results;
        }, []);
    }

    getSelectedFlowsEditable(snView: SnView): { flow: SnFlow; flows: SnFlow[] }[] {
        return _.reduce(this.snUtils.getFlowsWithNode(snView), (results, elt) => {
            if (elt.node.flowsEditable && elt.flow.displayState.selected && elt.flow.direction === 'out' && elt.flow.locked !== true) {
                results.push({
                    flow: elt.flow,
                    flows: elt.node.flows,
                });
            }
            return results;
        }, []);
    }

    getSelectedContainers(snView: SnView): SnElement[] {
        const selections = this.getSelections(snView);
        return selections.filter((s) => s.type === 'group' || s.type === 'box').map((s) => s.element) as SnElement[];
    }

    applySelect(snView: SnView, state = false) {
        for (const elt of [
            ...snView.nodes,
            ...snView.groups,
            ...snView.box,
            ...this.snUtils.getParams(snView),
            ...this.snUtils.getFlows(snView)
        ]) {
            elt.displayState.selectedLink = state;
            elt.displayState.selected = state;
        }
    }

    notifySelect(view: SnView, event?: SnSelectionEvent) {
        this._send('sn.select', view, event);
    }
}
