import { Component, Input, Output, EventEmitter, OnDestroy, AfterViewInit, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { TabDto } from '../../dtos';
import { MessageService } from '../../services';
import { Subscription } from 'rxjs';
import { TabContextMenuEvent } from './tabs-context-menu/tabs-context-menu';

@Component({
    selector: 'app-tabs',
    styleUrls: ['./tabs.component.scss'],
    templateUrl: 'tabs.component.html',
})
export class TabsComponent implements OnDestroy, AfterViewInit, OnChanges {

    @Input() tabs: TabDto[] = [];
    @Output() closeTab = new EventEmitter();
    @Output() selectTab = new EventEmitter();
    @Output() rightClickTab = new EventEmitter<TabContextMenuEvent>();

    @ViewChild('tabsContainer') tabsContainer: ElementRef;

    subscription: Subscription;

    constructor(public messageService: MessageService) {
        this.subscription = this.messageService.get('env-rm').subscribe((uuid: string) => {
            _.each(this.tabs, (tab: TabDto) => {
                if (tab.refUuid === uuid) {
                    this.clickCloseTab(tab);
                }
            });
        });
    }

    ngAfterViewInit() {
        this.tabsContainer.nativeElement.addEventListener('wheel', (event) => {
            event.preventDefault();
            // horizontal instead of natural vertical scroll
            this.tabsContainer.nativeElement.scrollLeft += event.deltaY;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    clickSelectTab(tab: TabDto) {
        this.selectTab.emit(tab);
    }

    onRightClickTab(event: any, tab: TabDto) {
        event.preventDefault();
        this.rightClickTab.emit({ event, tab } as TabContextMenuEvent);
    }

    onAuxClickTab(event: any, tab: TabDto) {
        // as auxclick event is triggered by all mouse buttons except left, we need to test if pressed button is middle button (code 1)
        if (event.button === 1) {
            event.preventDefault();
            this.closeTab.emit(tab);
        }
    }

    clickCloseTab(tab: TabDto) {
        this.closeTab.emit(tab);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.tabs?.currentValue?.length > changes?.tabs?.previousValue?.length) {
            // scroll to right limit of tabs container when new tab is added
            setTimeout(() => {
                this.tabsContainer.nativeElement.scrollLeft = 1000000;
            }, 200); // FIXME hack to be sure new graphical element (tab) has been rendered before scrolling
        }
    }

}
