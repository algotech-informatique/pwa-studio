import {
    Component, Input, OnChanges, Output,
    EventEmitter, SimpleChanges, ViewChild,
    ElementRef, ChangeDetectorRef, OnDestroy, ViewChildren, QueryList
} from '@angular/core';
import { SnAppDto } from '@algotech-ce/core';
import {
    AppActionsService, AppClipboardService, AppContextmenuService, AppLinksService, AppSelectionService,
    AppZoomService, PageDragService, PageUtilsService
} from '../../services';
import * as d3 from 'd3';
import { Subject, Subscription } from 'rxjs';
import { SnContextmenu, SnDOMService } from '../../../smart-nodes';
import { AppSelectionEvent, AppSettings } from '../../dto';
import { debounceTime } from 'rxjs/operators';
import { DrawingService } from '@algotech-ce/business/drawing';
import { ResizeOrientation } from '../../services/page-utils/resize-orientation.enum';
import { WidgetComponent } from '../widget/widget.component';
import * as _ from 'lodash';

@Component({
    selector: 'app-layout',
    templateUrl: './app-layout.component.html',
    styleUrls: ['app-layout.component.scss'],
})
export class AppLayoutComponent implements OnChanges, OnDestroy {

    @ViewChild('svg', { static: true }) svgElement: ElementRef;
    @ViewChildren(WidgetComponent) widgetsCmp: QueryList<WidgetComponent>;

    @Input() snApp: SnAppDto;
    @Input() settings: AppSettings;

    @Output() layoutClicked = new EventEmitter();
    @Output() changed = new EventEmitter();

    svgElementContainer: DOMRect;

    actionView: () => void;

    loaded = false;
    display = false;
    drawing = false;
    showBackdrop = false;

    updated$ = new Subject();

    // contextmenu
    showContextmenu = false;
    menu: SnContextmenu;
    mouse: number[];

    subscription: Subscription;

    // page size handling
    handlerWidth = 20;
    orientations = ResizeOrientation;

    constructor(
        private ref: ChangeDetectorRef,
        private snDOM: SnDOMService,
        private pageDrag: PageDragService,
        private appActions: AppActionsService,
        private appContextMenu: AppContextmenuService,
        private appClipboard: AppClipboardService,
        private appLinks: AppLinksService,
        private drawingService: DrawingService,
        public pageUtils: PageUtilsService,
        public appZoom: AppZoomService,
        public appSelection: AppSelectionService) {
        this.updated$.pipe(
            debounceTime(300)
        ).subscribe((data: { app: SnAppDto }) => {
            this.changed.emit(data);
        });
    }

