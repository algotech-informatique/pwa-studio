import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import {
    ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild,
} from '@angular/core';
import { ContextmenuService } from '../../../../../services';
import { AppSettings } from '../../../../app/dto';
import { AppActionsService, AppContextmenuService } from '../../../../app/services';
import { SnContextmenu } from '../../../../smart-nodes';
import { UITree } from '../models/ui-tree';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'ui-tree-line',
    templateUrl: './ui-tree-line.component.html',
    styleUrls: ['ui-tree-line.component.scss'],
})
export class UITreeLineComponent implements OnChanges, OnDestroy {

    @Input() item: UITree;
    @Input() icon: string;
    @Input() name: string;
    @Input() selected: boolean;
    @Input() draghook: boolean;
    @Input() snApp: SnAppDto;
    @Input() settings: AppSettings;
    @Input() sharedItems = false;
    @Input() editionMode = false;
    @Output() selectLine = new EventEmitter();
    @Output() toggleLine = new EventEmitter<boolean>();
    @Output() nameChanged = new EventEmitter<string>();
    @Output() editing = new EventEmitter<{ editionMode: boolean }>();

    @ViewChild('inputName') inputName: ElementRef;
    @ViewChild('line') line: ElementRef;


    escape = false;
    mouse: number[] = [0, 0];
    menu: SnContextmenu;
    arrowClick = false;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private appActions: AppActionsService,
        private appContextMenu: AppContextmenuService,
        private contextmenuService: ContextmenuService,
    ) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.selected && this.selected && this.line) {
            this.line.nativeElement.scrollIntoView({ block: 'nearest' });
        }
        this.changeDetectorRef.detectChanges();
    }

    ngOnDestroy() {
        this.setHighlight(false);
    }

    setHighlight(value: boolean) {
        if (!this.item.element.displayState) {
            return;
        }
        if (this.item.element.displayState.highlight === value) {
            return;
        }
        if (value) {
            this.appActions.applyHighlight(this.item.snApp, this.item.element, this.sharedItems);
        } else {
            if (this.sharedItems) {
                this.item.element.displayState.highlight = false;
            }
            this.appActions.resetHighlight(this.item.snApp);
        }
    }

    select($event: any) {
        if (!this.arrowClick) {
            this.selectLine.emit($event);
        }
        this.arrowClick = false;
    }

    onArrowClick() {
        this.arrowClick = true;
        this.toggleLine.emit(!this.item.open);
    }

    editName() {
        this.editionMode = true;
        this.changeDetectorRef.detectChanges();
        this.inputName.nativeElement.select();
        this.editing.emit({ editionMode: this.editionMode });
    }

    saveName(name: string) {
        this.editionMode = false;
        if (!this.escape && name) {
            this.nameChanged.emit(name);
        }
        this.escape = false;
        this.editing.emit({ editionMode: this.editionMode });
    }

    closeInput() {
        this.editionMode = false;
        this.escape = true;
        this.editing.emit({ editionMode: this.editionMode });
    }

    showContextMenu(event: any) {
        this.select(event);
        event.preventDefault();
        event.stopPropagation();
        this.mouse[0] = event.clientX;
        this.mouse[1] = event.clientY;
        this.menu = this.appContextMenu.getMenuForSelection(this.snApp, this.settings);
        this.contextmenuService.setContextmenu(this.menu, this.mouse);
        this.contextmenuService.showContextmenu(true);
    }

    trackById(index: number, item: UITree) {
        return item.element.id;
    }

    trackBysharedId(index: number, item: UITree) {
        return (item.element as SnPageWidgetDto).sharedId;
    }

}
