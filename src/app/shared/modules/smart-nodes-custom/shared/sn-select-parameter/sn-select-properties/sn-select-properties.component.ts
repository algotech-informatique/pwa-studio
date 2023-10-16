import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SmartModelDto, SmartPropertyModelDto, typesSys, TypeSchema } from '@algotech-ce/core';
import { SessionsService, IconsService } from '../../../../../services';
import * as _ from 'lodash';
import { SnParam, SnView } from '../../../../smart-nodes/models';
import { PairDto } from '@algotech-ce/core';
import { UUID } from 'angular2-uuid';

interface PropertyDisplay {
    property: Property;
    icon: string;
    selected: boolean;
    parent: PropertyDisplay;
    children: PropertyDisplay[];
}

interface Property {
    key: string;
    keyType: string | string[];
    uuid: string;
    multiple: boolean;
    name: string;
}

@Component({
    selector: 'sn-select-properties',
    templateUrl: './sn-select-properties.component.html',
    styleUrls: ['./sn-select-properties.component.scss']
})
export class SnSelectPropertiesComponent implements OnChanges, AfterViewInit {

    @ViewChild('list') list: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;

    @Input() type: string;
    @Input() selectedProperties: string[];
    @Input() nestable = true;
    @Input() snView: SnView;
    @Input() pluggable = true;
    @Input() direction: 'in' | 'out' = 'out';
    @Input() displayable = true;
    @Input() skillsMode = false;
    @Input() multiModelMode = null;
    @Input() multiSelection = true;
    @Input() filter;
    @Input() showSysDate = false;

    _top: any = null;

    @Input()
    get top() {
        return this._top;
    }
    set top(data) {
        this._top = data;
        this.topChange.emit(data);
    }
    @Output() topChange = new EventEmitter();

    @Output() addProperties = new EventEmitter<SnParam[]>();
    @Output() removeProperties = new EventEmitter<string[]>();

    propertiesDisplay: PropertyDisplay[] = [];
    propertiesShowed: { parent: PropertyDisplay; properties: PropertyDisplay[] };
    allSelected: boolean;
    isSys: boolean;
    isSkill: boolean;
    icons: PairDto[];
    search = '';
    filterProperties: PropertyDisplay[];

    constructor(
        private sessionsService: SessionsService,
        private iconsService: IconsService,
        private ref: ChangeDetectorRef,
    ) {
        this.icons = this.iconsService.loadListIcons();
    }

    ngOnChanges() {
        this.isSys = this.type && _.isString(this.type) && this.type.startsWith('sys:');
        this.isSkill = this.type && _.isString(this.type) && this.type.startsWith('sk:');
        this.propertiesDisplay = this._generateDisplay(this.type, null, null);
        this._updatePropertiesShowed(null, this.propertiesDisplay);
    }

    ngAfterViewInit() {
        this.focusSearch();
    }

    _generateDisplay(type: string, parent: PropertyDisplay, children: any): PropertyDisplay[] {
        const model: TypeSchema | SmartModelDto = this.isSys ?
            _.find(typesSys, { type }) :
            _.find(this.sessionsService.active.datas.read.smartModels, { key: type });
        if (model || children || this.isSkill) {
            let props: Property[];
            if (!this.skillsMode) {
                props = this._generateProperties(model, children);
            } else {
                props = this._generateSkills(model as SmartModelDto);
            }
            if (this.showSysDate) {
                props.push(...this._addSysDate());
            }
            return this._generatePropertiesDisplay(props, parent);
        }
    }

    _addSysDate(): Property[] {
        return [
            {
                key: 'sys:createdDate',
                uuid: 'sys:createdDate',
                keyType: 'datetime',
                multiple: false,
                name: 'sys:createdDate'
            },
            {
                key: 'sys:updateDate',
                uuid: 'sys:updateDate',
                keyType: 'datetime',
                multiple: false,
                name: 'sys:updateDate'
            },
        ];
    }

    _getIcon(type: string) {
        const isList = _.isString(type) ? type.startsWith('lst:') : false;
        return isList ? { value: 'fa-solid fa-list' } : _.find(this.icons, { key: type });
    }

