import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import _ from 'lodash';
import { PatchesService } from './patches.service';
import { AppModule } from '../../../app.module';
import { SnPageDtoBuilder, SnPageWidgetDtoBuilder } from '../../../../../test-utils/builders';
import { SnModelDtoBuilder } from '../../../../../test-utils/builders/SnModelDto.builder';
import { PatchPropertyDto, SnModelDto } from '@algotech/core';

describe(PatchesService.name, () => {
    let patchesService: PatchesService;
    let page: SnPageDtoBuilder;
    let pageCompare: SnPageDtoBuilder;
    let snModel: SnModelDtoBuilder;
    let snModelCompare: SnModelDtoBuilder;

    let patches: PatchPropertyDto[];
    let reverse: PatchPropertyDto[];

    beforeAll(() => {
        TestBed.configureTestingModule({ imports: [SharedModule.forRoot(), AppModule] });
        patchesService = TestBed.inject(PatchesService);
    });

    beforeEach(() => {
        page = new SnPageDtoBuilder();
        pageCompare = new SnPageDtoBuilder();

        snModel = new SnModelDtoBuilder();
        snModelCompare = new SnModelDtoBuilder();
    });

    afterEach(() => {
        const origin: SnModelDto = snModelCompare.toPlainObject();
        const originCopy: SnModelDto = snModelCompare.toPlainObject();
        const model: SnModelDto = snModel.toPlainObject();

        // patches
        patchesService.recomposeSNModel(origin, patches);
        expect(origin).toEqual(model);

        // reverse
        patchesService.recomposeSNModel(origin, reverse);
        expect(origin).toEqual(originCopy);
    });

    it(PatchesService.prototype.generateZIndexPatches.name + ' should return patches', () => {
        // WHEN
        const widgets = [
            new SnPageWidgetDtoBuilder('1').toPlainObject(),
            new SnPageWidgetDtoBuilder('2').toPlainObject(),
            new SnPageWidgetDtoBuilder('3').toPlainObject(),
            new SnPageWidgetDtoBuilder('4').toPlainObject(),
            new SnPageWidgetDtoBuilder('5').toPlainObject(),
            new SnPageWidgetDtoBuilder('6').toPlainObject(),
            new SnPageWidgetDtoBuilder('7').toPlainObject(),
            new SnPageWidgetDtoBuilder('8').toPlainObject(),
        ];
        const compare = [
            new SnPageWidgetDtoBuilder('4').toPlainObject(),
            new SnPageWidgetDtoBuilder('2').toPlainObject(),
            new SnPageWidgetDtoBuilder('1').toPlainObject(),
            new SnPageWidgetDtoBuilder('3').toPlainObject(),
            new SnPageWidgetDtoBuilder('8').toPlainObject(),
            new SnPageWidgetDtoBuilder('6').toPlainObject(),
            new SnPageWidgetDtoBuilder('5').toPlainObject(),
            new SnPageWidgetDtoBuilder('7').toPlainObject(),
        ];

        snModel.withPage(page.withWidgets(widgets).build());
        snModelCompare.withPage(pageCompare.withWidgets(compare).build());

        const path = `pages/[id:1234]/widgets`;
        patches = patchesService.generateZIndexPatches('aaa', widgets, compare, path);
        reverse = patchesService.generateZIndexPatches('aaa', compare, widgets, path);
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches when (zIndex)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('1').build(),
                new SnPageWidgetDtoBuilder('2').build(),
                new SnPageWidgetDtoBuilder('3').build(),
                new SnPageWidgetDtoBuilder('4').build(),
                new SnPageWidgetDtoBuilder('5').build(),
                new SnPageWidgetDtoBuilder('6').build(),
                new SnPageWidgetDtoBuilder('7').build(),
            ]).build()
        );
        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('4').build(),
                new SnPageWidgetDtoBuilder('7').build(),
                new SnPageWidgetDtoBuilder('5').build(),
                new SnPageWidgetDtoBuilder('2').build(),
                new SnPageWidgetDtoBuilder('3').build(),
                new SnPageWidgetDtoBuilder('1').build(),
                new SnPageWidgetDtoBuilder('6').build(),
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches when (add and remove)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('1').build(),
                new SnPageWidgetDtoBuilder('2').build(),
                new SnPageWidgetDtoBuilder('4').build(), // add (2)
            ]).build()
        );
        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('1').build(),
                new SnPageWidgetDtoBuilder('2').build(),
                new SnPageWidgetDtoBuilder('3').build(), // remove (1)
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove',
            'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches (insert and remove)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('2').build(), // insert (3)
                new SnPageWidgetDtoBuilder('4').build(), // insert (4)
                new SnPageWidgetDtoBuilder('5').build(), // insert (5)
                new SnPageWidgetDtoBuilder('6').build(),
                new SnPageWidgetDtoBuilder('7').build(), // insert (6)
                new SnPageWidgetDtoBuilder('8').build(),
                new SnPageWidgetDtoBuilder('9').build(), // insert (7)
                new SnPageWidgetDtoBuilder('10').build(),
            ]).build()
        );

        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('1').build(), // remove (1)
                new SnPageWidgetDtoBuilder('3').build(), // remove (2)
                new SnPageWidgetDtoBuilder('6').build(),
                new SnPageWidgetDtoBuilder('8').build(),
                new SnPageWidgetDtoBuilder('10').build(),
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove',
            'remove',
            'add',
            'add',
            'add',
            'add',
            'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches (add, remove, replace)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('1').withName('A').build(), // replace (1)
                new SnPageWidgetDtoBuilder('2').build(), // add (3)
            ]).build()
        );
        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('1').withName('B').build(),
                new SnPageWidgetDtoBuilder('3').build(), // remove (2)
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'replace',
            'remove',
            'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches (add, remove && zIndex)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('1').build(), // add (2)
                new SnPageWidgetDtoBuilder('3').build(), // zIndex (3)
                new SnPageWidgetDtoBuilder('2').build(),
            ]).build()
        );
        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('4').build(), // remove (1)
                new SnPageWidgetDtoBuilder('2').build(),
                new SnPageWidgetDtoBuilder('3').build(),
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove',
            'add',
            'remove', 'add',
        ]);
    });

    it(PatchesService.prototype.patchesWidgets.name + ' should return patches (recursive, sub widgets)', () => {
        // WHEN
        snModel.withPage(
            page.withWidgets([
                new SnPageWidgetDtoBuilder('1')
                    .withGroup([
                        new SnPageWidgetDtoBuilder('1-1')
                            .withGroup([
                                new SnPageWidgetDtoBuilder('1-1-1').withName('A').build(), // add (5)
                                new SnPageWidgetDtoBuilder('1-1-2').withName('B').build(),
                                new SnPageWidgetDtoBuilder('1-1-3').withName('C').build(), // add (6)
                            ]).build(),
                        new SnPageWidgetDtoBuilder('1-2').withGroup([
                            new SnPageWidgetDtoBuilder('1-2-1').build(), // zIndex
                            new SnPageWidgetDtoBuilder('1-2-2').build(),
                            new SnPageWidgetDtoBuilder('1-2-3').build(), // add (7)
                            new SnPageWidgetDtoBuilder('1-2-5').build(), // zIndex
                            new SnPageWidgetDtoBuilder('1-2-6').build(), // zIndex
                            new SnPageWidgetDtoBuilder('1-2-7').build(), // add (8)
                        ]).build(),
                        new SnPageWidgetDtoBuilder('1-3').withName('C').build(), // add (1)
                        new SnPageWidgetDtoBuilder('1-4').withName('D').build(), // add (2)
                    ]).build()
            ]).build()
        );
        snModelCompare.withPage(
            pageCompare.withWidgets([
                new SnPageWidgetDtoBuilder('1')
                    .withGroup([
                        new SnPageWidgetDtoBuilder('1-1')
                            .withGroup([
                                new SnPageWidgetDtoBuilder('1-1-2').withName('A').build(), // replace (4)
                                new SnPageWidgetDtoBuilder('1-1-50').withName('C').build(), // remove (5)
                            ]).build(),
                        new SnPageWidgetDtoBuilder('1-2').withGroup([
                            new SnPageWidgetDtoBuilder('1-2-6').build(),
                            new SnPageWidgetDtoBuilder('1-2-2').build(),
                            new SnPageWidgetDtoBuilder('1-2-4').build(), // remove (9)
                            new SnPageWidgetDtoBuilder('1-2-1').build(),
                            new SnPageWidgetDtoBuilder('1-2-5').build(),
                        ]).build(),
                        new SnPageWidgetDtoBuilder('1-5').withName('D').build(), // remove (3)
                    ]).build()
            ]).build()
        );
        patches = patchesService.patchesWidgets('aaa', page.toPlainObject(), pageCompare.toPlainObject());
        reverse = patchesService.patchesWidgets('aaa', pageCompare.toPlainObject(), page.toPlainObject());
        const operations = patches.map((p) => p.op);

        // TEST
        expect(operations).toEqual([
            'remove',
            'add',
            'add',
            'replace',
            'remove',
            'add',
            'add',
            'remove',
            'add',
            'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
            'remove', 'add',
        ]);
    });
});
