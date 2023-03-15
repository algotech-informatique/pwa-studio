/* eslint-disable @typescript-eslint/no-unused-expressions */
// @ts-nocheck
import { AppResizePageService } from './app-resize-page.service';
import { PageUtilsService } from '../../page-utils/page-utils.service';
import { SnPageDtoBuilder } from '../../../../../../../../test-utils/builders/SnPageDto.builder';
import { SnPageWidgetDtoBuilder } from '../../../../../../../../test-utils/builders/SnPageWidgetDto.builder';

describe(AppResizePageService.name, () => {
    const service = new AppResizePageService(new PageUtilsService());

    describe(AppResizePageService.prototype.getClampedInt.name, () => {
        // GIVEN
        const range = { min: -5, max: 5 };

        it('should return same value if value in range', () => {
            expect(service.getClampedInt(2, range.min, range.max)).toEqual(2);
        });
        it('should return upper range bound if value superior', () => {
            expect(service.getClampedInt(10, range.min, range.max)).toEqual(range.max);
        });
        it('should return upper range bound if value inferior', () => {
            expect(service.getClampedInt(-10, range.min, range.max)).toEqual(range.min);
        });
        it('should round to nearest integer if value is float', () => {
            expect(service.getClampedInt(2.245, range.min, range.max)).toEqual(2);
        });
    });

    describe(AppResizePageService.prototype.isInInfluenceArea.name, () => {
        it('should be true if value is in +/-5px around target value', () => {
            expect(service.isInInfluenceArea(98, 100)).toBe(true);
            expect(service.isInInfluenceArea(101, 100)).toBe(true);
        });
        it('should be true if value is exactly at influence borders', () => {
            expect(service.isInInfluenceArea(95, 100)).toBe(true);
            expect(service.isInInfluenceArea(105, 100)).toBe(true);
        });
        it('should be false if value is outside +/-5px around target value', () => {
            expect(service.isInInfluenceArea(94, 100)).toBe(false);
            expect(service.isInInfluenceArea(106, 100)).toBe(false);
        });
    });

    describe(AppResizePageService.prototype.getNewDimension.name, () => {
        // GIVEN
        const limits = { min: 100, max: 1000 };
        const appDimension = 300;

        it('should limit new dimension to fixed limits', () => {
            expect(service.getNewDimension(appDimension, 1500, limits, true)).toEqual(limits.max);
            expect(service.getNewDimension(appDimension, 50, limits, true)).toEqual(limits.min);
            expect(service.getNewDimension(appDimension, 450, limits, true)).toEqual(450);
        });
        it('should round values to integer', () => {
            expect(service.getNewDimension(appDimension, 450.123, limits, true)).toEqual(450);
        });
        it('should magnet new dimension to current dimension when near attraction area', () => {
            expect(service.getNewDimension(appDimension, 296, limits, true)).toEqual(appDimension);
            expect(service.getNewDimension(appDimension, 304, limits, true)).toEqual(appDimension);
        });
        it('should snap to nearest grid value when grid snapping is enabled', () => {
            expect(service.getNewDimension(appDimension, 453, limits, true)).toEqual(450);
            expect(service.getNewDimension(appDimension, 456, limits, true)).toEqual(460);
            expect(service.getNewDimension(appDimension, 461, limits, true)).toEqual(460);
        });
        it('should take exact value when grid snapping is disabled', () => {
            expect(service.getNewDimension(appDimension, 453, limits, false)).toEqual(453);
            expect(service.getNewDimension(appDimension, 456, limits, false)).toEqual(456);
            expect(service.getNewDimension(appDimension, 461, limits, false)).toEqual(461);
        });
    });

    describe(AppResizePageService.prototype.repositionWidgetsInsidePage.name, () => {
        it('should change widget position if it is out of the page\'s limits after page resize', () => {
            // GIVEN
            const page =
                new SnPageDtoBuilder()
                    .withCanvas({ x: 0, y: 0 })
                    .withDimensions({ width: 300, height: 650 })
                    .withWidgets([
                        new SnPageWidgetDtoBuilder()
                            .withId('widgetA')
                            .withBox({ x: 50, y: 100, width: 100, height: 50 }) // is completely inside the page
                            .build(),
                        new SnPageWidgetDtoBuilder()
                            .withId('widgetB')
                            .withBox({ x: 290, y: 640, width: 100, height: 50 }) // is overlapping bottom right page's corner
                            .build(),
                        new SnPageWidgetDtoBuilder()
                            .withId('widgetC')
                            .withBox({ x: 400, y: 10, width: 100, height: 50 }) // is totally outside the page
                            .build(),
                    ])
                    .build();

            // WHEN
            service.repositionWidgetsInsidePage(page);

            // THEN
            const widgetA = page.widgets.find(w => w.id === 'widgetA');
            expect(widgetA.box).toEqual({ x: 50, y: 100, width: 100, height: 50 }); // should be same as original

            const widgetB = page.widgets.find(w => w.id === 'widgetB');
            expect(widgetB.box).toEqual({ x: 200, y: 600, width: 100, height: 50 }); // should have been moved inside page

            const widgetC = page.widgets.find(w => w.id === 'widgetC');
            expect(widgetC.box).toEqual({ x: 200, y: 10, width: 100, height: 50 }); // should have been moved inside page
        });
    });
});