    _toPairDto(data: any): PairDto[] {
        return Object.entries(data).map(([key, value]) => ({ key, value }));
    }

    _generateProperties(model: any, children: any): Property[] {
        let properties: Property[];
        if (this.isSys) {
            const _properties: PairDto[] = this._toPairDto(children ? children : (model as TypeSchema).schema);
            properties = _.map(_properties, (p: PairDto) => {
                return {
                    key: p.key,
                    uuid: p.key,
                    keyType: _.isArray(p.value) && p.value.length === 1 ? p.value[0] : p.value,
                    multiple: _.isArray(p.value),
                    name: p.key,
                };
            });
        } else {
            const _properties: SmartPropertyModelDto[] = (model as SmartModelDto).properties;
            properties = _.compact(_.map(_properties, (p: SmartPropertyModelDto) => {
                if (this.filter && !this.filter.includes(p.keyType)) {
                    return null;
                }
                return {
                    key: p.key,
                    uuid: p.uuid,
                    keyType: p.keyType,
                    multiple: p.multiple,
                    name: p.key,
                };
            }));
        }
        return properties;
    }

    _generateSkills(model: SmartModelDto): Property[] {
        let skills: Property[];
        const _skills: PairDto[] = model ? this._toPairDto(model.skills) : [{ key: this.type.slice(3), value: true }];
        skills = _.reduce(_skills, (res: Property[], s: PairDto) => {
            if (s.value) {
                const find = _.find(typesSys, { skills: s.key });
                res.push({
                    key: s.key,
                    uuid: s.key,
                    keyType: ['sk:' + s.key, find.type],
                    multiple: (s.key === 'atDocument') ? null : false,
                    name: s.key,
                });
            }
            return res;
        }, []);
        return skills;
    }

    _generatePropertiesDisplay(properties: Property[], parent: PropertyDisplay): PropertyDisplay[] {
        return _.map(properties, (property: Property) => {
            const keyType: string = _.isArray(property.keyType) ? property.keyType[0] : property.keyType as string;
            const isSo = !this.isSys && keyType.startsWith('so:');
            const icon = isSo ? { value: 'fa-solid fa-cube' } : this._getIcon(keyType);
            const propertyDisplay: PropertyDisplay = {
                property,
                icon: icon ? icon.value : null,
                selected: false,
                parent,
                children: null,
            };
            if (!property.multiple) {
                if (isSo && keyType !== 'so:*' && this.nestable && !this._arePropertiesInfinite(propertyDisplay)) {
                    propertyDisplay.children = this._generateDisplay(keyType.slice(3), propertyDisplay, null);
                } else if (_.isObject(keyType)) {
                    propertyDisplay.children = this._generateDisplay(null, propertyDisplay, keyType);
                }
            }
            return propertyDisplay;
        });
    }

    toggleProperty(propertyDisplay: PropertyDisplay) {
        if (!propertyDisplay.children) {
            this.toggleCheckbox(propertyDisplay);
            if (!this.multiSelection) { this.top = null; }
        } else {
            this._updatePropertiesShowed(propertyDisplay, propertyDisplay.children);
            this.search = '';
            this.focusSearch();
        }
    }

    toggleCheckbox(propertyDisplay: PropertyDisplay) {
        if (!propertyDisplay.selected) {
            this._addProperties([propertyDisplay]);
        } else {
            this._removeProperties([propertyDisplay]);
        }
    }

    _getAllProperties(properties: PropertyDisplay[]): PropertyDisplay[] {
        return _.reduce(properties, (res: PropertyDisplay[], p: PropertyDisplay) => {
            res = _.concat(res, p);
            if (p.children) { res = _.concat(res, this._getAllProperties(p.children)); }
            return res;
        }, []);
    }

    toggleAll() {
        const properties: PropertyDisplay[] = this.filterProperties;
        if (this.allSelected) {
            this._removeProperties(properties);
        } else {
            this._addProperties(properties);
        }
    }

