import { Injectable } from '@angular/core';
import { SnView, SnParam, SnConnector } from '../../../models';
import * as _ from 'lodash';
import { SnUtilsService } from '../../utils';
import { SnSelectionService } from '../sn-selection/sn-selection.service';

@Injectable()
export class SnUpDownService {

    constructor(private snUtils: SnUtilsService, private snSelection: SnSelectionService) {
    }

    moveUpDown(snView: SnView, direction: 'up' | 'down') {
        if (!this.canUpDown(snView, direction)) {
            return;
        }
        const connectors = this.getConnectors(snView);
        for (const selection of direction === 'up' ? connectors : _.reverse(connectors)) {

            const upDown = this.getConnectorUpDown(selection.connector, selection.connectors, direction);

            if (selection.connector && upDown) {
                const fromIndex = selection.connectors.indexOf(selection.connector);
                const toIndex = selection.connectors.indexOf(upDown);
                const element = selection.connectors[fromIndex];
                selection.connectors.splice(fromIndex, 1);
                selection.connectors.splice(toIndex, 0, element);
            }
        }
    }

    canUpDown(snView: SnView, direction: 'up' | 'down') {
        const connectors = this.getConnectors(snView);
        if (connectors.length === 0) {
            return false;
        }

        if (connectors.length !== this.snSelection.getSelections(snView).length) {
            return false;
        }

        const selection = direction === 'up' ? connectors[0] : connectors[connectors.length - 1];
        const upDown = this.getConnectorUpDown(selection.connector, selection.connectors, direction);
        if (!upDown) {
            return false;
        }

        return true;
    }

    private getConnectorUpDown(connector: SnConnector, connectors: SnConnector[], direction: 'up' | 'down') {
        if (connectors) {
            const filter = _.filter(connectors, ((c) => {
                return c.direction === connector.direction && !c.displayState.hidden;
            }));
            let index = filter.indexOf(connector);
            index = direction === 'up' ? index - 1 : index + 1;
            if (index >= 0 && index < filter.length) {
                return filter[index];
            }
        }
        return null;
    }

    private getConnectors(snView: SnView) {
        const params = this.snSelection.getSelectedParamsEditable(snView);
        const flows = this.snSelection.getSelectedFlowsEditable(snView);

        if (params.length > 0 && flows.length > 0) {
            return [];
        }
        return params.length > 0 ?
            params.map((res) => {
                return {
                    connector: res.param,
                    connectors: res.params,
                };
            }) : flows.map((res) => {
                return {
                    connector: res.flow,
                    connectors: res.flows,
                };
            });
    }

    /* selection */

    selectUpDown($event, snView: SnView, direction: 'up' | 'down') {
        const selectedParams = this.getSelectedParams(snView);
        if (selectedParams.length === 0) {
            return;
        }
        const selection = direction === 'up' ? selectedParams[0] : selectedParams[selectedParams.length - 1];
        const upDown = this.getConnectorUpDown(selection.param, selection.params, direction);
        if (!upDown) {
            return;
        }

        this.snSelection.select($event, snView, {
            element: upDown,
            type: 'param'
        });
    }

    private getSelectedParams(snView: SnView) {
        const selections = this.snSelection.getSelections(snView);
        return selections.filter((s) => s.type === 'param').map((selection) => {
            return {
                param: selection.element as SnParam,
                params: this.snUtils.getArrayOfParam(snView, selection.element as SnParam),
            };
        });
    }
}
