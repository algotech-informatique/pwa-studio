import { Injectable } from '@angular/core';
import { SnView, SnNode, SnParam, SnElement, SnGroup, SnBox, SnConnector } from '../../../models';
import { SnUtilsService } from '../../utils';
import * as _ from 'lodash';
import { SnSelectionService } from '../sn-selection/sn-selection.service';
import { SnSettings } from '../../../dto/sn-settings';
import { SnRemoveSelection } from '../../../dto';

@Injectable()
export class SnRemoveService {

    constructor(
        private snSelection: SnSelectionService,
        private snUtils: SnUtilsService) {
    }

    canRemove(snView: SnView) {
        return this.getElementsToRemove(snView) ? true : false;
    }

    remove(snView: SnView, elementsToRemove: SnRemoveSelection, cascade: boolean) {
        // remove all selection
        for (const element of elementsToRemove.containers) {
            this.removeContainer(snView, element, cascade);
        }

        for (const node of elementsToRemove.nodes) {
            this.removeNode(snView, node);
        }

        for (const elt of elementsToRemove.params) {
            this.removeConnector(snView, elt.param, elt.params);
        }

        for (const elt of elementsToRemove.flows) {
            this.removeConnector(snView, elt.flow, elt.flows);
        }

        for (const connector of elementsToRemove.links) {
            connector.toward = null;
        }
    }

    getElementsToRemove(snView: SnView): SnRemoveSelection {
        const elements: SnRemoveSelection = {
            containers: _.filter([...snView.box, ...snView.groups], (elt) => {
                return elt.displayState.selected;
            }),
            nodes: _.filter(snView.nodes, (node) => {
                return node.displayState.selected;
            }),
            params: this.snSelection.getSelectedParamsEditable(snView),
            flows: this.snSelection.getSelectedFlowsEditable(snView),
            links: _.filter(this.snUtils.getConnectors(snView), (connector) => {
                return connector.displayState.selectedLink;
            }),
        };

        if (elements.containers.length === 0 && elements.flows.length === 0 &&
            elements.links.length === 0 && elements.nodes.length === 0 && elements.params.length === 0) {
            return null;
        }

        return elements;
    }

    removeContainer(snView: SnView, container: SnElement, cascade: boolean) {
        const findIndexGroup = snView.groups.indexOf(container as SnGroup);
        if (findIndexGroup > -1) {
            snView.groups.splice(findIndexGroup, 1);
        } else {
            const findIndexBox = snView.box.indexOf(container as SnBox);
            if (findIndexBox > -1) {
                snView.box.splice(findIndexBox, 1);
            }
        }

        if (cascade) {
            for (const element of this.snUtils.getBoxByContainer(snView, container)) {
                this.removeContainer(snView, element, true);
            }
            for (const element of this.snUtils.getNodesByContainer(snView, container, false)) {
                this.removeNode(snView, element);
            }
        } else {
            for (const element of [...snView.box, ...snView.nodes]) {
                if (element.parentId === container.id) {
                    element.parentId = null;
                }
            }
        }

        // remove comments
        _.remove(snView.comments, { parentId: container.id });
    }

    removeNode(snView: SnView, node: SnNode) {
        const connectors: SnConnector[] = [];

        connectors.push(...this.snUtils.getParams(snView, node));
        connectors.push(...this.snUtils.getFlows(snView, node));

        const findIndex = snView.nodes.indexOf(node);
        if (findIndex > -1) {
            snView.nodes.splice(findIndex, 1);

            // remove link to removed params
            for (const connector of this.snUtils.getConnectors(snView)) {
                if (connectors.find((p) => connector.toward === p.id)) {
                    connector.toward = null;
                }
            }
        }
    }

    removeConnector(snView: SnView, connector: SnConnector, connectors: SnConnector[]) {
        const index = connectors.indexOf(connector);
        if (index > -1) {
            connectors.splice(index, 1);
        }
        const linkedParam = this.snUtils.getConnectorsWithNode(snView).find((p) => p.connector.toward === connector.id);
        if (linkedParam) {
            linkedParam.connector.toward = null;
        }
    }

    removeParams(snView: SnView, paramsToRemove: SnParam[], params: SnParam[]) {
        for (const param of [...paramsToRemove]) {
            this.removeConnector(snView, param, params);
        }
    }
}
