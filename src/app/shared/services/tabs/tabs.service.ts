import { TranslateLangDtoService } from '@algotech-ce/angular';
import { SnAppDto, SnModelDto } from '@algotech-ce/core';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';
import { TabDto, ObjectTreeLineDto, ModuleTreeLineDto, ResourceType } from '../../dtos';
import { SessionsService } from '../sessions/sessions.service';

@Injectable()
export class TabsService {

    constructor(
        private sessionsService: SessionsService,
        private translateService: TranslateService,
        private translateLangDtoService: TranslateLangDtoService,
    ) { }

    createOrSelectTab(tabs: TabDto[], selectedLine: ObjectTreeLineDto | ModuleTreeLineDto): TabDto[] {
        switch (selectedLine.type) {
            case 'smartmodel':
                return this._handleSmartModelTab(tabs, selectedLine as ModuleTreeLineDto);
            default:
                return this._handleOtherTab(tabs, selectedLine as ObjectTreeLineDto);
        }
    }

    _handleSmartModelTab(tabs: TabDto[], selectedLine: ModuleTreeLineDto): TabDto[] {
        const findTab: TabDto = _.find(tabs, {
            host: selectedLine.host,
            customerKey: selectedLine.customerKey, type: 'smartmodel'
        });
        if (findTab) {
            const newTab: TabDto = _.cloneDeep(findTab);
            newTab.refUuid = selectedLine.refUuid;

            const newTabs = _.clone(tabs);
            newTabs[newTabs.indexOf(findTab)] = newTab;

            return this.select(newTabs, newTab.host, newTab.customerKey, newTab.refUuid);
        } else {
            const newTab: TabDto = this._objTreeLineToTab(selectedLine);
            const newTabs = _.clone(tabs);
            newTabs.push(newTab);
            return this.select(newTabs, newTab.host, newTab.customerKey, newTab.refUuid);
        }
    }

    _handleOtherTab(tabs: TabDto[], selectedLine: ObjectTreeLineDto): TabDto[] {
        const findTab: TabDto = _.find(tabs, {
            host: selectedLine.host,
            customerKey: selectedLine.customerKey,
            refUuid: selectedLine.refUuid
        });
        if (findTab) {
            return this.select(tabs, findTab.host, findTab.customerKey, findTab.refUuid);
        } else {
            const newTab: TabDto = this._objTreeLineToTab(selectedLine);
            const newTabs = _.clone(tabs);
            newTabs.push(newTab);
            return this.select(newTabs, newTab.host, newTab.customerKey, newTab.refUuid);
        }
    }

    _objTreeLineToTab(line: ObjectTreeLineDto | ModuleTreeLineDto): TabDto {
        let icon = line.icon;
        let name = line.name;

        switch (line.type) {
            case 'smartmodel':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-cubes';
                break;
            case 'database':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-database';
                break;
            case 'task':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-hurricane';
                break;
            case 'tags':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-tags';
                break;
            case 'metadata':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-icons';
                break;
            case 'listgen':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-list';
                break;
            case 'import':
                const customerName = this.sessionsService.findConnection(line.host, line.customerKey).name;
                name = `${this.translateService.instant(line.name)} - ${customerName}`;
                icon = 'fa-solid fa-file-arrow-up';
                break;
            case 'users':
            case 'audit-trail':
            case 'groups':
                const groupName = this.sessionsService.findConnection(line.host, line.customerKey).name;
                name = `${this.translateService.instant(line.name)} - ${groupName}`;
                icon = 'fa-solid fa-shield-alt';
                break;
            case 'appSettings':
                name = `${this.translateService.instant('SETTINGS.APPLICATIONS.TITLE')}`;
                icon = 'fa-solid fa-table-cells';
                break;
            case 'theme':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-palette';
                break;
            case 'check':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-shield-heart';
                break;
            case 'manifest':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-file';
                break;
            case 'i18n':
                name = this.sessionsService.findConnection(line.host, line.customerKey).name;
                icon = 'fa-solid fa-earth-europe';
                break;
        }

        const newTab: TabDto = {
            icon,
            host: line.host,
            customerKey: line.customerKey,
            refUuid: line.refUuid,
            title: name,
            type: line.type,
            selected: true,
        };
        return newTab;
    }

