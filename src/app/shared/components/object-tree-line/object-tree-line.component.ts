import { Component, Input } from '@angular/core';
import { ObjectTreeLineDto } from '../../dtos/object-tree-line.dto';
import { MessageService, ContextmenuService, SessionsService, ClipboardService } from '../../services';
import { cmTreeLine } from '../explorer/explorer-contextmenu-schema/tree-line';
import { SnContextmenu } from '../../modules/smart-nodes';
import {
    cmTreeExpanderWorkflows, cmTreeExpanderSmartflows, cmTreeExpanderReports, cmTreeExpanderApps
} from '../explorer/explorer-contextmenu-schema/tree-expander';
import * as _ from 'lodash';

@Component({
    selector: 'app-object-tree-line',
    styleUrls: ['./object-tree-line.component.scss'],
    templateUrl: './object-tree-line.component.html',
})
export class ObjectTreeLineComponent {

    @Input() level = 0;
    @Input() line: ObjectTreeLineDto;

    constructor(
        public messageService: MessageService,
        private contextmenuService: ContextmenuService,
        private sessionService: SessionsService,
        private clipboardService: ClipboardService,
    ) { }

    trackUuid(index: number, item): string {
        return item.uuid;
    }

    expandLine() {
        this.selectLine();
        this.line.state = !this.line.state;
        this.messageService.send('explorer-tree-expand', this.line);
    }

    selectLine() {
        if (this.line.selectable) {
            this.sessionService.selectEnv(this.line);
            this.messageService.send('explorer-tree-select', this.line);
        }
    }

    noFolderClick(event) {
        event.preventDefault();
        event.stopPropagation();
        this.line.active = true;
        if (this.line.type !== 'smartmodel') {
            const excludedTypes = ['smartflow', 'report'];
            const isSAdmin = this.sessionService.active &&
                _.indexOf(this.sessionService.active.datas.read.localProfil.groups, 'sadmin') !== -1;
            const menu: SnContextmenu = cmTreeLine(() => {
                this.clipboardService.copyResource(this.line.customerKey, this.line.host, this.line.refUuid);
            }, () => {
                this.sessionService.removeElement(this.line);
            }, () => {
                this.line.renaming = true;
            },
                (isSAdmin && !this.line.selected),
                this.clipboardService.canCopy(this.line.type),
            );
            this.showTreeLineContextmenu(menu, event);
        }
    }

    folderClick(event) {
        event.preventDefault();
        event.stopPropagation();
        let menu: SnContextmenu;
        this.line.active = true;
        switch (this.line.type) {
            case 'report':
                menu = cmTreeExpanderReports(() => {
                    this.sessionService.createNewDirectory('report', this.line.customerKey, this.line.host, false, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewResource('report', this.line.customerKey, this.line.host, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.removeDirectory(this.line);
                    this.line.state = false;
                }, () => {
                    this.line.renaming = true;
                },
                    (this.sessionService.validateChilds(this.line).length !== 0)
                );
                break;
            case 'app':
                menu = cmTreeExpanderApps(() => {
                    this.clipboardService.pasteResource(this.line.customerKey, this.line.host, 'app', this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewDirectory('app', this.line.customerKey, this.line.host, false, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewResource('app', this.line.customerKey, this.line.host, this.line, null, 'web');
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewResource('app', this.line.customerKey, this.line.host, this.line, null, 'mobile');
                    this.line.state = true;
                }, () => {
                    this.sessionService.removeDirectory(this.line);
                    this.line.state = false;
                }, () => {
                    this.line.renaming = true;
                },
                    (this.sessionService.validateChilds(this.line).length !== 0),
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('app'),
                );
                break;
            case 'workflow':
                menu = cmTreeExpanderWorkflows(() => {
                    this.clipboardService.pasteResource(this.line.customerKey, this.line.host, 'workflow', this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewDirectory('workflow', this.line.customerKey, this.line.host, false, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.createNewResource('workflow', this.line.customerKey, this.line.host, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.removeDirectory(this.line);
                    this.line.state = false;
                }, () => {
                    this.line.renaming = true;
                },
                    (this.sessionService.validateChilds(this.line).length !== 0),
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('workflow'),
                );
                break;
            case 'smartmodel':
                break;
            case 'smartflow':
                menu = cmTreeExpanderSmartflows(() => {
                    this.clipboardService.pasteResource(this.line.customerKey, this.line.host, 'smartflow', this.line);
                    this.line.state = true;
                }, () => {
                    this.clipboardService.copyDirectory(this.line.customerKey, this.line.host, this.line.refUuid, this.line.type);
                }, () => {
                    this.sessionService.createNewDirectory('smartflow', this.line.customerKey, this.line.host, false, this.line);
                }, () => {
                    this.sessionService.createNewResource('smartflow', this.line.customerKey, this.line.host, this.line);
                    this.line.state = true;
                }, () => {
                    this.sessionService.removeDirectory(this.line);
                    this.line.state = false;
                }, () => {
                    this.line.renaming = true;
                }, () => {
                    this.messageService.send('connector-parameters.open', this.line);
                },
                    (this.sessionService.validateChilds(this.line).length !== 0),
                    !this.clipboardService.isEmpty(),
                    !this.clipboardService.canPasteResource('smartflow'),
                    this.clipboardService.canCopy('smartflow')
                        && !this.clipboardService.noChildSmartFlow(this.line)
                        && this.clipboardService.noFolder(this.line),
                    (this.line.isConnector === false),
                );
                break;
        }
        if (menu) {
            this.showTreeLineContextmenu(menu, event);
        }
    }


    showTreeLineContextmenu(menu: SnContextmenu, event: any) {
        event.stopPropagation();
        this.contextmenuService.showContextmenu(false);
        const mouse: number[] = [];
        mouse[0] = event.clientX;
        mouse[1] = event.clientY;
        this.contextmenuService.setContextmenu(menu, mouse);
        this.contextmenuService.showContextmenu(true);
    }
}
