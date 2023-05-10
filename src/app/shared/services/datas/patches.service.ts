/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
    SnModelDto, EnvironmentDto, PatchPropertyDto, PatchService, SnVersionDto, SnViewDto, SnAppDto, SnPageDto, SnPageWidgetDto,
} from '@algotech-ce/core';
import { DatasDto } from '../../dtos';
import { Observable, of, } from 'rxjs';
import { Pointer } from 'rfc6902/pointer';
import { SnModelsService } from '../smart-nodes/smart-nodes.service';
import * as rfc6902 from 'rfc6902';
import { PageUtilsService } from '../../modules/app/services';

@Injectable()
export class PatchesService {
    constructor(private snModelsService: SnModelsService, private pageUtils: PageUtilsService) {
    }

    removeDisplayState(object: any) {
        const removeKey = (obj, key) => obj !== Object(obj)
            ? obj
            : Array.isArray(obj)
                ? obj.map(item => removeKey(item, key))
                : Object.keys(obj)
                    .filter(k => k !== key)
                    .reduce((acc, x) => Object.assign(acc, { [x]: removeKey(obj[x], key) }), {});

        return removeKey(object, 'displayState');
    }

    transformModel(model: SnModelDto): SnModelDto {
        const copy: SnModelDto = _.cloneDeep(model);
        for (const version of copy.versions) {
            this.snModelsService.execute(copy, () => {
                const view: SnViewDto = version.view as SnViewDto;
                const canvas = _.map([...view.box, ...view.comments, ...view.groups, ...view.nodes], 'canvas');
                for (const canva of canvas) {
                    delete canva.height;
                    delete canva.width;
                }
            }, () => {
            });
        }
        return this.removeDisplayState(copy);
    }

    recomposeSNModel(model: SnModelDto, patches: PatchPropertyDto[]) {
        new PatchService<SnModelDto>().recompose(patches, model, false);
    }

    patches(model: SnModelDto, modelCompare: SnModelDto, versionUuid?: string) {
        const patchService = new PatchService<SnModelDto>();

        const patches = _.reduce(model.versions.filter((v) => !versionUuid || v.uuid === versionUuid),
            (results, version: SnVersionDto) => {
            const versionCompare = modelCompare.versions.find((v) => v.uuid === version.uuid);
            if (versionCompare && versionCompare.view) {

                this.snModelsService.execute(modelCompare, () => {
                    const view: SnViewDto = version.view as SnViewDto;
                    const viewCompare: SnViewDto = versionCompare.view as SnViewDto;

                    results.push(...this.generatePatches(version.uuid, view.groups, viewCompare.groups, 'groups'));
                    results.push(...this.generatePatches(version.uuid, view.box, viewCompare.box, 'box'));
                    results.push(...this.generatePatches(version.uuid, view.nodes, viewCompare.nodes, 'nodes',
                        ['replace', 'add', 'remove'], 'type'));
                    results.push(...this.generatePatches(version.uuid, view.comments, viewCompare.comments, 'comments'));
                    results.push(...this.generatePatches(version.uuid, view.options, viewCompare.options, 'options'));
                    if (view.drawing && viewCompare.drawing) {
                        results.push(...this.generatePatches(version.uuid, view.drawing.lines,
                            viewCompare.drawing.lines, 'drawing/lines'));
                        results.push(...this.generatePatches(version.uuid, view.drawing.elements,
                            viewCompare.drawing.elements, 'drawing/elements'));
                    }

                }, () => {
                    const app: SnAppDto = version.view as SnAppDto;
                    const appCompare: SnAppDto = versionCompare.view as SnAppDto;

                    const pagesPatches: PatchPropertyDto[] = [];
                    for (const page of app.pages) {
                        const findPage: SnPageDto = appCompare.pages.find((p) => p.id === page.id);
                        if (findPage) {
                            pagesPatches.push(...this.patchesWidgets(version.uuid, page, findPage));

                            // for pages (replace)
                            const props = this.getPropsPages(page, findPage);
                            pagesPatches.push(...(props.reduce((_patches, prop) => {
                                if (prop !== 'widgets') {
                                    const pagePatches = this.generateReplacePatches(version.uuid, page[prop], findPage[prop],
                                        `pages/[id:${page.id}]/${prop}`);
                                    _patches.push(...pagePatches);
                                }
                                return _patches;
                            }, [])));
                        }
                    }

                    // for pages (rm|add)
                    results.push(...pagesPatches);
                    const recomposedApp: SnAppDto = JSON.parse(JSON.stringify(patchService.recompose(pagesPatches, modelCompare)))
                        .versions
                        .find((v) => v.uuid === version.uuid)
                        .view;

                    results.push(...this.generatePatches(version.uuid, app.pages, recomposedApp.pages, 'pages', ['remove', 'add']));

                    if (app.drawing && recomposedApp.drawing) {
                        results.push(...this.generatePatches(version.uuid, app.drawing.lines,
                            recomposedApp.drawing.lines, 'drawing/lines'));
                        results.push(...this.generatePatches(version.uuid, app.drawing.elements,
                            recomposedApp.drawing.elements, 'drawing/elements'));
                    }
                }, () => {
                    const view: SnViewDto = version.view as SnViewDto;
                    const viewCompare: SnViewDto = versionCompare.view as SnViewDto;
                    results.push(...this.generatePatches(version.uuid, view.options, viewCompare.options, 'options'));
                });
            }

            return results;
        }, []);

        const recomposedModel: SnModelDto = JSON.parse(JSON.stringify(patchService.recompose(patches, modelCompare)));

        patches.push(...patchService.compare(recomposedModel, model, true, this.diffPatches));
        return patches;
    }

