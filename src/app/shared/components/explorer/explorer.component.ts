import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, OnDestroy, Input } from '@angular/core';
import { MessageService, ContextmenuService } from '../../services';
import { ObjectTreeLineDto } from '../../dtos/object-tree-line.dto';
import { SessionsService } from '../../services/sessions/sessions.service';
import { SessionDto } from '../../dtos/session.dto';
import { SnContextmenu } from '../../modules/smart-nodes';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import { cmSessionExpander } from './explorer-contextmenu-schema/session-expander';
import { EnvironmentDisplayDto, ModuleTreeLineDto } from '../../dtos';
import { AuthService } from '@algotech/angular';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.scss'],
})
export class ExplorerComponent implements OnInit, OnDestroy {

    _expand: any = true;
    @Input()
    get expand() {
        return this._expand;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @Output()
    expandChange = new EventEmitter();
    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    set expand(data) {
        this._expand = data;
        this.expandChange.emit(data);
    }

    workflowsTree: ObjectTreeLineDto[] = [];
    mouse: number[] = [0, 0];
    menu: SnContextmenu;
    subscription: Subscription;
    showContextmenu: boolean;

    public sessions: SessionDto[] = [];

    constructor(
        public messageService: MessageService,
        private sessionsService: SessionsService,
        private changeDetectorRef: ChangeDetectorRef,
        private contextmenuService: ContextmenuService,
        private authService: AuthService,
        private titleService: Title,
    ) {
        this.subscription = this.contextmenuService.showingContextmenu.subscribe((show: boolean) => {
            if (show) {
                // FIXME: I added 'tabs-context-menu' condition so the context menu appears for tabs even if explorer is closed
                // this is meant to be removed if/once context-menu management has been refactored and un-specialized
                // see: https://git.myalgotech.io/roadmap/vision/-/issues/1909
                if (!['tabs-context-menu', 'selection', 'sharedComponents'].includes(this.contextmenuService.menu?.id) && !this.expand) {
                    return ;
                }
                this.menu = this.contextmenuService.menu;
                this.mouse = this.contextmenuService.mouse;
            }
            this.showContextmenu = show;
            this.changeDetectorRef.detectChanges();
        });

        this.subscription.add(this.messageService.get('moveexplorer.refresh').subscribe(() => {
            this.changeDetectorRef.detectChanges();
        }));
    }

    ngOnInit(): void {
        this.sessions = this.sessionsService.sessions;
    }

    selectModule(module: ModuleTreeLineDto) {
        switch (module.class) {
            case 'modules': {
                this.sessionsService.expandModule(module);
                module.state = true;

                // select first
                if (module.childs.length > 0 && _.every(module.childs, (c: ModuleTreeLineDto) => !c.state && !c.selected)) {
                    this.selectModule(module.childs[0] as ModuleTreeLineDto);
                }
            }
                break;
            case 'objects': {
                this.sessionsService.expandModule(module);
                module.state = true;
            }
                break;
            case 'module': {
                this.sessionsService.selectEnv(module);
                this.messageService.send('explorer-tree-select', module);
            }
                break;
        }
    }

    retractorClicked() {
        this.expand = !this.expand;
    }

    mousedown() {
        this.sessionsService.deactivateEnv();
    }

    expandCustomer(environment: EnvironmentDisplayDto) {
        if (environment.state) {
            environment.state = false;
            return ;
        }
        this.sessionsService.expandEnvironment(environment);
    }

    showExplorerContextmenu(menu: SnContextmenu, event: any) {
        event.stopPropagation();
        this.contextmenuService.showContextmenu(false);
        this.mouse[0] = event.clientX;
        this.mouse[1] = event.clientY;
        this.menu = menu;
        this.showContextmenu = true;
        this.changeDetectorRef.detectChanges();
    }

    onCloseContextmenu() {
        this.contextmenuService.showContextmenu(false);
    }

    showExpanderContextmenu(event: any, sessionIndex: number) {
        event.preventDefault();
        const menu: SnContextmenu = cmSessionExpander(() => {
            const host = this.sessions[sessionIndex].connection.host;
            const customerKey = this.sessions[sessionIndex].connection.customerKey;
            this.sessionsService.refresh(
                host,
                customerKey,
            );
        }, () => {
            const host = this.sessions[sessionIndex].connection.host;
            const customerKey = this.sessions[sessionIndex].connection.customerKey;

            this.sessionsService.disconnect(
                host,
                customerKey,
            );

            this.authService.logout().subscribe(() => {
                this.titleService.setTitle('Vision Studio');
            });
        });
        this.showExplorerContextmenu(menu, event);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
