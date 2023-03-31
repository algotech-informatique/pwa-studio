import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { SmartModelDto, SmartPropertyModelDto } from '@algotech-ce/core';
import { SnParam } from '../../modules/smart-nodes';

@Injectable()
export class SmartModelsService {

    getCompositionsModel(smartModel: SmartModelDto, smartModels: SmartModelDto[],
        modelsPreventRecursive: SmartModelDto[] = []): SmartModelDto[] {
        const compositions: SmartPropertyModelDto[] = this.getModelProperties(smartModel);

        const snModels: SmartModelDto[] =  _.reduce(compositions, (res: SmartModelDto[], c: SmartPropertyModelDto) => {
            const model: SmartModelDto = _.find(smartModels, (sm: SmartModelDto) => sm.key.toUpperCase() ===
            c.keyType.replace('so:', '').toUpperCase());
            if (model && !modelsPreventRecursive.find((sm) => sm.uuid === model.uuid)) {
                modelsPreventRecursive.push(model);
                res.push(...this.getCompositionsModel(model, smartModels, modelsPreventRecursive));
            }
            return res;
        }, []);
        snModels.unshift(smartModel);
        return _.uniqBy(snModels, 'key');
    }

    getModelsBySkill(skill: string, smartModels: SmartModelDto[]): SmartModelDto[] {
        return _.reduce(smartModels, (result: SmartModelDto[], sm: SmartModelDto) => {
            const skillKey: string = skill.replace('sk:', '');
            if (sm.skills && sm.skills[skillKey]) {
                result.push(sm);
            }
            return result;
        }, []);
    }

    getModelsByParameter(param: any, smartModels: SmartModelDto[]): SmartModelDto[] {
        const eleParam: SnParam = param as SnParam;
        const split = eleParam.key.split('.');
        if (split.length <= 1) {
            return [];
        }
        const model: SmartModelDto = _.find(smartModels, (md: SmartModelDto) => md.key === split[0]);
        if (model) {
            return this.getCompositionsModel(model, smartModels);
        }
        return [];
    }

    getModelByKey(key: string, smartModels: SmartModelDto[]): SmartModelDto {
        const model: SmartModelDto = _.find(smartModels, { key });
        return model;
    }

    private getModelProperties(snModel: SmartModelDto): SmartPropertyModelDto[] {
        return _.reduce(snModel.properties, (result: SmartPropertyModelDto[], prop: SmartPropertyModelDto) => {
            if (prop.keyType.startsWith('so:')) {
                result.push(prop);
            }
            return result;
        }, []);
    }

}
