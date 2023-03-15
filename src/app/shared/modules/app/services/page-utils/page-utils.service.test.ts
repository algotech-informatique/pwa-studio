/* eslint-disable @typescript-eslint/no-unused-expressions */
import { PageUtilsService } from './page-utils.service';
import { UUID } from 'angular2-uuid';
import { ResizeOrientation } from './resize-orientation.enum';
import { SnPageDtoBuilder } from '../../../../../../../test-utils/builders/SnPageDto.builder';

describe(PageUtilsService.name, () => {
    const service = new PageUtilsService();
    const testPage = new SnPageDtoBuilder().withId(UUID.UUID()).build();

    describe(PageUtilsService.prototype.buildPageHandlerId.name, () => {
        it('should contains the page uuid and orientation', () => {
            const result = service.buildPageHandlerId(testPage, ResizeOrientation.horizontal);
            expect(result).toContain(testPage.id);
            expect(result).toContain(ResizeOrientation.horizontal);
        });
    });
    describe(PageUtilsService.prototype.getHandlerInfo.name, () => {
        it('should get pageId and handler orientation from handlerId', () => {
            // GIVEN
            const handlerId = service.buildPageHandlerId(testPage, ResizeOrientation.horizontal);
            // WHEN
            const result = service.getHandlerInfo(handlerId);
            // THEN
            expect(result.pageId).toEqual(testPage.id);
            expect(result.orientation).toEqual(ResizeOrientation.horizontal);
        });
    });
});
