/* eslint-disable @typescript-eslint/naming-convention */
import {
    LangDto, SnAppDto, SnPageBoxDto, SnPageEventDto, SnPageWidgetDto, SnPageWidgetGroupDto, SnPageWidgetRuleDto,
} from '@algotech/core';
import { Injectable } from '@angular/core';
import { UUID } from 'angular2-uuid';
import * as _ from 'lodash';
import { SnTranslateService } from '../../../smart-nodes/services/lang/sn-translate/sn-translate.service';
import { PageUtilsService } from '../page-utils/page-utils.service';
import { WidgetCssSchemaInterface } from '../../../app-custom/models/widget-css-schema.interface';
import { AppSelectionService } from '../app-selection/app-selection.service';
import { allTypes, generateCss, generateCustom, generateEvents } from '../../../app-custom/widgets/_data/data';
import { WidgetTypeDto } from '../../dto';
import { EleInterface, StyleInterface } from '../../../app-custom/models/design-style.interface';

@Injectable()
export class PageWidgetService {

    constructor(
        private translate: SnTranslateService,
        private pageUtils: PageUtilsService,
        private appSelection: AppSelectionService,
    ) { }

    static getType(widget: SnPageWidgetDto) {
        return this.getTypeByKey(widget.typeKey);
    }

    static getTypeByKey(typeKey: string) {
        const type = allTypes.find((t) => t.typeKey === typeKey);

        if (!type) {
            throw new Error(`type ${typeKey} not find`);
        }

        return type;
    }

    group(app: SnAppDto, widgets: SnPageWidgetDto[], mergeGroup = true, typeKey = 'custom') {
        if (widgets.length === 0) {
            return;
        }

        // sort selection for insert multiple
        const sortWidgets = [...widgets].sort((a, b) =>
            this.pageUtils.getBrothers(app, a).indexOf(a) - this.pageUtils.getBrothers(app, b).indexOf(b));

        const brothers = this.pageUtils.getBrothers(app, sortWidgets[0]);
        const filterWidgets = sortWidgets.filter((w) => brothers.indexOf(w) > -1);

        // widgets on x pages
        if (filterWidgets.length !== sortWidgets.length) {
            return;
        }

        const groups = sortWidgets.filter((w) => w.typeKey === typeKey);
        const group = groups.length === 1 ? groups[0] : null;
        let newChilds = _.cloneDeep(mergeGroup && group ? sortWidgets.filter((w) => w.typeKey !== typeKey) : sortWidgets);

        const newChildsIndexes = newChilds.map(w => brothers.findIndex(brother => brother.id === w.id));
        const groupIndex = group ? brothers.findIndex(brother => brother.id === group.id) : null;

        for (const rm of newChilds) {
            brothers.splice(_.findIndex(brothers, { id: rm.id }), 1);
        }

        const box = this.buildBox(sortWidgets);

        // subtract offset
        newChilds = _.map(newChilds, (child: SnPageWidgetDto) => {
            child.box.x -= box.x;
            child.box.y -= box.y;

            return child;
        });

        if (group && mergeGroup) {
            const groupChilds = (_.map(group.group.widgets, (groupChild: SnPageWidgetDto) => {
                groupChild.box.x += (group.box.x - box.x);
                groupChild.box.y += (group.box.y - box.y);

                return groupChild;
            }));

            const childrenBeforeGroup = newChilds.reduce((res, newChild, i) => {
                if (newChildsIndexes[i] < groupIndex) { res.push(newChild); }
                return res;
            }, []);

            const childrenAfterGroup = newChilds.reduce((res, newChild, i) => {
                if (newChildsIndexes[i] > groupIndex) { res.push(newChild); }
                return res;
            }, []);

            group.group.widgets = [...childrenBeforeGroup, ...groupChilds, ...childrenAfterGroup];
            group.typeKey = typeKey;
            group.box = box;

            return group;
        }

        const widget = this.buildWidget(typeKey, box, []);
        widget.group = this.buildGroup(newChilds);

        const lastWidgetIndex = Math.max(...newChildsIndexes);
        brothers.splice(lastWidgetIndex - (newChilds.length - 1), 0, widget);
        return widget;
    }

