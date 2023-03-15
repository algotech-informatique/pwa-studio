import { Component, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import { SessionsService, ClipboardService, ContextmenuService, MessageService } from '../../services';
import { ModuleTreeLineDto } from '../../dtos';
import { SnContextmenu } from '../../modules/smart-nodes';
import { cmEnvironmentreports, cmEnvironmentApps, cmEnvironmentWorkflows, cmEnvironmentSmartflows, cmDataBaseExplorer }
    from '../explorer/explorer-contextmenu-schema/tree-expander';

@Component({
    selector: 'app-module-tree-line',
    styleUrls: ['./module-tree-line.component.scss'],
    templateUrl: './module-tree-line.component.html',
})
export class ModuleTreeLineComponent {

    @Input() expand = true;
    @Input() module: ModuleTreeLineDto;
    @Input() root = true;
    @Output() select = new EventEmitter();

    constructor(
        private sessionsService: SessionsService,
        private contextmenuService: ContextmenuService,
        private clipboardService: ClipboardService,
        private messageService: MessageService) {
    }

    trackUuid(index: number, item): string {
        return item.uuid;
    }

    selectModule(module: ModuleTreeLineDto) {
        this.select.emit(module);
    }

    moduleContextMenu(event: any) {
        event.preventDefault();
        let menu: SnContextmenu = null;
        const session = this.sessionsService.findSession(this.module.host, this.module.customerKey);

        switch (this.module.type) {
            case 'report':
                menu = cmEnvironmentreports(() => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewDirectory(
                        'report',
                        session.environment.customerKey,
                        session.connection.host,
                        false,
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewResource(
                        'report',
                        session.environment.customerKey,
                        session.connection.host,
                    );
                });
                break;
            case 'app':
                menu = cmEnvironmentApps(() => {
                    this.sessionsService.expandModule(this.module);
                    this.clipboardService.pasteResource(
                        session.environment.customerKey,
                        session.environment.host,
                        'app',
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewDirectory(
                        'app',
                        session.environment.customerKey,
                        session.connection.host,
                        false,
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewResource(
                        'app',
                        session.environment.customerKey,
                        session.connection.host,
                        null,
                        null,
                        'web',
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewResource(
                        'app',
                        session.environment.customerKey,
                        session.connection.host,
                        null,
                        null,
                        'mobile',
                    );
                },
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('app'),
                );
                break;
            case 'workflow':
                menu = cmEnvironmentWorkflows(() => {
                    this.sessionsService.expandModule(this.module);
                    this.clipboardService.pasteResource(
                        session.environment.customerKey,
                        session.environment.host,
                        'workflow',
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewDirectory(
                        'workflow',
                        session.environment.customerKey,
                        session.connection.host,
                        false,
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewResource(
                        'workflow',
                        session.environment.customerKey,
                        session.connection.host,
                    );
                },
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('workflow'),
                );
                break;
            case 'smartflow':
                menu = cmEnvironmentSmartflows(() => {
                    this.sessionsService.expandModule(this.module);
                    this.sessionsService.createNewDirectory(
                        'smartflow',
                        session.environment.customerKey,
                        session.environment.host,
                        (true),
                    );
                }, () => {
                    this.sessionsService.expandModule(this.module);
                    this.clipboardService.pasteDirectory(session.environment.customerKey, session.environment.host, 'smartflow', true);
                },
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('smartflow')
                );
                break;
            case 'database':
                menu = cmDataBaseExplorer(
                    () => this.messageService.send('mark-db-as-deleted', {}),
                    () => this.messageService.send('dump-db', {}),
                    () => this.messageService.send('restore-db', {}));
                break;
        }

        if (!menu) {
            event.stopPropagation();
            return;
        }

        this.module.active = true;
        this._callContextmenu(menu, event);
    }

    _callContextmenu(menu: SnContextmenu, event: any) {
        event.stopPropagation();
        this.contextmenuService.showContextmenu(false);
        const mouse: number[] = [];
        mouse[0] = event.clientX;
        mouse[1] = event.clientY;
        this.contextmenuService.setContextmenu(menu, mouse);
        this.contextmenuService.showContextmenu(true);
    }
}
