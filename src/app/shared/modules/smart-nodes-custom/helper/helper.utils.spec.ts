import HelperUtils from './helper.utils';
import { SmartModelDtoBuilder, SmartPropertyModelDtoBuilder } from '../../../../../../test-utils/builders';

describe(HelperUtils.name, () => {
    describe(HelperUtils.prepareDirDto.name, () => {
        it('should handle simple directory', () => {
            // WHEN
            const dto = HelperUtils.prepareDirDto('/directory');
            // THEN
            expect(dto.name).toEqual('directory');
            expect(dto.subDirectories.length).toEqual(0);
        });
        it('should handle directory with subdirectory', () => {
            // WHEN
            const dto = HelperUtils.prepareDirDto('/directory/subdirectory');
            // THEN
            expect(dto.name).toEqual('directory');
            expect(dto.subDirectories.length).toEqual(1);
            expect(dto.subDirectories[0].name).toEqual('subdirectory');
            expect(dto.subDirectories[0].subDirectories.length).toEqual(0);
        });
        it('should handle directory with N recursive subdirectories', () => {
            // WHEN
            const dto = HelperUtils.prepareDirDto('/directory/subdirectory/recursive');
            // THEN
            expect(dto.name).toEqual('directory');
            expect(dto.subDirectories.length).toEqual(1);
            expect(dto.subDirectories[0].name).toEqual('subdirectory');
            expect(dto.subDirectories[0].subDirectories.length).toEqual(1);
            expect(dto.subDirectories[0].subDirectories[0].name).toEqual('recursive');
            expect(dto.subDirectories[0].subDirectories[0].subDirectories.length).toEqual(0);
        });
    });
    describe(HelperUtils.getSmartModelProperty.name, () => {
        const models = [
            new SmartModelDtoBuilder() // main model
                .withKey('modelA')
                .withProperties([
                    new SmartPropertyModelDtoBuilder().withKey('NAME').withKeyType('string').build(),
                    new SmartPropertyModelDtoBuilder().withKey('DESCRIPTION').withKeyType('string').build(),
                    new SmartPropertyModelDtoBuilder().withKey('OBJECT').withKeyType('so:modelB').build(),
                    new SmartPropertyModelDtoBuilder().withKey('OBJECT_OF_UNKNOWN_MODEL').withKeyType('so:modelD').build()
                ]).build(),
            new SmartModelDtoBuilder() // sub model
                .withKey('modelB')
                .withProperties([
                    new SmartPropertyModelDtoBuilder().withKey('SOMEPROP').withKeyType('boolean').build(),
                    new SmartPropertyModelDtoBuilder().withKey('NESTED_OBJECT').withKeyType('so:modelC').build(),
                ]).build(),
            new SmartModelDtoBuilder() // sub-sub model
                .withKey('modelC')
                .withProperties([
                    new SmartPropertyModelDtoBuilder().withKey('THATS_DEEP').withKeyType('number').build()
                ]).build()
        ];

        it('should return the right property from model with simple key', () => {
            // WHEN
            const property = HelperUtils.getSmartModelProperty(models, 'DESCRIPTION');

            // THEN
            expect(property.key).toEqual('DESCRIPTION');
            expect(property.keyType).toEqual('string');
        });

        it('should return the right property from submodel with composed key', () => {
            // WHEN
            const property = HelperUtils.getSmartModelProperty(models, 'OBJECT.SOMEPROP');

            // THEN
            expect(property.key).toEqual('SOMEPROP');
            expect(property.keyType).toEqual('boolean');
        });

        it('should return the right property from submodel with composed key that have many levels', () => {
            // WHEN
            const property = HelperUtils.getSmartModelProperty(models, 'OBJECT.NESTED_OBJECT.THATS_DEEP');

            // THEN
            expect(property.key).toEqual('THATS_DEEP');
            expect(property.keyType).toEqual('number');
        });

        it('should throw an error if no model has been provided', () => {
            // WHEN
            expect(() => HelperUtils.getSmartModelProperty([], 'NAME')).toThrowError(/No model provided/);
        });

        it('should throw an error if simple key is not found in model', () => {
            // WHEN
            expect(() => HelperUtils.getSmartModelProperty(models, 'TOTOTUTU')).toThrowError(/Property key \[TOTOTUTU\] not found/);
        });

        it('should throw an error if composed key is not found in submodel', () => {
            // WHEN
            expect(() => HelperUtils.getSmartModelProperty(models, 'OBJECT.TOTOTUTU')).toThrowError(/Property key \[TOTOTUTU\] not found/);
        });

        it('should throw an error if composed key targets unknwon property', () => {
            // WHEN
            expect(() => HelperUtils.getSmartModelProperty(models, 'TOTO.TUTU')).toThrowError(/Property key \[TOTO\] not found/);
        });

        it('should throw an error if composed key point to a submodel that has not been provided in models list', () => {
            // WHEN
            expect(() => HelperUtils.getSmartModelProperty(
                models, 'OBJECT_OF_UNKNOWN_MODEL.SOMEPROP'
            )).toThrowError(/Unable to find model \[so:modelD\]/);
        });
    });
});