    getSelected(tabs: TabDto[]): TabDto {
        return _.find(tabs, { selected: true });
    }

    select(tabs: TabDto[], host: string, customerKey: string, uuid: string): TabDto[] {
        return _.map(tabs, (t: TabDto) => {
            t.selected = t.refUuid === uuid && t.customerKey === customerKey && t.host === host;
            return t;
        });
    }

    close(tabs: TabDto[], host: string, customerKey: string, uuid: string): TabDto[] {
        return this._closeTabs(tabs, host, customerKey, [uuid]);
    }

    closeMultiple(tabs: TabDto[], host: string, customerKey: string, uuidToClose: string[]): TabDto[] {
        return this._closeTabs(tabs, host, customerKey, uuidToClose);
    }

    updateTabs(tabs: TabDto[], objects: ObjectTreeLineDto[]) {
        const _tabs = _.cloneDeep(tabs);
        return _.map(_tabs, (tab: TabDto) => {
            const findLine = objects.find((o) => o.host === tab.host && o.customerKey === tab.customerKey && o.refUuid === tab.refUuid);
            if (findLine) {
                return _.assign(this._objTreeLineToTab(findLine), { selected: tab.selected });
            } else {
                return tab;
            }
        });
    }

    createOrSelectSnModel(tabs: TabDto[], snModel: SnModelDto): TabDto[] {
        const findTab: TabDto = _.find(tabs, {
            host: this.sessionsService.active.connection.host,
            customerKey: this.sessionsService.active.connection.customerKey,
            refUuid: snModel.uuid,
        });
        if (findTab) {
            return this.select(tabs, findTab.host, findTab.customerKey, findTab.refUuid);
        } else {
            const newTab: TabDto = this.createTab(snModel);
            const newTabs = _.clone(tabs);
            const selectedIndex: number = _.findIndex(tabs, { selected: true });
            newTabs.splice(selectedIndex + 1, 0, newTab);
            return this.select(newTabs, newTab.host, newTab.customerKey, newTab.refUuid);
        }
    }

    private _closeTabs(tabs: TabDto[], host: string, customerKey: string, uuidToClose: string[]): TabDto[] {
        const closedTabs: TabDto[] = tabs.filter((tab) => uuidToClose.includes(tab.refUuid));
        const remainingTabs: TabDto[] = _.difference(tabs, closedTabs);
        if (remainingTabs.length > 0) {
            if (closedTabs.find((tab) => tab.selected)) {
                return this.select(remainingTabs, remainingTabs[0].host, remainingTabs[0].customerKey, remainingTabs[0].refUuid);
            }
            return remainingTabs;
        } else {
            return [];
        }
    }

    private createTab(snModel: SnModelDto): TabDto {
        let icon = null;
        switch (snModel.type) {
            case 'app':
                icon = 'fa-solid fa-window-maximize';
                break;
            case 'report':
                icon = 'fa-solid fa-file-lines';
                break;
            case 'workflow':
                icon = 'fa-solid fa-diagram-project';
                break;
            case 'smartmodel':
                icon = 'fa-solid fa-cubes';
                break;
            case 'smartflow':
                icon = 'fa-solid fa-atom';
                break;
        }
        return {
            icon,
            host: this.sessionsService.active.connection.host,
            customerKey: this.sessionsService.active.connection.customerKey,
            refUuid: snModel.uuid,
            title: this.translateLangDtoService.transform(snModel.displayName),
            type: snModel.type as ResourceType,
            selected: true,
        };
    }

}

