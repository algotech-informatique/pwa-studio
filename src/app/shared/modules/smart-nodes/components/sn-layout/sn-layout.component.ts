import {
    Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, Output, EventEmitter, OnDestroy, ViewChild,
    ElementRef, ViewChildren, QueryList
} from '@angular/core';
import * as d3 from 'd3';
import { SnNode, SnView } from '../../models';
import {
    SnDragService, SnTranslateService, SnLinksService, SnDOMService,
    SnActionsService, SnCalculService, SnContextmenuService, SnZoomService, SnSelectionService, SnUpDownService
} from '../../services';
import * as _ from 'lodash';
import { SnSettings } from '../../dto/sn-settings';
import { Subject, Subscription } from 'rxjs';
import { SnToolbox, SnSelectionEvent, SnContextmenu, SnClickView } from '../../dto';
import { SnClipboardService } from '../../services/view/sn-clipboard/sn-clipboard.service';
import { SnNodeComponent } from '../sn-node/sn-node.component';
import { DrawingService } from '@algotech-ce/business/drawing';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'sn-layout',
    templateUrl: './sn-layout.component.html',
    styleUrls: ['./sn-layout.component.scss'],
})
export class SnLayoutComponent implements OnChanges, OnDestroy {

    @ViewChild('svg', { static: true }) svgElement: ElementRef;
    @ViewChildren(SnNodeComponent) nodesCmp: QueryList<SnNodeComponent>;

    svg;
    container;

    showContextmenu = false;
    menu: SnContextmenu;
    mouse: number[];
    svgElementContainer: DOMRect;
    actionView: SnClickView;

    @Input()
    settings: SnSettings;

    @Input()
    snView: SnView;

    @Output()
    changed = new EventEmitter();

    @Output()
    selected = new EventEmitter();
    subscription: Subscription;

    updated$ = new Subject();

    loaded = false;
    display = false;
    drawing = false;