    trackById(index, item) {
        return item.id;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (!changes?.snApp?.currentValue) {
            return ;
        }

        this.display = false;
        this.loaded = false;
        this.drawing = false;
        this.showBackdrop = false;

        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.appActions.onUpdate(this.snApp).subscribe((data) => {
            this.drawingService.draw('svg', 'container', this.snApp.drawing);

            this.ref.detectChanges();
            for (const widget of this.widgetsCmp.toArray()) {
                widget.calculate();
            }

            this.update();

            this.updated$.next({ app: this.snApp });
        });

        this.subscription.add(this.appActions.onAddPage(this.snApp).subscribe((data: any) => {
            this.appZoom.center(this.svgElement, this.snApp, data.page);
        }));

        this.subscription.add(this.appActions.onZoomPage(this.snApp).subscribe((data: any) => {
            this.appZoom.center(this.svgElement, this.snApp, data.page, data.scale);
        }));

        this.subscription.add(this.appSelection.onSelect(this.snApp).subscribe((event: AppSelectionEvent) => {
            if (event && !event.rightClickMode) {
                this.onCloseContextmenu();
            }
        }));

        this.subscription.add(this.appActions.onShowedWidgetSelector(this.snApp).subscribe(() => {
            this.ref.detectChanges();
            this.initializeDrag();
        }));

        this.subscription.add(this.appContextMenu.showingContextmenu.subscribe((show: boolean) => {
            this.showContextmenu = show;
        }));

         /* drawing */
         this.subscription.add(this.appActions.onDrawing(this.snApp).subscribe((data: { drawing: boolean; showBackdrop: boolean }) => {
            this.drawing = data.drawing;
            this.showBackdrop = data.showBackdrop;
            if (!data.drawing) {
                this.appZoom.lockZoom('mouse', false);
                this.initializeSvg();
                this.initializeDrag();
                this.initializeShortcut();
            } else {
                this.appSelection.unselect(this.snApp);
                this.appZoom.lockZoom('mouse', true);
                d3.select('#svg').on('click', null);
            }
        }));

        this.ref.detectChanges();
        setTimeout(() => {
            this.initialize();
            this.updated$.next({ app: this.snApp });
        }, 0);
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    initialize() {
        this.ref.detectChanges();

        this.appZoom.initialize(this.svgElement, this.snApp, this.ref);
        this.snDOM.initialize(this.svgElement, this.appZoom.transform); // context menu
        this.appSelection.unselect(this.snApp);
        this.appActions.initializeDisplayStates(this.snApp);

        // load the component
        this.loaded = true;
        this.ref.detectChanges();

        // display the view
        this.display = true;
        this.ref.detectChanges();

        this.update();
    }

    initializeSvg() {
        const self: AppLayoutComponent = this;
        d3.select('#svg').on('click', () => {
            self.appSelection.unselect(self.snApp);

            if (self.actionView) {
                self.actionView();
                self.actionView = null;
            }
        });

        d3.selectAll('.page, .page-selector').on('click', (d, i, nodes) => {
            d3.event.stopPropagation();
            const page = self.snApp.pages.find((p) => p.id === d3.select(nodes[i]).attr('id'));

            if (!page) {
                return;
            }
            if (self.actionView) {
                self.actionView();
                self.actionView = null;
            } else {
                self.appSelection.select(d3.event, self.snApp, { element: page, type: 'page' });
            }
        });
    }

    initializeDrag() {
        this.pageDrag.initializeAddWidget(this.snApp, d3.select('#svg').select('#container'), this.settings);
        this.pageDrag.initializeDrag(this.snApp, d3.select('#svg').select('#container'));
        this.pageDrag.initializeSelector(this.snApp, d3.select('#svg').select('#container'));
    }

    initializeShortcut() {
        const self: AppLayoutComponent = this;
        // Manage Key Pressed
        d3.select('body')
            .on('keydown', () => {
                if (!document.activeElement || (!(document.activeElement as HTMLElement).isContentEditable)) {
                    if (document.activeElement.tagName === 'BODY') {
                        // Extended Shortcut
                        for (const shortcut of this.settings.shortcut.extended) {
                            if (d3.event.key === shortcut.key &&
                                shortcut.filter() &&
                                !!d3.event.ctrlKey === !!shortcut.ctrlKey &&
                                !!d3.event.altKey === !!shortcut.altKey &&
                                !!d3.event.shiftKey === !!shortcut.shiftKey) {
                                d3.event.preventDefault();
                                shortcut.onShortCut();
                                break;
                            }
                        }

                        // REMOVE
                        if (d3.event.keyCode === 46 || (navigator.platform.toUpperCase().indexOf('MAC') >= 0 && d3.event.keyCode === 8)) {
                            d3.event.preventDefault();
                            self.appActions.remove(self.snApp);
                        }

                        // SELECT ALL
                        if (d3.event.ctrlKey && d3.event.keyCode === 65) {
                            d3.event.preventDefault();
                            self.appSelection.selectAll(self.snApp);
                        }

                        // GROUP
                        if (d3.event.ctrlKey && d3.event.keyCode === 71) {
                            d3.event.preventDefault();
                            self.appActions.group(self.snApp);
                        }

                        // UNGROUP
                        if (d3.event.ctrlKey && d3.event.keyCode === 85) {
                            d3.event.preventDefault();
                            self.appActions.ungroup(self.snApp);
                        }

                        // COPY STYLE
                        if (d3.event.ctrlKey && d3.event.shiftKey && d3.event.keyCode === 67) {
                            d3.event.preventDefault();
                            self.appClipboard.copyStyle();
                        }

                        // COPY
                        if (d3.event.ctrlKey && d3.event.keyCode === 67 && !d3.event.shiftKey ) {
                            d3.event.preventDefault();
                            self.appClipboard.copy();
                        }

                        // PASTE STYLE
                        if (d3.event.ctrlKey && d3.event.shiftKey && d3.event.keyCode === 86) {
                            d3.event.preventDefault();
                            self.appClipboard.pasteStyle(self.snApp);
                        }

                        // PASTE
                        if (d3.event.ctrlKey && d3.event.keyCode === 86 && !d3.event.shiftKey) {
                            d3.event.preventDefault();
                            self.appClipboard.paste(self.snApp);
                        }

                        // UNDO
                        if (d3.event.ctrlKey && d3.event.keyCode === 90) {
                            d3.event.preventDefault();
                            self.settings.undo();
                            self.appSelection.unselect(self.snApp);
                            self.appActions.notifyUpdate(self.snApp);
                        }

                        // REDO
                        if (d3.event.ctrlKey && d3.event.keyCode === 89) {
                            d3.event.preventDefault();
                            self.settings.redo();
                            self.appSelection.unselect(self.snApp);
                            self.appActions.notifyUpdate(self.snApp);
                        }

                        // LOCK / UNLOCK
                        if (d3.event.ctrlKey && d3.event.shiftKey && d3.event.keyCode === 76) {
                            d3.event.preventDefault();
                            self.appActions.lockUnlock(self.snApp, self.appActions.lockOrUnlock());
                        }

                        // Arrows actions
                        if (self.isArrowKey(d3.event.key)) {
                            d3.event.preventDefault();

                            if (d3.event.ctrlKey || d3.event.altKey) {
                                // Z-INDEX
                                let type: '++' | '+' | '--' | '-';
                                if (d3.event.key === 'ArrowUp') {
                                    type = d3.event.altKey ? '++' : '+';
                                } else {
                                    type = d3.event.altKey ? '--' : '-';
                                }

                                self.appActions.changeZIndex(self.snApp, type);
                            } else {
                                // TRANSLATE XY
                                const step = (d3.event.shiftKey) ? 10 : 1;
                                switch (d3.event.key) {
                                    case 'ArrowLeft' :
                                        self.appActions.translateXY(self.snApp, -step, 0);
                                        break;
                                    case 'ArrowRight' :
                                        self.appActions.translateXY(self.snApp, step, 0);
                                        break;
                                    case 'ArrowUp' :
                                        self.appActions.translateXY(self.snApp, 0, -step);
                                        break;
                                    case 'ArrowDown' :
                                        self.appActions.translateXY(self.snApp, 0, step);
                                        break;
                                }
                            }
                        }

                        // Share Component
                        if (d3.event.shiftKey && d3.event.keyCode === 83) {
                            d3.event.preventDefault();
                            self.appActions.shareSelected(self.snApp);
                        }

                        // hard update shared referencies
                        if (d3.event.shiftKey && d3.event.keyCode === 72) {
                            d3.event.preventDefault();
                            self.appActions.hardUpdateShared(self.snApp);
                        }

                        // mixed update shared referencies
                        if (d3.event.shiftKey && d3.event.keyCode === 77) {
                            d3.event.preventDefault();
                            self.appActions.mixedUpdateShared(self.snApp);
                        }

                        // rename shared Component
                        if (d3.event.shiftKey && d3.event.keyCode === 82) {
                            d3.event.preventDefault();
                            self.appActions.notifyRenameShared(self.snApp);
                        }

                        // delete shared referencies
                        if (d3.event.shiftKey && d3.event.keyCode === 68) {
                            d3.event.preventDefault();
                            self.appActions.deleteShared(self.snApp);
                        }

                        // add shared component to all pages
                        if (d3.event.shiftKey && d3.event.keyCode === 65) {
                            d3.event.preventDefault();
                            self.appActions.addsharedtoallPages(self.snApp);
                        }
                    }
                }
            });
    }

    update() {
        if (this.drawing) {
            return ;
        }
        this.ref.detectChanges();
        this.initializeDrag();
        this.appActions.initializeDisplayStates(this.snApp);
        this.appLinks.drawTransitions(this.snApp);
        this.contextMenu();
        this.initializeSvg();
        this.initializeShortcut();
    }

    contextMenu() {
        this.appContextMenu.contextmenu(this.snApp, d3.select('#svg'), this.settings,
            () => {
                if (this.actionView) {
                    this.actionView = null;
                    d3.event.stopPropagation();
                    return;
                }
            }, (menu: SnContextmenu) => {
                d3.event.preventDefault();
                if (!menu) {
                    return;
                }

                this.menu = null;
                this.ref.detectChanges();

                this.menu = menu;
                this.mouse = d3.mouse(d3.select('#svg').node());
                this.svgElementContainer = this.svgElement.nativeElement.getBoundingClientRect();

                this.appContextMenu.showContextmenu(true);
                this.ref.detectChanges();

            }, () => { this.onCloseContextmenu(); });
    }

    onCloseContextmenu() {
        this.menu = null;
        this.appContextMenu.showContextmenu(false);
    }

    private isArrowKey(key: string): boolean {
        return ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'].includes(key);
    }
}
