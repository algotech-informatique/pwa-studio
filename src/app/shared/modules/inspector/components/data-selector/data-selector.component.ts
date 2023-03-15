import { SessionsService } from './../../../../services/sessions/sessions.service';
import { PairDto, typesSys, TypeSchema, SmartPropertyModelDto, SmartModelDto } from '@algotech/core';
import { IconsService } from './../../../../services/icons/icons.service';
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit,
    OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { WidgetInput } from '../../../app-custom/dto/widget-input.dto';
import { map } from 'rxjs/operators';
import { DataSelectorResult } from '../../dto/data-selector-result.dto';

interface GroupPropertiesShowed {
    key: string;
    displayName: string;
    properties: PropertyDisplay[];
    hidden: boolean;
}

interface PropertyDisplay {
    property: Property;
    icon: string;
    parent: PropertyDisplay;
    children: PropertyDisplay[];
    item: WidgetInput;
    disabled: boolean;
    hidden: boolean;
}

interface Property {
    key: string;
    type: string;
    uuid: string;
    multiple: boolean;
    name: string;
    category: string;
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'data-selector',
    templateUrl: './data-selector.component.html',
    styleUrls: ['./data-selector.component.scss'],
})
export class DataSelectorComponent implements OnChanges, AfterViewInit {

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('list') list: ElementRef;
    @Input() show: boolean;
    @Input() items: Observable<WidgetInput[]>;
    @Input() expectedTypes = ['string'];
    @Input() expectedMultiple = false;
    @Input() multiNoStrict = false;
    @Output() selectedData = new EventEmitter<DataSelectorResult>();

    search: string;
    propertiesDisplay: PropertyDisplay[] = [];
    propertiesShowed: { parent: PropertyDisplay; group: GroupPropertiesShowed[] };