    constructor(
        public snDOMService: SnDOMService,
        private ref: ChangeDetectorRef,
        private snDragService: SnDragService,
        private snSelection: SnSelectionService,
        private snUpDown: SnUpDownService,
        private snLinksService: SnLinksService,
        private translate: SnTranslateService,
        private snAction: SnActionsService,
        private snCalcul: SnCalculService,
        private snZoom: SnZoomService,
        private snContextmenuService: SnContextmenuService,
        private snClipboardService: SnClipboardService,
        private drawingService: DrawingService,
    ) {
        this.updated$.pipe(
            debounceTime(300),
        ).subscribe((data: { snView: SnView; cmd?: string }) => {
            this.changed.emit(data);
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings && changes.settings.currentValue && changes.settings.currentValue.lang) {
            this.translate.lang = changes.settings.currentValue.lang;
        }

        if (!this.snView) {
            return;
        }

        if (changes.snView) {
            this.loaded = false;
            this.display = false;
            this.drawing = false;

            if (this.subscription) {
                this.subscription.unsubscribe();
            }

            this.subscription = this.snContextmenuService.showingContextmenu.subscribe((show: boolean) => {
                this.showContextmenu = show;
            });

            /* update */
            this.subscription.add(this.snAction.onUpdate(this.snView).subscribe((data) => {
                if (!this.loaded) {
                    return;
                }
                this.snAction.initializeDisplayStates(this.snView);

                this.detectorDetectChanges();
                // calcul all nodes
                if (!['sn.update.container.move', 'sn.update.node.move', 'sn.update.hide', 'sn.update.check'].includes(data.cmd)) {
                    this.snAction.runPreventRecursive(() => {
                        const calculate = (nodes: SnNodeComponent[]) => {
                            for (const node of nodes) {
                                if (node.calculate()) {
                                    calculate(_.reject(this.nodesCmp.toArray(), node));
                                    return;
                                }
                            }
                        };

                        // re-initialize nodes
                        if (data.cmd === 'sn.update') {
                            for (const node of this.nodesCmp.toArray()) {
                                node.initialize();
                            }
                        }
                        calculate(this.nodesCmp.toArray());
                    });
                }

                // calcul
                this.snCalcul.calculateConnection(this.snView);
                this.snCalcul.calculateHidden(this.snView);

                this.detectorDetectChanges();
                this.snCalcul.calculateContainers(this.snView);

                if (data.node || data.nodes) {
                    const nodes = data.node ? [data.node] : data.nodes;
                    for (const node of nodes) {
                        this.snLinksService.drawTransitions(this.snView, node);
                    }
                } else {
                    this.snLinksService.drawTransitions(this.snView);
                }
                if (data.cmd === 'sn.update' && this.snView.drawing) {
                    this.drawingService.draw('svg', 'container', this.snView.drawing);
                }

                this.update();
                if (data.cmd !== 'sn.update') {
                    this.updated$.next({ snView: _.cloneDeep(this.snView), cmd: data.cmd });
                }
            }));

            /* selection */
            this.subscription.add(this.snSelection.onSelect(this.snView).subscribe((event: SnSelectionEvent) => {
                this.detectorDetectChanges();
                if (event && !event.rightClickMode) {
                    this.onCloseContextmenu();
                }

                this.snLinksService.drawTransitions(this.snView);
                this.selected.emit(event);
            }));

            /* action */
            this.subscription.add(this.snAction.onClickEvent(this.snView).subscribe((event: SnClickView) => {
                this.actionView = event;
            }));

            /* drawing */
            this.subscription.add(this.snAction.onDrawing(this.snView).subscribe((data: { drawing: boolean }) => {
                this.drawing = data.drawing;
                if (!data.drawing) {
                    this.snZoom.lockZoom('mouse', false);
                    this.initializeSvg();
                    this.initializeShortcut();
                    this.update();
                } else {
                    this.snSelection.unselect(this.snView);
                    this.snZoom.lockZoom('mouse', true);
                    this.svg.on('click', null);
                }
            }));

            /* refresh */
            this.subscription.add(this.snAction.onRefresh(this.snView).subscribe(() => {
                this.detectorDetectChanges();
            }));

            setTimeout(() => {
                this.initialize();
                this.changed.emit({ snView: _.cloneDeep(this.snView) });
            }, 0);
        }
    }

    detectorAttach() {
        const self = this;
        this.svg.selectAll('.node')
            .on('mouseenter', function () {
                self.nodesCmp.forEach((node: SnNodeComponent) => {
                    if (`node-${node.node.id}` === d3.select(this).attr('id')) {
                        node.detectorAttach(true);
                    }
                });
            }).on('mouseleave', function () {
                self.nodesCmp.forEach((node: SnNodeComponent) => {
                    if (`node-${node.node.id}` === d3.select(this).attr('id')) {
                        node.detectorAttach(false);
                    }
                });
            });
    }

    detectorDetectChanges() {
        this.ref.detectChanges();
        this.nodesCmp.forEach((node: SnNodeComponent) => {
            node.detectorDetectChanges();
        });
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    contextMenu() {
        this.snContextmenuService.contextmenu(this.snView, this.settings, this.svg,
            (menu: SnContextmenu) => {
                d3.event.preventDefault();
                if (this.actionView) {
                    this.actionView = null;
                    d3.event.stopPropagation();
                    return;
                }

                this.menu = null;
                this.ref.detectChanges();

                this.menu = menu;
                this.mouse = d3.mouse(d3.event.currentTarget);
                this.svgElementContainer = this.svgElement.nativeElement.getBoundingClientRect();
                this.snContextmenuService.showContextmenu(true);
                this.ref.detectChanges();

            }, () => { this.onCloseContextmenu(); });
    }

    onCloseContextmenu() {
        this.menu = null;
        this.snContextmenuService.showContextmenu(false);
    }

    initialize() {
        this.ref.detectChanges();

        this.svg = d3.select('#svg');
        this.snAction.initializeView(this.snView, this.settings);
        const isSnViewFistShow = this.snZoom.initialize(this.snView);
        this.snDOMService.initialize(this.svgElement, this.snZoom.transform);

        this.initializeSvg();
        this.initializeShortcut();
        this.snZoom.zoom();
        this.snCalcul.calculateHidden(this.snView);

        // load the component
        this.loaded = true;
        this.ref.detectChanges();

        // display the view
        this.display = true;
        this.detectorDetectChanges();

        this.snCalcul.calculateContainers(this.snView);

        this.ref.detectChanges();
        this.snLinksService.drawTransitions(this.snView);

        // draw
        if (this.snView.drawing) {
            this.drawingService.draw('svg', 'container', this.snView.drawing);
        }

        this.update();

        if (this.snView.nodes.length > 0 && isSnViewFistShow) {
            const startNode = this.snView.nodes.find((node: SnNode) => node.type === 'SnLauncherNode');
            this.snZoom.centerNode(startNode ? startNode : this.snView.nodes[0]);
        }
    }

    initializeSvg() {
        this.svg
            .on('click', () => {
                if (this.actionView) {
                    const coord: { x: number, y: number } = this.snDOMService.getLayoutCoordinates(d3.mouse(d3.event.currentTarget));
                    this.actionView.onClick(coord);
                    this.actionView = null;

                    return;
                }
                this.snSelection.unselect(this.snView);
            });
    }

    initializeShortcut() {

        const self = this;
        // Manage Key Pressed
        d3.select('body')
            .on('keydown', () => {
                if (!document.activeElement || (!(document.activeElement as HTMLElement).isContentEditable)) {
                    if (document.activeElement.tagName === 'BODY') {

                        // REMOVE
                        if (d3.event.keyCode === 46 || (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && d3.event.keyCode === 8)) {
                            d3.event.preventDefault();
                            self.snAction.remove(self.snView, self.settings, !d3.event.shiftKey);
                        }

                        // SELECT ALL
                        if (d3.event.ctrlKey && d3.event.keyCode === 65) {
                            d3.event.preventDefault();
                            self.snSelection.selectAll(self.snView);
                        }

                        // COPY
                        if (d3.event.ctrlKey && d3.event.keyCode === 67) {
                            d3.event.preventDefault();
                            self.snClipboardService.directCopy(self.snView, self.settings);
                        }

                        // PASTE
                        if (d3.event.ctrlKey && d3.event.keyCode === 86) {
                            d3.event.preventDefault();
                            self.snSelection.unselect(self.snView);
                            self.actionView = {
                                onClick: (event) => {
                                    self.snClipboardService.directPaste(self.snView, self.settings, event);
                                }
                            };
                        }

                        // UNDO
                        if (d3.event.ctrlKey && d3.event.keyCode === 90) {
                            d3.event.preventDefault();
                            if (self.settings.undo) {
                                self.settings.undo();
                            }
                        }

                        // REDO
                        if (d3.event.ctrlKey && d3.event.keyCode === 89) {
                            d3.event.preventDefault();
                            if (self.settings.redo) {
                                self.settings.redo();
                            }
                        }

                        // EXPAND
                        if (d3.event.keyCode === 69) {
                            d3.event.preventDefault();
                            const containers = self.snSelection.getSelectedContainers(self.snView);
                            if (containers.length > 0) {
                                self.snAction.expandNodes(self.snView, containers);
                                return;
                            }
                            self.snAction.expandNodes(self.snView);
                        }
                    }
                }
            });

        d3.select('body')
            .on('keyup', () => {

                // UP DOWN
                if (d3.event.keyCode === 38 || d3.event.keyCode === 40) {
                    d3.event.preventDefault();
                    if (d3.event.altKey) {
                        self.snAction.moveUpDown(self.snView, d3.event.keyCode === 38 ? 'up' : 'down');
                        return;
                    }
                    self.snUpDown.selectUpDown(d3.event, self.snView, d3.event.keyCode === 38 ? 'up' : 'down');
                }
            });
    }

    update() {
        if (this.drawing) {
            return;
        }
        this.ref.detectChanges();
        this.contextMenu();
        const container = d3.select('#svg').select('#container');
        this.detectorAttach();
        this.snDragService.drag(this.snView, container, this.settings);
    }

    onLaunchEvent(event: SnToolbox) {
        this.actionView = event;
    }
}
