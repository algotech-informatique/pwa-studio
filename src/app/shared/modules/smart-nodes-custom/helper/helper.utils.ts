import { EnvironmentDirectoryDto, SmartModelDto, SmartPropertyModelDto } from '@algotech/core';
import { UUID } from 'angular2-uuid';

export default class HelperUtils {
    private constructor() { }
    static prepareDirDto(dir: string): EnvironmentDirectoryDto {
        // FIXME should we handle dirs recursively ? - currently assuming there is maximum 1 sub directory only
        if (dir.startsWith('/')) {
            dir = dir.slice(1);
        }
        const dirs = dir.split('/');
        const flatDirectories = dirs.map((dirName) => ({
            uuid: UUID.UUID(),
            name: dirName,
            subDirectories: []
        }));
        for (let i = flatDirectories.length - 1; i > 0; i--) {
            flatDirectories[i-1].subDirectories.push(flatDirectories[i]);
        }

        return flatDirectories[0];
    }

    static getSmartModelProperty(modelWithSubModels: SmartModelDto[], propertyKey: string): SmartPropertyModelDto {
        if(!modelWithSubModels || modelWithSubModels.length === 0) {
            throw new Error(`No model provided, impossible to find property`);
        }
        if(propertyKey.includes('.')) {
            const bits = propertyKey.split('.');
            let concernedModel = modelWithSubModels[0];
            for(let i = 0; i < bits.length; i++) {
                const composedProperty = concernedModel.properties.find((prop) => prop.key === bits[i]);
                if (!composedProperty) {
                    throw new Error(`Property key [${bits[i]}] not found in smartmodel [${concernedModel.key}]`);
                }
                if(i === bits.length - 1) {
                    if (this.isSO(composedProperty.keyType)) {
                        throw new Error(`Composed property key [${propertyKey}] is targetting a smartmodel [${concernedModel.key}],
                                        not a primitive`); // TODO is it really an error ? can we extend props that are smartobject ?
                    }
                    return composedProperty;
                } else {
                    concernedModel = modelWithSubModels.find((model) => 'so:' + model.key === composedProperty.keyType);
                    if (!concernedModel) {
                        throw new Error(
                     `Unable to find model [${composedProperty.keyType}] while it is type of the requested composed key part [${bits[i]}]`
                        );
                    }
                }
            }
        } else {
            const property = modelWithSubModels[0].properties.find((modelProp) => modelProp.key === propertyKey);
            if (!property) {
                throw new Error(`Property key [${propertyKey}] not found in smartmodel [${modelWithSubModels[0].key}]`);
            }
            return property;
        }
    }

    // TODO extract following util methods into a single smart model utils ?
    // or use those in @algotech/business ? (but how to use them outside interpretor)
    static isSO(type: string): boolean {
        return type.startsWith('so:');
    }

    static isSK(type: string): boolean {
        return type.startsWith('sk:');
    }

    static isAnySO(type: string): boolean {
        return type === 'so:*';
    }

    static isAbstractType(type: string): boolean {
        return this.isAnySO(type) || this.isSK(type);
    }
}