    _addProperties(propertiesDisplay: PropertyDisplay[]) {
        const paramsToAdd: SnParam[] = [];
        propertiesDisplay = _.map(propertiesDisplay, (p: PropertyDisplay) => {
            p.selected = true;
            if (!_.find(this.selectedProperties, (key: string) => key === this._generatePropKey(p))) {
                const param: SnParam = {
                    id: UUID.UUID(),
                    direction: this.direction,
                    key: this._generatePropKey(p),
                    toward: null,
                    types: p.property.keyType,
                    multiple: p.property.multiple,
                    pluggable: this.pluggable,
                    displayState: {},
                    displayName: this.multiModelMode ? p.property.key : null,
                };
                if (this.displayable) {
                    param.display = 'input';
                    if (param.types === 'boolean') {
                        param.value = false;
                    }
                }
                this.selectedProperties.push(param.key);
                paramsToAdd.push(param);
            }
            return p;
        });
        this.addProperties.emit(paramsToAdd);
        this._toggleSuperCheckbox();
    }

    _removeProperties(propertiesDisplay: PropertyDisplay[]) {
        propertiesDisplay = _.map(propertiesDisplay, (p: PropertyDisplay) => {
            p.selected = false;
            return p;
        });
        const keys = _.map(propertiesDisplay, (p: PropertyDisplay) => this._generatePropKey(p));
        this.selectedProperties = _.filter(this.selectedProperties, (p) => {
            return keys.indexOf(p) === -1;
        });
        this.removeProperties.emit(keys);
        this.allSelected = false;
    }

    _generatePropKey(propertyDisplay: PropertyDisplay): string {
        let key: string = this.multiModelMode ? this.multiModelMode + '.' + propertyDisplay.property.key : propertyDisplay.property.key;
        let parentProperty: PropertyDisplay = propertyDisplay.parent;
        while (parentProperty) {
            key = parentProperty.property.key.concat('.', key);
            parentProperty = parentProperty.parent;
        }
        return key;
    }

    _updatePropertiesShowed(parent: PropertyDisplay, properties: PropertyDisplay[]) {
        this.propertiesShowed = { parent, properties };
        this.propertiesShowed.properties = _.map(this.propertiesShowed.properties, (propertyDisplay: PropertyDisplay) => {
            propertyDisplay.selected = _.findIndex(this.selectedProperties, (p: string) => {
                return p === this._generatePropKey(propertyDisplay);
            }) > -1;

            return propertyDisplay;
        });
        this.filterProperties = this.propertiesShowed.properties;
        this._toggleSuperCheckbox();
        if (this.list) { this.list.nativeElement.scrollTo(0, 0); }
    }

    close() {
        this.top = null;
    }

    back() {
        this.search = '';
        this.focusSearch();
        const grandParent: PropertyDisplay = this.propertiesShowed.parent ? this.propertiesShowed.parent.parent : null;
        const propertiesToShow: PropertyDisplay[] = _.filter(this._getAllProperties(this.propertiesDisplay), (p: PropertyDisplay) => {
            return grandParent ?
                p.parent ? p.parent.property.uuid === grandParent.property.uuid : false :
                p.parent === null;
        });
        this._updatePropertiesShowed(grandParent, propertiesToShow);
    }

    _toggleSuperCheckbox() {
        this.allSelected = this.filterProperties.length === 0 ?
            false :
            _.findIndex(this.filterProperties, (p: PropertyDisplay) => p.selected === false) === -1;
    }

    _arePropertiesInfinite(propertyDisplay: PropertyDisplay): boolean {
        let parent: PropertyDisplay = propertyDisplay.parent;
        let infinite = false;
        while (parent && !infinite) {
            infinite = parent.property.keyType === propertyDisplay.property.keyType;
            parent = parent.parent;
        }
        return infinite;
    }

    onSearch() {
        this.filterProperties = _.reduce(this.propertiesShowed.properties,
            (res: PropertyDisplay[], propertyDisplay: PropertyDisplay) => {
                if (_.includes(propertyDisplay.property.name.toLowerCase(), this.search.toLowerCase())) {
                    res.push(propertyDisplay);
                }
                return res;
            }, []);
        this._toggleSuperCheckbox();
        this.ref.detectChanges();
    }

    private focusSearch() {
        if (this.searchInput) {
            this.searchInput.nativeElement.focus();
        }
    }

}