    ungroup(app: SnAppDto, widgets: SnPageWidgetDto[]) {
        if (widgets.length === 0) {
            return;
        }
        const brothers = this.pageUtils.getBrothers(app, widgets[0]);
        if (widgets.some((w) => this.pageUtils.getBrothers(app, w) !== brothers)) {
            return;
        }

        // collect widgets
        const addWidgets: SnPageWidgetDto[] = _.reduce(widgets, (results, widget: SnPageWidgetDto) => {
            if (widget.group) {
                const _addWidgets = widget.group.widgets.map((child: SnPageWidgetDto) => {
                    child.box.x = child.box.x + widget.box.x;
                    child.box.y = child.box.y + widget.box.y;
                    return child;
                });
                const index = brothers.findIndex(brother => brother === widget);
                brothers.splice(index, 0, ..._addWidgets);
                results.push(..._addWidgets);
            }
            return results;
        }, []);

        for (const rm of widgets) {
            _.remove(brothers, rm);
        }

        return addWidgets;
    }

    buildBox(widgets: SnPageWidgetDto[]): SnPageBoxDto {
        const x = _.min(_.map(widgets, ((w: SnPageWidgetDto) => w.box.x)));
        const y = _.min(_.map(widgets, ((w: SnPageWidgetDto) => w.box.y)));

        const width = _.max(_.map(widgets, (w: SnPageWidgetDto) => (w.box.x - x) + w.box.width));
        const height = _.max(_.map(widgets, (w: SnPageWidgetDto) => (w.box.y - y) + w.box.height));

        return {
            x,
            y,
            height,
            width
        };
    }

    remove(app: SnAppDto, widgets: SnPageWidgetDto[]) {
        let select = null;
        for (const widget of widgets) {
            select = null;
            const page = this.pageUtils.findPage(app, widget);
            if (page) {
                if (this.pageUtils.isMasterWidget(app, widget)) {
                    page.widgets.splice(page.widgets.indexOf(widget), 1);
                } else {
                    // child
                    const parent = this.pageUtils.findParentWidget(app, widget);
                    if (parent) {
                        if (parent.group.widgets.length <= 1 && this.pageUtils.isStandardGroup(parent)) {
                            this.ungroup(app, [parent]);
                            _.remove(this.pageUtils.getBrothers(app, widget), widget);
                        } else {
                            parent.group.widgets.splice(parent.group.widgets.indexOf(widget), 1);
                            this.resizeStandardGroup(app, parent);
                            select = parent;
                        }
                    }
                }
            }
        }
        return select;
    }

    listOfStrictParents(): string[] {
        return _.uniq(_.compact(_.flatMap(allTypes, 'strictParents')));
    }

    listOfUnstrictGroups(): string[] {
        return allTypes.filter(type => type.unstrictGroup).map(type => type.typeKey);
    }

    autoSize(widget: SnPageWidgetDto, ajustBox?: (widget: SnPageWidgetDto, box: SnPageBoxDto) => void) {
        if (!widget.group) {
            return;
        }
        const absWidgets: SnPageWidgetDto[] = widget.group.widgets.map((child: SnPageWidgetDto) => {
            const _child = _.cloneDeep(child);
            _child.box.x += widget.box.x;
            _child.box.y += widget.box.y;
            return _child;
        });
        const box = this.buildBox(absWidgets);
        if (absWidgets.length > 0) {
            if (ajustBox) {
                ajustBox(widget, box);
            }
            widget.box = box;
        }

        // subtract offset
        _.each(widget.group.widgets, (child: SnPageWidgetDto, index: number) => {
            child.box.x = absWidgets[index].box.x - widget.box.x;
            child.box.y = absWidgets[index].box.y - widget.box.y;
        });
    }

    resizeStandardGroup(app: SnAppDto, widget: SnPageWidgetDto) {
        for (const item of this.pageUtils.getTree(app, widget).reverse()) {
            if (this.pageUtils.isStandardGroup(item)) {
                this.autoSize(item);
            }
        }
    }

    resizeAnyGroup(typeKey: string[], tree: SnPageWidgetDto[], ajustBox?: (widget: SnPageWidgetDto, box: SnPageBoxDto) => void) {
        for (const item of tree) {
            if (typeKey.includes(item.typeKey)) {
                this.autoSize(item, ajustBox);
            }
        }
    }

    buildGroup(widgets: SnPageWidgetDto[]) {
        const group: SnPageWidgetGroupDto = {
            widgets: widgets.map((w) => {
                const subWidget = _.cloneDeep(w);
                subWidget.id = UUID.UUID();
                return subWidget;
            })
        };

        return group;
    }

    getCssByPath(css: any, path: string): any {
        const split = path.split('.');
        let current = css;

        while (split.length > 0) {
            if (!current) {
                return null;
            }
            current = current[split[0]];
            split.shift();
        }
        return current;
    }