    constructor(
        private iconsService: IconsService,
        private sessionsService: SessionsService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.show?.currentValue) {
            this.initItems().subscribe();
            this.updatePropertiesShowed(null, this.propertiesDisplay);
        }
    }

    ngAfterViewInit() {
        setTimeout(() => {
            this.focusSearch();
        }, 100);
    }

    resetSearch() {
        this.search = null;
        for (const group of this.propertiesShowed.group) {
            group.hidden = false;
            for (const property of group.properties) {
                property.hidden = false;
            }
        }
        this.focusSearch();
    }

    clickItem(group: string, propertyDisplay: PropertyDisplay) {
        if (group === 'widget') {
            this._loadWidget(propertyDisplay.item, false);
        }
        if (!this.isPropertyDisabled(propertyDisplay.property.type as string, propertyDisplay.property.multiple)) {
            const path = !propertyDisplay.item.category ? `{{${this.generatePropKey(propertyDisplay)}}}` :
                `{{${propertyDisplay.item.category}.${this.generatePropKey(propertyDisplay)}}}`;
            this.selectedData.emit({ path, type: propertyDisplay.property.type, multiple: propertyDisplay.property.multiple });
        }
    }

    onSearch() {
        for (const group of this.propertiesShowed.group) {
            for (const property of group.properties) {
                property.hidden = !_.includes(property.property.name.toLowerCase(), this.search.toLowerCase());
            }
            group.hidden = group.properties.every((p) => p.hidden);
        }
    }

    onMouseOver(group: string, property: PropertyDisplay) {
        switch (group) {
            case 'widget':
                this._loadWidget(property.item, true);
                break;
            default:
                break;
        }
    }

    onMouseOut(group: string, property: PropertyDisplay) {
        switch (group) {
            case 'widget':
                this._loadWidget(property.item, false);
                break;
            default:
                break;
        }
    }

    _loadWidget(widget: WidgetInput, show: boolean) {
        widget.ref.displayState.highlight = show;
    }

    clickSubItem(group: string, propertyDisplay: PropertyDisplay) {
        this.onMouseOut(group, propertyDisplay);
        this.updatePropertiesShowed(propertyDisplay, propertyDisplay.children);
        this.search = '';
        this.focusSearch();
    }

    back() {
        this.search = '';
        const grandParent: PropertyDisplay = this.propertiesShowed.parent ? this.propertiesShowed.parent.parent : null;
        const propertiesToShow: PropertyDisplay[] = _.filter(this.getAllProperties(this.propertiesDisplay), (p: PropertyDisplay) =>
            grandParent ?
                p.parent ? p.parent.property.uuid === grandParent.property.uuid : false :
                p.parent === null
        );
        this.updatePropertiesShowed(grandParent, propertiesToShow);
        this.resetSearch();
    }

    private generatePropKey(propertyDisplay: PropertyDisplay): string {
        let key: string = propertyDisplay.property.key;
        if (propertyDisplay.property.category === 'widget') {
            return key;
        }
        let parentProperty: PropertyDisplay = propertyDisplay.parent;
        while (parentProperty) {
            key = parentProperty.property.key.concat('.', key);
            parentProperty = parentProperty.parent;
        }
        return key;
    }

    private getAllProperties(properties: PropertyDisplay[]): PropertyDisplay[] {
        return _.reduce(properties, (res: PropertyDisplay[], p: PropertyDisplay) => {
            res = _.concat(res, p);
            if (p.children) { res = _.concat(res, this.getAllProperties(p.children)); }
            return res;
        }, []);
    }

    private initItems() {
        return this.items.pipe(
            map((items: WidgetInput[]) =>
                _.map(items, (item: WidgetInput) => {
                    const propertyDisplay: PropertyDisplay = {
                        property: {
                            key: item.key,
                            type: item.type,
                            uuid: item.key,
                            multiple: item.multiple,
                            name: item.name,
                            category: item.category,
                        },
                        icon: this.iconsService.getIconByType(item.type)?.value,
                        parent: null,
                        children: null,
                        item,
                        disabled: this.isPropertyDisabled(item.type, item.multiple),
                        hidden: false,
                    };
                    if (item.type.startsWith('sys:') || (item.type.startsWith('so:') && !this.arePropertiesInfinite(propertyDisplay))) {
                        propertyDisplay.children = this.generateDisplay(item.model, propertyDisplay, null);
                    }
                    return propertyDisplay;
                }),
            ),
            map((properties: PropertyDisplay[]) => {
                this.propertiesDisplay = properties;
                this.updatePropertiesShowed(null, this.propertiesDisplay);
            }),
        );
    }

    private updatePropertiesShowed(parent: PropertyDisplay, properties: PropertyDisplay[]) {

        const groupKeys =  _.uniq(
            properties.map((p) => p.property.category)
        );
        const group: GroupPropertiesShowed[] = groupKeys.map((item) => ({
            key: item,
            properties: properties.filter((p) => p.property.category === item),
            hidden: false,
        }));

        this.propertiesShowed = { parent, group };
        if (this.list) { this.list.nativeElement.scrollTo(0, 0); }
    }

    private arePropertiesInfinite(propertyDisplay: PropertyDisplay): boolean {
        let parent: PropertyDisplay = propertyDisplay.parent;
        let infinite = false;
        while (parent && !infinite) {
            infinite = parent.property.type === propertyDisplay.property.type;
            parent = parent.parent;
        }
        return infinite;
    }

    private generateDisplay(type: string, parent: PropertyDisplay, children: any): PropertyDisplay[] {
        const isSys: boolean = !type || type?.startsWith('sys:');
        const model: TypeSchema | SmartModelDto = isSys ?
            _.find(typesSys, { type }) :
            _.find(this.sessionsService.active.datas.read.smartModels, { key: type });
        if (model || children) {
            const props: Property[] = this.generateProperties(model, children, isSys);
            return this.generatePropertiesDisplay(props, parent);
        }
    }

    private generateProperties(model: any, children: any, isSys: boolean): Property[] {
        let properties: Property[];
        if (isSys) {
            const prps: PairDto[] = this.toPairDto(children ? children : (model as TypeSchema).schema);
            properties = _.map(prps, (p: PairDto) =>
                ({
                    key: p.key,
                    uuid: p.key,
                    type: p.value,
                    multiple: _.isArray(p.value),
                    name: p.key,
                })
            );
        } else {
            const prps: SmartPropertyModelDto[] = (model as SmartModelDto).properties;
            properties = _.map(prps, (p: SmartPropertyModelDto) =>
                ({
                    key: p.key,
                    uuid: p.uuid,
                    type: p.keyType,
                    multiple: p.multiple,
                    name: p.key,
                })
            );
        }
        return properties;
    }

    private generatePropertiesDisplay(properties: Property[], parent: PropertyDisplay): PropertyDisplay[] {
        return _.map(properties, (property: Property) => {
            if (!_.isArray(property.type) && _.isObject(property.type)) {
                const propertyDisplay: PropertyDisplay = {
                    property,
                    icon: null,
                    parent,
                    children: null,
                    item: parent.item,
                    disabled: true,
                    hidden: false,
                };
                propertyDisplay.children = this.generateDisplay(null, propertyDisplay, property.type);
                return propertyDisplay;
            } else {
                const type: string = _.isArray(property.type) ? property.type[0] : property.type as string;
                const isSo = type.startsWith('so:');
                const icon = this.iconsService.getIconByType(type);
                const propertyDisplay: PropertyDisplay = {
                    property,
                    icon: icon ? icon.value : null,
                    parent,
                    children: null,
                    item: parent.item,
                    disabled: this.isPropertyDisabled(type, property.multiple),
                    hidden: false,
                };
                if (!property.multiple && isSo && type !== 'so:*' && !this.arePropertiesInfinite(propertyDisplay)) {
                    propertyDisplay.children = this.generateDisplay(type.slice(3), propertyDisplay, null);
                }
                return propertyDisplay;
            }
        });
    }

    private toPairDto(data: any): PairDto[] {
        return Object.entries(data).map(([key, value]) => ({ key, value }));
    }

    private isPropertyDisabled(type: string, multiple: boolean) {
        const multipleConform = this.multiNoStrict ? true : multiple === null || multiple === undefined ||
            this.expectedMultiple === multiple;
        if (this.expectedTypes?.length > 0) {
            return !this.expectedTypes.some((expectedType: string) => {
                if (expectedType?.startsWith('sk:')) {
                    if (type === 'so:*') {
                        return multipleConform;
                    } else if (type.startsWith('so:')) {
                        const model: SmartModelDto = _.find(this.sessionsService.active.datas.read.smartModels, { key: type.slice(3) });
                        if (model && model.skills[expectedType.slice(3)] !== null) {
                            return model.skills[expectedType.slice(3)] && multipleConform;
                        }
                    }
                } else if (expectedType === 'string') {
                    return _.includes(['string', 'date', 'datetime', 'time', 'number', 'boolean'], type) && multipleConform;
                } else if (expectedType === 'sys:*') {
                    if (type === 'sys:*' || type.startsWith('sys:')) {
                        return multipleConform;
                    }
                }
                return ((type === expectedType) || (expectedType === 'so:*' && type.startsWith('so:'))) && multipleConform;
            });
        } else if (this.expectedMultiple) {
            return multiple !== null && multiple !== undefined && !multiple;
        }
    }

    private focusSearch() {
        if (this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

}
