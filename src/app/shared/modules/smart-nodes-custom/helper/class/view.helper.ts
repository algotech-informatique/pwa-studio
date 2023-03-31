import { LangDto, SnModelDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';
import { SnEntryComponents } from '../../../smart-nodes/dto';
import { SnGroup, SnView } from '../../../smart-nodes/models';
import { HelperContext } from '../helper.context';
import { BoxHelper } from './box.helper';
import { ContainerHelper } from './container.helper';
import { GroupHelper } from './group.helper';

export class ViewHelper<HelperType extends unknown> extends ContainerHelper<HelperType> {
    constructor(helperContext: HelperContext, snModel: SnModelDto, entryComponents: (snView: SnView) => SnEntryComponents) {
        super(helperContext, helperContext.getViewFromModel(snModel), entryComponents);
        this.snModel = snModel;
        if (!this.snView.options) {
            this.snView.options = {};
        }
    }

    public open(): HelperType {
        // TODO: to implemented
        // const active = this.injector.get(SessionsService).active
        // const env = this.sessionsService.getEnvByUUid(active.connection.host, active.connection.customerKey, this.snModel.uuid);
        // if (!env) {
        //     return;
        // }
        // env.active = true;
        // if (env.selectable) {
        //     this.injector.get(SessionsService).selectEnv(env);
        //     this.injector.get(MessageService).send('explorer-tree-select', env);
        // }
        return this as unknown as HelperType;
    }

    public setName(name: string): HelperType {
        this.snModel.displayName = this.helperContext.initializeLangs(name);
        return this as unknown as HelperType;
    }

    public getName(language?: string): string {
        if (this.snModel.displayName.length === 0) {
            return null;
        }

        const foundName: LangDto = this.snModel.displayName.find(l => {
            if (language) {
                return l.lang === language;
            } else {
                return l.lang === this.helperContext.getCurrentLanguage();
            }
        });
        if (foundName) {
            return foundName.value;
        } else {
            return this.snModel.displayName[0].value;
        }
    }

    public createGroup(displayName: string = ''): GroupHelper {
        const newGroup: SnGroup = {
            id: UUID.UUID(),
            canvas: { x: 0, y: 0 },
            color: '#9A9A9A', // FIXME set a default color ?
            displayName: this.helperContext.initializeLangs(displayName),
            displayState: {},
            open: true,
        };
        this.snView.groups.push(newGroup);

        return new GroupHelper(this.helperContext, this.snView, this.entryComponents, newGroup);
    }

    public getGroup(groupId: string): GroupHelper {
        const foundGroup = this.snView.groups.find(group => group.id === groupId);
        if (foundGroup) {
            return new GroupHelper(this.helperContext, this.snView, this.entryComponents, foundGroup);
        } else {
            throw new Error(`group with id=[${groupId}] not found in view id=[${this.snView.id}]`);
        }
    }

    public getGroups(): GroupHelper[] {
        return this.snView.groups.map(group => new GroupHelper(this.helperContext, this.snView, this.entryComponents, group));
    }

    public removeGroup(groupId: string): HelperType {
        const groupToRemove = this.getGroup(groupId);
        this.snView.groups.splice(this.snView.groups.indexOf(groupToRemove.group));
        return this as unknown as HelperType;
    }

    public createBox(displayName = ''): BoxHelper {
        return super.createBox(displayName);
    }

    public getBox(id: string): BoxHelper {
        return super.getBox(id);
    }

    public getBoxes(): BoxHelper[] {
        return super.getBoxes();
    }

    public removeBox(id: string): HelperType {
        return super.removeBox(id);
    }
}