    patchesWidgets(versionUuid: string, page: SnPageDto, pageCompare: SnPageDto) {
        const getWidgetsArray = (widgets: SnPageWidgetDto[], compare: SnPageWidgetDto[], path: string) => ([
            {
                path,
                value: widgets,
                compare,
            },
            ...widgets.reduce((results, widget: SnPageWidgetDto) => {
                const findWidget = compare.find((w) => w.id === widget.id);
                if (widget.group && findWidget?.group) {
                    const subPath = `${path}/[id:${widget.id}]/group/widgets`;
                    results.push(...getWidgetsArray(widget.group.widgets, findWidget.group.widgets, subPath));
                }
                return results;
            }, [])
        ]);

        const _page: SnPageDto = _.cloneDeep(page);
        const _pageCompare: SnPageDto = _.cloneDeep(pageCompare);
        return getWidgetsArray(_page.widgets, _pageCompare.widgets, `pages/[id:${_page.id}]/widgets`)
            .reduce((patches, container) => {
                // ignore group
                const opPatches = this.generatePatches(versionUuid, container.value, container.compare, container.path)
                    .filter((patch) => !patch.path.endsWith('group'));

                // apply patches before calcul zIndex
                const recompose = { widgets: container.compare };
                try {
                    const apply = opPatches.map((p) => (
                        Object.assign(_.cloneDeep(p), { path: new RegExp(/\/widgets(?!.*\/widgets).*/).exec(p.path)[0] }))
                    );
                    if (apply.length > 0) {
                        new PatchService().recompose(apply, recompose, false);
                    }
                } catch (e) {
                }

                // zIndex
                const zIndexPatches = this.generateZIndexPatches(versionUuid, container.value, recompose.widgets, container.path);

                patches.push(...opPatches);
                patches.push(...zIndexPatches);

                return patches;
            }, []);
    }

    getPropsPages(page: SnPageDto, pageCompare: SnPageDto) {
        const props = [];
        for (const prop in pageCompare) {
            if (pageCompare.hasOwnProperty(prop)) {
                props.push(prop);
            }
        }
        for (const prop in page) {
            if (page.hasOwnProperty(prop)) {
                props.push(prop);
            }
        }

        return _.uniq(props);
    }

    patchesSNModel(model: SnModelDto, preModel: SnModelDto, data: DatasDto, versionUuid?: string): Observable<{
        operations: PatchPropertyDto[];
        reverse: PatchPropertyDto[];
    }> {
        const _model = this.transformModel(model);
        const _preModel = this.transformModel(preModel);

        const operations: PatchPropertyDto[] = this.patches(_model, _preModel, versionUuid);
        const reverse: PatchPropertyDto[] = this.patches(_preModel, _model, versionUuid);

        if (operations.length !== 0) {
            this.updateSNModel(data, _model);
        }

        return of({
            operations,
            reverse
        });
    }

    notifyPatchEnvironment(currentData: DatasDto, dataEnvironment: EnvironmentDto): PatchPropertyDto[] {
        const patches: PatchPropertyDto[] =
            new PatchService<SnModelDto>().compare(currentData.write.previousState.environment, dataEnvironment, true, this.diffPatchesEnv);
        if (patches.length !== 0) {
            this.updateDatasEnvironment(currentData, dataEnvironment);
        }

        return patches;
    }

    diffPatches(input: any, output: any, ptr: Pointer) {
        if (ptr.toString() === '/updateDate' || ptr.toString() === '/createdDate') {
            return [];
        }
        if (
            ptr.toString().includes('/pages') ||
            ptr.toString().includes('/widgets') ||
            ptr.toString().includes('/drawing') ||
            ptr.toString().includes('/view/nodes') ||
            ptr.toString().includes('/view/box') ||
            ptr.toString().includes('/view/groups') ||
            ptr.toString().includes('/view/comments') ||
            ptr.toString().includes('/view/options')) {
            return [];
        }

        if (ptr.toString() === '/displayName' || ptr.toString().includes('/view/')) {
            if (JSON.stringify(input) !== JSON.stringify(output)) {
                const operations: rfc6902.Operation[] = [{ op: 'replace', path: ptr.toString(), value: output }];
                return operations;
            }
        }
    }

    generateReplacePatches(versionUuid: string, element: any, compare: any, type: string) {
        const patches: PatchPropertyDto[] = [];
        if (JSON.stringify(element) !== JSON.stringify(compare)) {
            const path = `/versions/[uuid:${versionUuid}]/view/${type}`;
            const patch: PatchPropertyDto = {
                op: 'replace',
                path,
                value: element
            };
            patches.push(patch);
        }

        return patches;
    }

