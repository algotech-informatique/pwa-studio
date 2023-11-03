import { Injectable } from '@angular/core';
import { SnParam } from '../../../smart-nodes/models';
import * as _ from 'lodash';
import { SessionsService } from '../../../../services';
import { SmartModelDto } from '@algotech-ce/core';
import { SnView } from './../../../smart-nodes/models/sn-view';
import { SnUtilsService } from '../../../smart-nodes';

@Injectable()
export class SnCustomSmartConnectionsService {

    constructor(
        private sessionsService: SessionsService,
        private snUtils: SnUtilsService,
    ) {
    }

    checkType(paramIn: SnParam, paramOut: SnParam, view: SnView) {

        const typesIn = this.groupTypes(Array.isArray(paramIn.types) ? paramIn.types : [paramIn.types]);
        const typesOut = this.groupTypes(Array.isArray(paramOut.types) ? paramOut.types : [paramOut.types]);

        const typesReverse = {
            in: typesOut,
            out: typesIn,
        };

        if (paramOut.custom && !_.isEqual(paramIn.custom, paramOut.custom)) {
            return false;
        }

        // sk: so:
        if (_.some(this.compactType(typesIn, typesOut), (type) => {

            if (type.direction === 'in') {
                if (type.type === 'any') {
                    return true;
                }
                if (type.type.startsWith('date')) {
                    return this.checkDate(typesReverse[type.direction]);
                }
                if (type.type === 'html') {
                    return this.checkHtml(typesReverse[type.direction]);
                }
                if (type.type === 'so:' || type.type === 'so:*') {
                    return this.checkSo(typesReverse[type.direction]);
                }
                if (type.type === 'sys:' || type.type === 'sys:*') {
                    return this.checkSys(typesReverse[type.direction]);
                }
            }
            if (type.direction === 'out') {
                if (type.type === 'reset') {
                    const nodeIn = this.snUtils.getParamsWithNode(view, null).find((ele) => ele.param === paramIn)?.node;
                    const nodeOut = this.snUtils.getParamsWithNode(view, null).find((ele) => ele.param === paramOut)?.node;

                    const tasks = ['SnObjectCreationNode', 'SnObjectAssignmentNode'];
                    return (tasks.includes(nodeIn?.type) || tasks.includes(nodeOut?.type));
                }
            }
            if (type.type === 'object') {
                return this.checkJSON(typesReverse[type.direction]);
            }
            if (type.type === 'sys:comment') {
                return this.checkComment(typesReverse[type.direction]);
            }
            if (type.type.startsWith('sk:')) {
                return this.checkSk(typesReverse[type.direction], type.type, type.direction);
            }
        })) {
            return true;
        }
        return _.intersection(typesIn, typesOut).length > 0;
    }

    public filterParam(paramIn: SnParam, paramOut: SnParam, view: SnView) {
        return this.checkType(paramIn, paramOut, view) && (paramIn.multiple == null || paramOut.multiple == null ||
            paramIn.multiple === true || paramIn.multiple === paramOut.multiple);
    }

    private checkDate(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t.startsWith('date'));
    }

    private checkComment(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t === 'sys:comment' || t === 'string');
    }

    private checkHtml(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t === 'string' || t === 'html');
    }

    private checkJSON(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t === 'json' || t === 'object');
    }

    private checkSo(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t.startsWith('so:'));
    }

    private checkSys(typesReverse: string[]) {
        return _.some(typesReverse, (t: string) => t.startsWith('sys:'));
    }

    private checkSk(typesReverse: string[], type: string, directionSk: 'in' | 'out') {
        // check if so inherits skills
        return _.some(typesReverse, (t: string) => {
            // find model
            if (directionSk === 'out') {
                if (t === 'so:' || t === 'so:*') {
                    return true;
                }
            }
            if (t.startsWith('so:')) {
                const model: SmartModelDto = this.sessionsService.active.datas.read.smartModels.find((sm) =>
                    sm.key.toUpperCase() === t.replace('so:', '').toUpperCase());

                const skillKey = type.replace('sk:', '');
                if (model) {
                    return model.skills[skillKey];
                }
            }

            return false;
        });
    }

    private groupTypes(types: string[]) {
        return _.map(types, (type) => {
            if (type === 'datetime') {
                return 'date';
            }
            return type;
        });
    }

    private compactType(typesIn: string[], typesOut: string[]): { type: string; direction: string }[] {
        return _.compact([..._.map(typesIn, (type) => ({
            type,
            direction: 'in'
        })), ..._.map(typesOut, (type) => ({
            type,
            direction: 'out'
        }))]);
    }
}
