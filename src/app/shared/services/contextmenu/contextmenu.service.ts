import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AppContextmenuService } from '../../modules/app/services';
import { SnContextmenuService, SnContextmenu } from '../../modules/smart-nodes';

@Injectable()
export class ContextmenuService {

    mouse: number[];
    menu: SnContextmenu;
    showingContextmenu = new Subject<boolean>();
    snSubscription: Subscription;
    exSubscription: Subscription;

    constructor(
        private snContextmenuService: SnContextmenuService,
        private appContextmenuService: AppContextmenuService,
    ) {
        this.snSubscribe();
        this.exSubscribe();
    }

    snSubscribe() {
        this.snSubscription = this.snContextmenuService.showingContextmenu.subscribe(() => {
            // each subscribed event from SN, close the Explorer context menu
            this.exSubscription.unsubscribe(); // stop recursive
            this.showContextmenu(false);
            this.exSubscribe();
        });
        this.snSubscription.add(this.appContextmenuService.showingContextmenu.subscribe(() => {
                // each subscribed event from SN, close the Explorer context menu
                this.exSubscription.unsubscribe(); // stop recursive
                this.showContextmenu(false);
                this.exSubscribe();
            })
        );
    }

    exSubscribe() {
        this.exSubscription = this.showingContextmenu.subscribe(() => {
            // each subscribed event from Explorer, close the SN context menu
            this.snSubscription.unsubscribe(); // stop recursive
            this.snContextmenuService.showContextmenu(false);
            this.appContextmenuService.showContextmenu(false);
            this.snSubscribe();
        });
    }

    setContextmenu(menu: SnContextmenu, mouse: number[]) {
        this.menu = menu;
        this.mouse = mouse;
    }

    showContextmenu(show: boolean) {
        this.showingContextmenu.next(show);
    }
}
