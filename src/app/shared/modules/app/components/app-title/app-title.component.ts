import { SnAppDto, SnPageDto } from '@algotech-ce/core';
import { Component, Input } from '@angular/core';
import { AppActionsService, AppSelectionService, AppZoomService } from '../../services';

@Component({
    selector: 'app-title',
    template: `
    <div class="content">
        <div class="title"
            [class]="appSelection.selections.pages | elementSelected:page"
            [ngClass]="{
                'highlight': page.displayState?.highlight,
                'error': error,
                'draghover': page.displayState?.draghover
            }">
            <i class="fa-solid fa-home" *ngIf="page.main"></i>
            {{ page.displayName | snlang }}
        </div>
        <div class="variables" *ngIf="page.variables.length > 0">
            <i class="fa-solid fa-arrow-circle-right"></i>
            <span *ngFor="let variable of page.variables, let i = index">
                <span class="item"
                    [title]="variable.type"
                    (click)="onSelect('variable.' + variable.key)" [ngClass]="{
                    'active': page.displayState?.activeZone === 'variable.' + variable.key
                }">{{variable.key }}</span>
                <span>{{ ((i < page.variables.length - 1) ? ', ' : '') }}</span>
            </span>
            <div class="badge">
                {{page.variables.length}}
            </div>
        </div>
        <div class="datasources" *ngIf="page.dataSources.length > 0">
            <i class="fa-solid fa-database"></i>
            <span *ngFor="let datasource of page.dataSources, let i = index">
                <span class="item"
                    [title]="appActions.update | getType: datasource"
                    (click)="onSelect('datasource.' + datasource.key)"  [ngClass]="{
                    'active': page.displayState?.activeZone === 'datasource.' + datasource.key
                }">{{datasource.key }}</span>
                <span>{{ ((i < page.dataSources.length - 1) ? ', ' : '') }}</span>
            </span>
            <div class="badge">
                {{page.dataSources.length}}
            </div>
        </div>
    </div>
    `,
    styleUrls: ['./app-title.component.scss']
})

export class AppTitleComponent {
    @Input()
    snApp: SnAppDto;

    @Input()
    page: SnPageDto;

    @Input()
    error: boolean;

    constructor(public appSelection: AppSelectionService, public appActions: AppActionsService, public appZoom: AppZoomService) { }

    onSelect(key: string) {
        this.appSelection.unselect(this.snApp);
        this.page.displayState.activeZone = key;
    }
}