    buildCss(cssSchema: WidgetCssSchemaInterface[], defaultValue = {}) {
        // create css
        return cssSchema.reduce((result: any, schema) => {
            const split = schema.path.split('.');
            let current = result;

            while (split.length > 1) {
                // init path
                if (!current[split[0]]) {
                    current[split[0]] = {};
                }
                current = current[split[0]];
                split.shift();
            }

            current[split[0]] = schema.value;
            return result;
        }, _.cloneDeep(defaultValue));
    }

    buildTemplate(template: SnPageWidgetDto, box: SnPageBoxDto) {
        const widget: SnPageWidgetDto = _.assign(_.cloneDeep(template), { box });

        for (const child of [widget, ...this.pageUtils.getChilds(widget, true)]) {
            child.id = UUID.UUID();
        }

        delete widget.afterTemplatePlaced;

        return widget;
    }

    buildWidget(typeKey: string, box: SnPageBoxDto, languages: LangDto[]): SnPageWidgetDto {
        const custom: any = generateCustom(typeKey, (t: string) => this.translate.initializeLangs(t, languages));
        const cssSchema: WidgetCssSchemaInterface[] = generateCss(typeKey);

        const events: SnPageEventDto[] = generateEvents(typeKey);
        const type = PageWidgetService.getTypeByKey(typeKey);

        const widget: SnPageWidgetDto = {
            id: UUID.UUID(),
            typeKey,
            name: this.translate.transform(type.displayName),
            isActive: false,
            css: this.buildCss(cssSchema),
            custom,
            box,
            events,
            rules: [],
            locked: false,
            lockedProperties: [],
        };

        if (type.returnData) {
            widget.returnData = type.returnData;
        }

        if (this.listOfStrictParents().includes(widget.typeKey) || this.listOfUnstrictGroups().includes(widget.typeKey)) {
            widget.group = this.buildGroup([]);
        }

        return widget;
    }

    getPathBystyle(widgetType: WidgetTypeDto, style: string): WidgetCssSchemaInterface | undefined {
        const cssSchema: WidgetCssSchemaInterface[] = generateCss(widgetType.typeKey);
        return cssSchema.find((css) => css.style === style);

    }

    canWidgetsBeLocked(app: SnAppDto, widgets?: SnPageWidgetDto[]) {
        if (!widgets) {
            widgets = this.appSelection.selections.widgets;
        }
        return widgets.length > 0 && _.every(widgets, w => (this.canWidgetBeLocked(w, app)));
    }

    canWidgetBeLocked(widget: SnPageWidgetDto, app: SnAppDto) {
        if (widget) {
            const parent = app ? this.pageUtils.findParentWidget(app, widget) : null;
            return (parent?.sharedId != null) ||
                (!parent && this.pageUtils.isWidgetShared(app, widget));
        }
        return false;
    }

    isSectionLocked(section: string, widgets?: SnPageWidgetDto[]) {
        if (!widgets) {
            widgets = this.appSelection.selections.widgets;
        }
        if (section === 'widget') {
            return widgets.every(w => w.locked);
        } else {
            return widgets.every(w => {
                if (w.lockedProperties) {
                    return w.lockedProperties.findIndex(s => s === section) !== -1;
                }
                return false;
            });
        }
    }

    LockedPaths(widget: SnPageWidgetDto) {
        /*  const paths: string = get
         paths.forEach((path: string) => {
             const properties: string[] = [];
             if (path === 'widget') {
                 widget.locked = locked;
             } else if (path.includes('$css:')) {
                 const css = this.getPathBystyle(widget.type, path.split('$css:')[0]);
                 if (css) {
                     properties.push(css.path);
                 }
             } else if (path.includes('$event:')) {

             } else {
                 properties.push(path);
             }
         }); */
    }

    recomposeRule
        <
            TA extends { custom: any; css: any; events: SnPageEventDto[] },
            TB extends { custom: any; css: any; events: SnPageEventDto[] }
        >(from: TA, to: TB, difference?: TA) {
        // css: recompose
        for (const name of Object.keys(from.css)) {
            const css = from.css[name];
            if (!to.css[name]) {
                to.css[name] = {};
            }
            if (_.isObject(css)) {
                for (const propKey of Object.keys(css)) {
                    if (!difference || !_.isEqual(difference.css[name]?.[propKey], css[propKey])) {
                        to.css[name][propKey] = _.cloneDeep(css[propKey]);
                    }
                }
            }
        }

        // custom: recompose
        for (const propKey of Object.keys(from.custom)) {
            if (!difference || !_.isEqual(difference.custom[propKey], from.custom[propKey])) {
                to.custom[propKey] = _.cloneDeep(from.custom[propKey]);
            }
        }

        // events: recompose
        for (const fromEv of from.events) {
            const index = to.events.findIndex((ev) => ev.eventKey === fromEv.eventKey);
            if (difference) {
                const find = difference.events.find((ev) => ev.eventKey === fromEv.eventKey);
                if (!_.isEqual(find, fromEv)) {
                    if (index === -1) {
                        to.events.push(_.cloneDeep(fromEv));
                    } else {
                        to.events[index] = _.cloneDeep(fromEv);
                    }
                }
            } else {
                if (index === -1) {
                    to.events.push(_.cloneDeep(fromEv));
                } else {
                    to.events[index] = _.cloneDeep(fromEv);
                }
            }
        }
    }

