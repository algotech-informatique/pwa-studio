import { Component, ChangeDetectorRef } from '@angular/core';
import { SnNodeBaseComponent } from '../../../smart-nodes';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnParam, SnSection, SnItem } from '../../../smart-nodes/models';
import { PairDto, SmartModelDto, SmartPropertyModelDto } from '@algotech/core';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnATNodeUtilsService } from './sn-at-node-utils.service/sn-at-node-utils.service';
import { SN_BASE_METADATA } from '../../../smart-nodes/components';
import * as _ from 'lodash';

@Component({
    template: SN_BASE_METADATA.template,
})
export class SnATNodeComponent extends SnNodeBaseComponent {

    type: string;
    model: string;
    originalTypes: string | string[];
    profiles: PairDto[] = [];

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected ref: ChangeDetectorRef
    ) {
        super(snActions, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.type = null;
        this.model = null;
        this.originalTypes = null;
        this.profiles = [];

        super.initialize(schema);
    }

    calculate() {
        // load icon
        const params = this.snATNodeUtils.getKeyEditParams(this.snView, this.node);
        for (const param of params) {
            param.displayState.icons = [{
                icon: this.snATNodeUtils.getIcon(param.types),
            }];
        }
        super.calculate();
    }

    protected load(list: SnItem[], propKey: string, canClear = true) {
        const selector = this.snATNodeUtils.findParamByKey(this.node, propKey);
        if (selector) {
            if (canClear && selector.multiple === false && !selector.required &&
                list && list.length > 0 && !list.some((i) => i.key === null)) {
                list.unshift({ key: null, value: '' });
            }
            selector.displayState.items = list;
        }
    }

    protected loadProfiles(profilesKey = 'profiles') {
        this.load(this.snATNodeUtils.getProfiles(this.snView), profilesKey);
    }

    protected loadModels(modelKeyProp = 'smartModel') {
        this.load(this.snATNodeUtils.getSmartModels(), modelKeyProp);
    }

    protected loadProperties(propSourceKey: string, propPropertiesKey: string, kindOfSource: 'model' | 'object') {
        // update properties
        let propertiesList: SnItem[] = [];

        let smartModel = null;
        switch (kindOfSource) {
            case 'model': {
                smartModel = this.snATNodeUtils.findValue(this.node, propSourceKey);
                propertiesList = smartModel ? this.snATNodeUtils.getProperties(smartModel) : [];
            }
                break;
            case 'object': {
                const type = this.snATNodeUtils.findType(this.snView, this.node, propSourceKey);
                if (type && type.startsWith('sys:')) {
                    propertiesList = this.snATNodeUtils.getPropertiesFromSys(type);
                } else {
                    smartModel = type ? type.replace('so:', '') : null;
                    propertiesList = smartModel ? this.snATNodeUtils.getProperties(smartModel) : [];
                }
            }
                break;
        }
        this.load(propertiesList, propPropertiesKey);
    }

    protected calculateTypeWithParam(paramKey: string) {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const type = this.snATNodeUtils.findType(this.snView, this.node, paramKey);

        if (outParam) {
            this.snActions.editParam(this.snView, this.node, outParam.param, outParam.params, 'types', type ? type : 'so:');
        }
    }

    protected calculateTypeWithModel(modelKey = 'smartModel') {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const smartModel = this.snATNodeUtils.findValue(this.node, modelKey);

        if (outParam && smartModel) {
            this.snActions.editParam(this.snView, this.node, outParam.param, outParam.params, 'types', `so:${smartModel.toLowerCase()}`);
        }
    }

    protected calculateMultipleTypeWithModel(modelKey = 'smartModel') {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const smartModel = this.snATNodeUtils.findValue(this.node, modelKey);

        if (outParam && outParam.params.length !== 0 && smartModel) {
            _.forEach(outParam.params, (prm) => {
                this.snActions.editParam(this.snView, this.node, prm, outParam.params, 'types', `so:${smartModel.toLowerCase()}`);
            });
        }
    }

    protected calculateMultiple(multipleKey = 'multiple') {
        const outParam = this.snATNodeUtils.getOutParam(this.node);
        const multiple = this.snATNodeUtils.findValue(this.node, multipleKey) ? true : false;

        if (outParam) {
            this.snActions.editParam(this.snView, this.node, outParam.param, outParam.params, 'multiple', multiple);
        }
    }

    protected calculateTags(options: string[], objectLinkedKey: string) {
        // update type
        const activeTag = this.snATNodeUtils.findValue(this.node, 'activeTag') ? true : false;
        const modelsTag = this.snATNodeUtils.findParamByKey(this.node, 'modelsTag');

        if (modelsTag) {
            modelsTag.displayState.hidden = !activeTag;
        }

        if (!activeTag) {
            return;
        }

        // update tags model
        const type = this.snATNodeUtils.findType(this.snView, this.node, objectLinkedKey);
        this.load(this.snATNodeUtils.getModelTags(type ? type : 'so:', options), 'modelsTag');
    }

    protected addProperties(params: SnParam[], sectionKey?: string) {
        const section: SnSection = sectionKey ? this.getSection(sectionKey) : this.node.sections[0];
        if (section && section.params) {
            this.snActions.addParam(this.snView, this.node, params, section.params);
        }
    }

    protected removeProperties(propertiesKey: string[], sectionKey?: string) {
        const section: SnSection = sectionKey ? this.getSection(sectionKey) : this.node.sections[0];
        if (section && section.params) {
            const params = _.filter(section.params, (p: SnParam) => propertiesKey.includes(p.key));
            this.snActions.removeParams(this.snView, params, section.params);
        }
    }

    /*
        properties
    */

    protected loadModelsByType(
        typeModel: string | string[],
        options: { sectionKeyProp: string; modelKeyProp: string; composedModel: boolean }
    ) {
        const model: string = _.isArray(typeModel) ? typeModel[0] : typeModel as string;
        let items: SnItem[];
        if (model === 'so:*') {
            items = this.snATNodeUtils.getSmartModels();
        } else if (model && model.startsWith('sk:')) {
            items = this.snATNodeUtils.getSmartModelsBySkills(model);
        } else {
            items = this.snATNodeUtils.getSmartModelsByModel(model, options.composedModel);
        }

        // load icon
        const section = this.node.sections.find((s) => s.key === options.sectionKeyProp);
        if (section) {
            items = _.map(items, (item: SnItem) => {
                if (section.params.find((p) => p.key.startsWith(`${item.key}.`))) {
                    return {
                        key: item.key,
                        value: item.value,
                        icon: 'fa-solid fa-circle-dot'
                    };
                }
                return item;
            });

            items = _.sortBy(items, 'icon');
        }
        this.load(items, options.modelKeyProp, false);

        const selector = this.snATNodeUtils.findParamByKey(this.node, options.modelKeyProp);
        if (selector && selector.displayState.items) {
            const filterItems = _.filter(selector.displayState.items, (item) => item.key);
            selector.displayState.hidden = filterItems.length <= 1;
            if (selector.displayState.hidden && filterItems[0]) {
                selector.value = filterItems[0].key;
                this.model = filterItems[0].key;
            } else if (!selector.displayState.hidden && options.composedModel && !this.model &&
                model.startsWith('so') && model !== 'so:*') {
                selector.value = model.slice(3);
                this.model = model.slice(3);
            }
        }
    }

    protected checkTypes(sectionKey: string, types: string | string[], options: { multiModelMode: boolean }) {
        if (this.originalTypes && types !== this.originalTypes) {
            const section: SnSection = this.getSection(sectionKey);
            if (section) {
                if (options.multiModelMode) {
                    for (const param of section.params) {
                        param.displayState.hidden = true;
                    }
                }
            }
            if (options.multiModelMode) {
                this.model = null;
                const selector = this.snATNodeUtils.findParamByKey(this.node, 'smartModel');
                if (selector) {
                    selector.displayState.selected = null;
                    selector.value = null;
                }
            }
        } else if (options.multiModelMode) {
            this.model = this.snATNodeUtils.findValue(this.node, 'smartModel');
        }
    }

    protected updateSelectedProperties(sectionKey: string): string[] {
        const section: SnSection = this.getSection(sectionKey);
        return section && section.params ? _.map(section.params, (param: SnParam) => param.key) : [];
    }

    protected updateType(types: string | string[], options: { hasSkill: boolean; typeIsFormated: boolean }) {
        this.type = null;
        let isSkill = false;

        if (!options.typeIsFormated) {
            const type: string = _.isArray(types) ? types[0] as string : types as string;
            if (type) {
                isSkill = options.hasSkill && type.startsWith('sk:');
                const soRegex = /^so:[^*]/i;
                if (soRegex.test(type)) { this.type = type.slice(3); }
                if (type.startsWith('sys:') || isSkill) { this.type = type; }
            }
        } else {
            this.type = types as string;
        }
    }

    protected hideSection(sectionKey: string, options: { multiModelMode: boolean }) {
        const section: SnSection = this.getSection(sectionKey);
        section.hidden = this.type ? false : true;
        if (options.multiModelMode) {
            if (this.model && section && section.params) {
                section.hidden = false;
                for (const param of section.params) {
                    param.displayState.hidden = this.getModel(param.key) !== this.model;
                }
            } else if (!this.model && section) {
                section.hidden = true;
            }
        }
    }

    protected checkModelProperties(types: string | string[], sectionKey: string, isComposedKey?: boolean, isCreateNode?: boolean) {
        let type: string = _.isArray(types) ? types[0] as string : types as string;
        if (!type.startsWith('so:') && !isCreateNode) { return; }
        type = isCreateNode ? type : type.replace('so:', '');

        const model: SmartModelDto = this.snATNodeUtils.getSmartModel(type);
        const section: SnSection = this.node.sections.find((s) => s.key === sectionKey);
        if (!section || !model) { return; }

        let notify = false;
        for (const param of section.params) {
            const property: SmartPropertyModelDto = _.find(
                model.properties, { key: isComposedKey ? param.key.replace(`${type}.`, '') : param.key });
            if (property && property.keyType !== param.types) {
                notify = true;
                param.types = property.keyType;
            }
            if (notify) {
                this.snActions.notifyNode('chg', this.snView, this.node);
            }
        }
    }

    private getSection(sectionKey: string): SnSection {
        const section: SnSection = this.node.sections.find((s) => s.key === sectionKey);
        if (!section) {
            throw new Error(`sectionKey ${sectionKey} not find`);
        }
        return section;
    }

    private getModel(key: string): string {
        const index: number = key.indexOf('.');
        return key.substring(0, index);
    }
}

