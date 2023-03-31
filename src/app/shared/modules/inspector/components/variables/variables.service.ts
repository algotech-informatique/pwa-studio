import { Injectable } from '@angular/core';
import { SourcesVariablesDto } from './dto/sources.dto';
import { SmartModelDto, typesSys, TypeSchema, GenericListDto } from '@algotech-ce/core';
import { TypeVariable } from './dto/type-variable.dto';
import * as _ from 'lodash';
import { IconsService } from '../../../../services';
import { SnTranslateService } from '../../../smart-nodes';

@Injectable()
export class VariablesServices {

    constructor(
        private iconService: IconsService,
        private translate: SnTranslateService,
    ) {
    }

    // Traitment Sources
    returnSources(sources): SourcesVariablesDto[] {
        return Object.keys(sources)
            .map((obj) => {
                const nObj = sources[obj];
                const src: SourcesVariablesDto = {
                    key: obj,
                    multiple: nObj.multiple,
                    title: nObj.title,
                    type: nObj.type,
                    value: nObj.value
                };
                return src;
            }
            );
    }

    // Variables
    createElement(key: string, value: string,
        type: string,
        multiple: boolean): TypeVariable {
        const ele: TypeVariable = {
            key,
            value,
            color: (type === 'glist') ? this.iconService.getIconColor(type) : this.iconService.getIconColor(key),
            icon: (type === 'glist') ? this.iconService.getIcon(type).value : this.iconService.getIconByType(key).value,
            type,
            multiple
        };
        return ele;
    }

    gListBuilder(gList: GenericListDto[]): TypeVariable[] {
        const glist = _.map(gList, (generic: GenericListDto) =>
            this.createElement(generic.key, `${this.translate.transform(generic.displayName)}`, 'glist', false)
        );

        glist.unshift(this.createElement('', '', 'glist', false));
        return glist;
    }

    typeBuilder(smartModels: SmartModelDto[]): TypeVariable[] {
        const primitiveTypes = this.primitiveTypesBuilder();

        const sysTypes = [
            this.createElement('sys:file', 'File', 'sys:file', false),
            this.createElement('sys:location', 'Location', 'sys:location', false),
            this.createElement('sys:user', 'User', 'sys:user', false),
            this.createElement('sys:schedule', 'Schedule', 'sys:schedule', false),
            this.createElement('sys:comment', 'Comment', 'sys:comment', false),
            this.createElement('sys:magnet', 'Magnet', 'sys:magnet', false),
            this.createElement('sys:glistvalue', 'genericList', 'sys:glistvalue', false),
            this.createElement('sys:query', 'Query', 'sys:query', false),
        ];

        const objectTypes = this.objectTypesBuilder(smartModels);

        return primitiveTypes
            .concat(sysTypes.sort())
            .concat(objectTypes);
    }

    formDatatypeBuilder(): TypeVariable[] {
        return [this.createElement('sys:file', 'File', 'sys:file', false),
        this.createElement('string', 'string', 'primitive', false)];
    }

    filterList(sourceType, types: TypeVariable[]): TypeVariable[] {
        const filteredTypes = _.reduce(sourceType, (results, sType: string) => {
            const split = sType.split('.');
            if (split.length > 1) {
                const primi = _.filter(types, (objType: TypeVariable) => objType.type === split[0] && objType.key === split[1]);
                results.push(...primi);
            } else {
                const tps = _.filter(types, (objType: TypeVariable) => objType.type === sType);
                results.push(...tps);
            }
            return results;
        }, []);
        return filteredTypes;
    }

    primitiveTypesBuilder(): TypeVariable[] {
        const primitiveTypes = [
            this.createElement('boolean', 'boolean', 'primitive', false),
            this.createElement('number', 'number', 'primitive', false),
            this.createElement('string', 'string', 'primitive', false),
            this.createElement('date', 'date', 'primitive', false),
            this.createElement('time', 'time', 'primitive', false),
            this.createElement('datetime', 'datetime', 'primitive', false),
            this.createElement('html', 'html', 'html', false),
            this.createElement('object', 'object', 'object', false)
        ];

        return primitiveTypes.sort();
    }

    objectTypesBuilder(smartModels: SmartModelDto[]): TypeVariable[] {
        const skTypes = _.reduce(typesSys, (results, type: TypeSchema) => {
            if (type.skills) {
                results.push(this.createElement(`sk:${type.skills}`, `${type.skills}`, 'sk:', true));
            }
            return results;
        }, []);

        let types = _.map(smartModels, (model: SmartModelDto) =>
            this.createElement('so:' + model.key?.toLowerCase(), `${this.translate.transform(model.displayName)}`, 'so:', true)
        );

        types = _.sortBy(_.map(types, (type) => {
            type.valueToFilter = type.value.toUpperCase();
            return type;
        }), 'valueToFilter');

        return [this.createElement('so:*', '*', 'so:global', true)]
            .concat(skTypes.sort())
            .concat(types);
    }

}
