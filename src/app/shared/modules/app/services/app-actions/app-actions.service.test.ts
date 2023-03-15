import { AppActionsService } from './app-actions.service';
import {
    app,
    master1,
    master1Shared,
    master2,
    master2Shared,
    mixedshared,
    shared,
    sharedGroup,
    subobj1,
    subobj2,
    subobj3,
    widget
} from './fixtures/app-actions.unit.fixtures';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { SnPageWidgetDto } from '@algotech/core';
import * as _ from 'lodash';
import { PageWidgetService } from '../page-widget/page-widget.service';


describe(AppActionsService.name, () => {
    const pageUtils = new PageUtilsService();
    const service = new AppActionsService(new PageUtilsService(), new PageWidgetService(null, pageUtils, null), null, null);

    describe(AppActionsService.prototype._hardUpdateReferences.name, () => {
        it('should repalce w2 with master1', (done) => {
            const w1 = _.cloneDeep(widget);
            const w2 = _.cloneDeep(shared);
            const w3 = _.cloneDeep(sharedGroup);
            const widgets: SnPageWidgetDto[] = [w1, w2, w3];
            service._hardUpdateReferences(widgets, master1, () => {
            }, () => {
                expect(w1).toEqual(widget);
                expect(w2).toEqual(master1Shared);
                expect(w3).toEqual(w3);
                done();
            });
        });

        it('should repalce w3 with master2', (done) => {
            const w1 = _.cloneDeep(widget);
            const w2 = _.cloneDeep(shared);
            const w3 = _.cloneDeep(sharedGroup);
            const widgets: SnPageWidgetDto[] = [w1, w2, w3];
            service._hardUpdateReferences(widgets, master2, () => {

            }, () => {
                expect(w1).toEqual(widget);
                expect(w2).toEqual(shared);
                expect(w3).toEqual(master2Shared);
                done();
            });
        });
    });

    describe(AppActionsService.prototype._mixedUpdateReferences.name, () => {
        it('should update w2 with master1', (done) => {
            const w2 = _.cloneDeep(shared);
            const widgets: SnPageWidgetDto[] = [w2];
            service._mixedUpdateReferences(app, widgets, master1, () => {
                expect(w2).toEqual(mixedshared);
                done();
            });
        });

        it('should repalce w3 with master2', (done) => {
            const w3 = _.cloneDeep(sharedGroup);
            const widgets: SnPageWidgetDto[] = [w3];
            service._mixedUpdateReferences(app, widgets, master2, () => {

                w3.group.widgets.forEach(w => delete w.id);
                expect(w3.group.widgets[0]).toEqual(subobj2);
                expect(w3.group.widgets[1]).toEqual(subobj1);
                expect(w3.group.widgets[2]).toEqual(subobj3);
                done();
            });
        });
    });
});
