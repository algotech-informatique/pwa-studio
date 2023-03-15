
import { SnPageWidgetDto } from '@algotech/core';
import * as _ from 'lodash';
import { WidgetCssSchemaInterface } from '../../models/widget-css-schema.interface';
import { generateCss } from './data';

export const sections = {
    widget: ['<root>'],
    rules: ['rules'],
    box: ['box', 'custom.hidden'],
    disabled: ['custom.disabled'],
    css: {
        layout: ['$css:layout'],
        icon: ['$css:icon'],
        text: ['$css:text'],
        shadow: ['$css:text'],
        stroke: [
            '$css:stroke-color',
            '$css:stroke-width',
            '$css:stroke-dasharray',
            '$css:stroke-linecap'
        ],
        background: [
            '$css:background',
            '$css:radius',
            '$css:border-top',
            '$css:border-right',
            '$css:border-bottom',
            '$css:border-left'
        ],
        header: ['$css:header'],
        headerBackground: ['$css:header'],
        row: ['$css:row'],
        column: ['$css:column'],
        cell: ['$css:cell'],
    },
    events: {
        onClick: ['$event:onClick'],
        onLoad: ['$event:onLoad'],
        onAddMagnet: ['$event:onAddMagnet'],
        onActionMagnet: ['$event:onActionMagnet'],
        onMoveMagnet: ['$event:onMoveMagnet'],
        onActionDocument: ['$event:onActionDocument'],
        onRowClick: ['$event:onRowClick'],
        onRowDblClick: ['$event:onRowDblClick'],
        onRowSelection: ['$event:onRowSelection'],
        onCellClick: ['$event:onCellClick'],
        onCellDblClick: ['$event:onCellDblClick'],
    },
    selected: {
        tabs: ['custom.selectedTabId'],
    },
    icon: {
        profile: ['custom.icon'],
        selectorWidget: ['custom.icon']
    },
    collection: {
        list: ['custom.collection'],
    },
    input: {
        document: ['custom.input'],
        table: ['custom.datasource', 'custom.columns'],
    },
    filters: {
        document: ['custom.type', 'custom.search', 'custom.tagFilter'],
        table: ['custom.multiselection', 'custom.search', 'custom.sort', 'custom.filter', 'custom.paginate.limit'],
        column: ['custom.sort', 'custom.filter'],
    },
    carousel: {
        document: ['custom.metadatas', 'custom.oldVersions']
    },
    pagination: {
        list: ['custom.paginate.limit', 'custom.search'],
        document: ['custom.mode', 'custom.pagination']
    },
    customParams: {
        notif: ['custom.counter', 'custom.preview', 'custom.icon'],
        image: ['custom.typeSrc', 'custom.imageUri', 'custom.imageUuid', 'custom.input', 'custom.tag'],
        button: ['custom.preview', 'custom.title', 'custom.icon'],
        board: ['custom.imageUuid', 'custom.instance'],
        magnet: ['custom.imageUuid', 'custom.modelKey', 'custom.filter'],
        zone: ['custom.key'],
        text: ['custom.text', 'custom.preview']
    },
    display: {
        zone: ['custom.overlay', 'custom.grid'],
        tab: ['custom.text', 'custom.preview', 'custom.icon'],
        list: ['custom.paginate.mode', 'custom.scrollbar', 'custom.direction'],
        column: ['custom.format'],
    },
    permissions: {
        magnet: ['custom.permissions']
    },
    interactions: {
        table: ['custom.resize', 'custom.reorder', 'custom.editable'],
        column: ['custom.resize'],
    }
};

export const resolveSection = (section: string, item: SnPageWidgetDto, oldRef: SnPageWidgetDto) => {
    _.get(sections, section, []).map((path: string) => {
        if (path.includes('$css:')) {
            const p = `css.${_.find(generateCss(item.typeKey), (c: WidgetCssSchemaInterface) => c.style === path.split('$css:')[1]).path}`;
            _.set(item, p, _.get(oldRef, p));
        } else if (path.includes('$event:')) {
            const key = path.split('$event:')[1];
            const ev = oldRef.events.find(e => e.eventKey === key);
            const index = item.events.findIndex(e => e.eventKey === key);
            if (ev) {
                if (index !== -1) {
                    item.events.splice(index, 1, ev);
                } else {
                    item.events.push(ev);
                }
            }
        } else {
            _.set(item, path, _.get(oldRef, path));
        }

    });
};


export const setLockedProperties = (item: SnPageWidgetDto, oldRef: SnPageWidgetDto) => {
    if (oldRef.locked) {
        Object.entries(oldRef)
            .filter(([key, value]) => key !== 'displayState')
            .forEach(([key, value]) => {
                if (value != null) {
                    item[key] = value;
                }
            });
    } else {
        item.id = oldRef.id;
        if (oldRef.lockedProperties && oldRef.lockedProperties?.length > 0) {
            oldRef.lockedProperties.forEach(section => resolveSection(section, item, oldRef));
            item.lockedProperties = _.union(item.lockedProperties, oldRef.lockedProperties);
        }
    }
};