    generateZIndexPatches(versionUuid: string, elements: any, compare: any, type: string): PatchPropertyDto[] {
        // get all move
        const data = compare.map((element) => ({ element, newIndex: elements.findIndex((ele) => ele.id === element.id) }));

        // apply and reduce move
        const buildIndex = (array) => {
            const restore = [...compare];
            return array.reduce((results, d) => {
                const index = restore.indexOf(d.element);
                if (index !== d.newIndex) {
                    // remove, insert
                    _.remove(restore, d.element);
                    restore.splice(data.newIndex, 0, d.element);

                    // push
                    results.push(d);
                }
                return results;
            }, []);
        };

        // find optimize transactions
        const asc = buildIndex([...data].sort((a, b) => a.newIndex - b.newIndex));
        const desc = buildIndex([...data].sort((a, b) => b.newIndex - a.newIndex));
        const move = (asc.length < desc.length ? asc : desc);

        // return patches
        return _.flatten(move
            .sort((a, b) => a.newIndex - b.newIndex)
            .map((item) => ([{
                op: 'remove',
                path: `/versions/[uuid:${versionUuid}]/view/${type}/[id:${item.element.id}]`,
            }, {
                op: 'add',
                path: `/versions/[uuid:${versionUuid}]/view/${type}/[${item.newIndex}]`,
                value: item.element
            }])));
    }

    generatePatches(versionUuid: string, elements: any, compare: any, type: string,
        operations: ('replace' | 'remove' | 'add')[] = ['replace', 'remove', 'add'], deepKeyCheck?: string): PatchPropertyDto[] {
        const patches: PatchPropertyDto[] = [];

        if (!elements || !compare) {
            return [];
        }

        // replace element
        if (!Array.isArray(elements)) {
            return this.generateReplacePatches(versionUuid, elements, compare, type);
        }

        // replace
        if (operations.includes('replace')) {
            patches.push(..._.reduce(elements, (results: PatchPropertyDto[], element: any) => {
                const find = _.find(compare, { id: element.id });
                if (find && JSON.stringify(element) !== JSON.stringify(find)) { // diff
                    if (deepKeyCheck && find[deepKeyCheck] !== element[deepKeyCheck]) {
                        const path = `/versions/[uuid:${versionUuid}]/view/${type}/[id:${element.id}]`;
                        const patch: PatchPropertyDto = {
                            op: 'replace',
                            path,
                            value: element
                        };
                        results.push(patch);
                    } else {
                        _.uniq([...Object.keys(element), ...Object.keys(find)]).forEach(property => {
                            if (JSON.stringify(element[property]) !== JSON.stringify(find[property])) {
                                const path = `/versions/[uuid:${versionUuid}]/view/${type}/[id:${element.id}]/${property}`;
                                const patch: PatchPropertyDto = {
                                    op: 'replace',
                                    path,
                                    value: element[property]
                                };
                                results.push(patch);
                            }
                        });
                    }
                }
                return results;
            }, []));
        }

        // remove
        if (operations.includes('remove')) {
            patches.push(..._.reduce(compare, (results: PatchPropertyDto[], element: any) => {
                const find = _.find(elements, { id: element.id });
                if (!find) {
                    const patch: PatchPropertyDto = {
                        op: 'remove',
                        path: `/versions/[uuid:${versionUuid}]/view/${type}/[id:${element.id}]`,
                    };
                    results.push(patch);
                }
                return results;
            }, []));
        }

        // add
        if (operations.includes('add')) {
            patches.push(..._.reduce(elements, (results: PatchPropertyDto[], element: any, index: number) => {
                if (!_.find(compare, { id: element.id })) {
                    const patch: PatchPropertyDto = {
                        op: 'add',
                        path: `/versions/[uuid:${versionUuid}]/view/${type}/[${index === elements.length - 1 ? '?' : index}]`,
                        value: element
                    };
                    results.push(patch);
                }
                return results;
            }, []));
        }

        return patches;
    }

    private diffPatchesEnv(input: any, output: any, ptr: Pointer) {
        if (ptr.toString() === '/updateDate' || ptr.toString() === '/createdDate') {
            return [];
        }
    }

    private handlePatchesError(datas: DatasDto, preModel: SnModelDto) {
        // restore
        if (datas) {
            const index = _.findIndex(datas.write.snModels, (mod: SnModelDto) => mod.uuid === preModel.uuid);
            if (index > -1) {
                datas.write.snModels[index] = _.cloneDeep(preModel);
            }
        }
        throw new Error('an error occurs during saving');
    }

    private updateSNModel(datas: DatasDto, model: SnModelDto) {
        const prevIndex = _.findIndex(datas.write.previousState.snModels, (mod: SnModelDto) => mod.uuid === model.uuid);
        if (prevIndex !== -1) {
            datas.write.previousState.snModels[prevIndex] = JSON.parse(JSON.stringify(model));
        }
    }

    private updateDatasEnvironment(datas: DatasDto, environmentData: EnvironmentDto) {
        datas.write.previousState.environment = _.cloneDeep(environmentData);
    }
}
