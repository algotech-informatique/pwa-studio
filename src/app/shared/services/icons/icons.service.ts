import { Injectable } from '@angular/core';
import { PairDto } from '@algotech-ce/core';
import * as _ from 'lodash';

@Injectable()
export class IconsService {

    loadListIcons(): PairDto[] {
        return [
            { key: 'any', value: 'fa-solid fa-question' },
            { key: 'string', value: 'fa-solid fa-font string' },
            { key: 'number', value: 'fa-solid fa-arrow-up-9-1 number' },
            { key: 'datetime', value: 'fa-solid fa-calendar-days datetime' },
            { key: 'date', value: 'fa-solid fa-calendar-days date' },
            { key: 'time', value: 'fa-solid fa-clock' },
            { key: 'boolean', value: 'fa-solid fa-toggle-on boolean' },
            { key: 'html', value: 'fa-solid fa-code' },
            { key: 'sys:comment', value: 'fa-solid fa-comment sys' },
            { key: 'sys:schedule', value: 'fa-solid fa-calendar sys' },
            { key: 'sys:user', value: 'fa-solid fa-user sys' },
            { key: 'sys:location', value: 'fa-solid fa-location-dot sys' },
            { key: 'sys:file', value: 'fa-solid fa-file sys' },
            { key: 'sys:signature', value: 'fa-solid fa-signature sys' },
            { key: 'sys:tag', value: 'fa-solid fa-tags sys' },
            { key: 'sys:magnet', value: 'fa-solid fa-magnet sys' },
            { key: 'sys:glistvalue', value: 'fa-solid fa-list sys' },
            { key: 'sys:query', value: 'fa-brands fa-searchengin sys' },
            { key: 'sys:orderpair', value: 'fa-solid fa-arrow-down-a-z sys' },
            { key: 'sys:filterpair', value: 'fa-solid fa-filter sys' },
            { key: 'sys:filter', value: 'fa-solid fa-filter sys' },
            { key: 'sk:atDocument', value: 'fa-solid fa-file sk' },
            { key: 'sk:atSignature', value: 'fa-solid fa-signature sk' },
            { key: 'sk:atGeolocation', value: 'fa-solid fa-location-dot sk' },
            { key: 'sk:atTag', value: 'fa-solid fa-tags sk' },
            { key: 'sk:atMagnet', value: 'fa-solid fa-magnet sk' },
            { key: 'object', value: 'fa-solid fa-cube' },
            { key: 'so:*', value: 'fa-solid fa-cube fa-blue' },
            { key: 'sk', value: 'fa-solid fa-cube fa-orange' },
            { key: 'sys:workflow', value: 'fa-solid fa-diagram-project' },
            { key: 'sys:notification', value: 'fa-solid fa-bell' },
            { key: 'glist', value: 'fa-solid fa-list' },
            { key: 'widget', value: 'fa-solid fa-window-maximize' },
            { key: 'system:current-user', value: 'fa-solid fa-user' },
            { key: 'system:now', value: 'fa-solid fa-calendar-days datetime' },
            { key: 'system:date', value: 'fa-solid fa-calendar-days date' },
            { key: 'system:time', value: 'fa-solid fa-clock' },
            { key: 'system:page-name', value: 'fa-solid fa-file sk' },
            { key: 'system:app-name', value: 'fa-solid fa-window-maximize sk' },
            { key: 'sys:createdDate', value: 'fa-solid fa-calendar-days datetime' },
            { key: 'sys:updateDate', value: 'fa-solid fa-calendar-days datetime' },
        ];
    }

    getIcon(icon: string): PairDto {
        return _.find(this.loadListIcons(), (ic: PairDto) => ic.key === icon);
    }

    getIconByType(icon: string | string[]): PairDto {
        const selectedIcon = _.isArray(icon) ? 'any' : this.isIconObject(icon as string);
        return _.find(this.loadListIcons(), (ic: PairDto) => ic.key === selectedIcon);
    }

    getSnModelIcon(modelType: string): string {

        switch (modelType) {
            case 'workflow':
                return 'fa-solid fa-diagram-project';
            case 'app':
                return 'fa-solid fa-compass-drafting';
            case 'smartflow':
                return 'fa-solid fa-atom';
            case 'task':
                return 'fa-solid fa-hurricane';
            case 'smartmodel':
                return 'fa-solid fa-cubes';
            case 'database':
                return 'fa-solid fa-database';
            case 'listgen':
                return 'fa-solid fa-list';
            case 'report':
                return 'fa-solid fa-file-lines';
            case 'settings':
                return 'fa-solid fa-gears';
            case 'SnModelNode':
                return 'fa-solid fa-cubes';
            case 'appSettings':
                return 'fa-solid fa-th';
            case 'theme':
                return 'fa-solid fa-palette';
            case 'check':
                return 'fa-solid fa-shield-heart';
            case 'manifest':
                return 'fa-solid fa-file';
        }
    }

    getIconColor(type: string): string {
        switch (type) {
            case 'string':
                return '#BB6BD9';
            case 'number':
                return '#2B71C3';
            case 'boolean':
                return '#3DBCB0';
            case 'date':
            case 'datetime':
            case 'time':
                return '#F5C64E';
            default:
                return '#EB6317';
        }
    }

    private isIconObject(icon: string) {
        if ((icon?.startsWith('so:') && (icon?.replace('so:', '') !== '*')) || (icon?.startsWith('sk:'))) {
            return 'object';
        } else {
            return icon;
        }
    }

}
