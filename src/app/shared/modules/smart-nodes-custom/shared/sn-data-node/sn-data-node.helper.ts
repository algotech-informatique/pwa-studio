import { SmartModelDto, SmartPropertyModelDto, WorkflowVariableModelDto } from '@algotech/core';
import { SnNode, SnParam, SnSection } from '../../../smart-nodes/models';
import { NodeHelper } from '../../helper/class';
import HelperUtils from '../../helper/helper.utils';

export class SnDataNodeHelper extends NodeHelper<SnDataNodeHelper> {
    public setData(variableKey: string): SnDataNodeHelper {
        const foundVariable: WorkflowVariableModelDto = this.view.options.variables
            .find((variable: WorkflowVariableModelDto) => variable.key === variableKey);

        if (!foundVariable) {
            throw new Error(`Unknown variable key [${variableKey}] provided as data input of SnDataNode`);
        }

        this.node.key = foundVariable.key;
        this.node.params[0].key = foundVariable.key;
        this.node.params[0].types = foundVariable.type;
        this.node.params[0].multiple = foundVariable.multiple;

        return this;
    }

    public extendProperties(propertyKeys: string[]): SnDataNodeHelper {
        // TODO verify that extended properties are effectively part of the variable type set in setData()
        // I guess we can reuse what is done by SnATNodeComponent.checkModelProperties(...) ?
        if (!this.typesToType(this.dataParameter.types).startsWith('so:')) {
            throw new Error(`Impossible to extend properties, defined data parameter for SnDataNode is not an object`);
        }
        propertyKeys.forEach((propertyKey) => this.extendProperty(propertyKey));
        return this;
    }

    public getParam(key: string): SnParam {
        return super.getParam(key);
    }

    private extendProperty(propertyKey: string): void {
        // TODO handle sys:
        if (HelperUtils.isAbstractType(propertyKey)) {
            throw new Error(`Cannot extend abstract property [${propertyKey}]`);
        }

        if (this.propertiesSection.params.find(param => param.key === propertyKey)) {
            // assuming a parameter with this key that is already in the list is not to be changed
            return;
        }
        const modelKey = this.typesToType(this.dataParameter.types).replace('so:', '');
        const modelWithSubmodels: SmartModelDto[] = this.helperContext.getSmartModelWithSubModels(modelKey);
        const property = HelperUtils.getSmartModelProperty(modelWithSubmodels, propertyKey);

        this.propertiesSection.params.push({
            id: property.uuid,
            direction: 'out',
            key: property.key,
            types: property.keyType,
            multiple: property.multiple,
            pluggable: true,
        });
    }

    private get dataParameter(): SnParam {
        if (this.node.params.length === 0) {
            throw new Error('SnDataNode has no data parameter defined');
        }
        return this.node.params[0]; // TODO do we need to ensure there is only one parameter ?
    }

    private get propertiesSection(): SnSection {
        const propertiesSection = this.node.sections.find((section) => section.key === 'properties');
        if (!propertiesSection) {
            throw new Error('No properties section found in SnDataNode, it seems node has not been correctly initialized');
        }
        return propertiesSection;
    }

    private typesToType(_types: string | string[]): string { // TODO extract this in utils ?
        return Array.isArray(_types) ? _types[0] : _types;
    }
}