    applyRule(rule: SnPageWidgetRuleDto, widget: SnPageWidgetDto) {
        const widgetResolveRule: SnPageWidgetDto = _.cloneDeep(widget);

        // shared
        widgetResolveRule.box = widget.box;
        widgetResolveRule.group = widget.group;
        widgetResolveRule.displayState.errors = widget.displayState.errors;

        this.recomposeRule(rule, widgetResolveRule);

        widgetResolveRule.displayState.relativeTo = rule.id;
        widget.displayState.rule = {
            rule,
            widget: widgetResolveRule,
        };
    }

    updateRule(widget: SnPageWidgetDto) {
        if (!widget?.displayState?.rule) {
            return;
        }

        widget.displayState.rule.rule.css = {};
        widget.displayState.rule.rule.custom = {};
        widget.displayState.rule.rule.events = [];

        this.recomposeRule(widget.displayState.rule.widget, widget.displayState.rule.rule, widget);
    }

    enableRule(app: SnAppDto, widget: SnPageWidgetDto, rule?: SnPageWidgetRuleDto) {
        if (widget.displayState.rule) {
            widget.displayState.rule = null;
        }

        if (rule) {
            this.applyRule(rule, widget);
        }
        this.appSelection.select(null, app, { element: widget, type: 'widget' });
    }

    isYLocked(widget: SnPageWidgetDto): boolean {
        return !!PageWidgetService.getType(widget).lockAxis?.includes('y');
    }

    isXLocked(widget: SnPageWidgetDto): boolean {
        return !!PageWidgetService.getType(widget).lockAxis?.includes('x');
    }

    loadStylesPage() {
        const elements: EleInterface[] = this.appSelection.selections.pages.map((p) =>
        ({
            path: 'background-color',
            ref: p
        }));

        return [{
            style: 'background',
            value: this.intersectStyleValue(elements),
            elements
        }];
    }

    loadStylesWidget(currentWidgets: SnPageWidgetDto[]) {
        const types = _.uniq(currentWidgets.map((w) => w.typeKey));
        const cssSchemas = types.map((type: string) => generateCss(type));
        // all widgets have to contain same style
        const styles: string[] = _.uniq(_.map(_.flatten(cssSchemas), 'style')).filter((style) =>
            cssSchemas.every((schema) => schema.some((s) => s.style === style))
            , []);

        return styles.map((style) => {
            const elements = currentWidgets.reduce((results: EleInterface[], widget) => {
                const find = generateCss(widget.typeKey).find((schema) => schema.style === style);
                if (find) {
                    results.push({
                        path: find.path,
                        ref: widget.displayState?.rule?.widget ? widget.displayState.rule.widget : widget,
                        widget,
                    });
                }
                return results;
            }, []);
            const res: StyleInterface = {
                style,
                value: this.intersectStyleValue(elements),
                elements
            };

            return res;
        });
    }

    intersectStyleValue(elements: EleInterface[]) {
        if (elements.length === 0) {
            return null;
        }
        const refValue = _.cloneDeep(this.getCssByPath(elements[0].ref.css, elements[0].path));
        if (_.isString(refValue)) {
            return elements.every((ele) => this.getCssByPath(ele.ref.css, ele.path) === refValue) ? refValue : null;
        }
        if (_.isObject(refValue)) {
            for (const prop in refValue) {
                if (refValue.hasOwnProperty(prop)) {
                    const propNotFound = elements.some((ele) => !this.getCssByPath(ele.ref.css, ele.path)?.[prop]);
                    refValue[prop] = propNotFound ?
                        undefined :
                        elements.every((ele) => this.getCssByPath(ele.ref.css, ele.path)?.[prop] === refValue[prop]) ?
                            refValue[prop] :
                            null;
                }
            }
            return refValue;
        }
        return null;
    }

}
