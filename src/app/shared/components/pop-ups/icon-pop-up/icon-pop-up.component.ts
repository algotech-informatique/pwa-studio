import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';
import { SnView } from '../../../modules/smart-nodes';
import { IconPopUpService } from './icon-pop-up.service';
import { IconDto } from '@algotech/core';
import * as _ from 'lodash';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, tap } from 'rxjs/operators';


interface DisplayIcon {
    key: string;
    popup: string;
}

@Component({
    selector: 'icon-pop-up',
    templateUrl: './icon-pop-up.component.html',
    styleUrls: ['./icon-pop-up.component.scss'],
})
export class IconPopUpComponent implements OnChanges {

    maxHeight = 250;
    searchValue = '';
    tabIcons: DisplayIcon[] = [];

    page = 1;
    pageSize = 60; // multiple de 12 car affichage 4x4
    displayTabIcons = false;
    moreDataToLoad = false;
    isLoading = false;

    @Input() snView: SnView;
    @Input() hideHeader = false;

    _top: any = null;
    @Input()
    get top() {
        return this._top;
    }

    @Output() topChange = new EventEmitter();
    set top(data) {
        this._top = data;
        if (!this._top) {
            this.closed.emit();
        }
        this.topChange.emit(data);
    }
    @Output() changed = new EventEmitter();
    @Output() closed = new EventEmitter();

    obsSearch = new Subject();

    constructor(
        private iconPopUpService: IconPopUpService,
    ) {

        let subscription: Subscription = null;
        this.obsSearch.pipe(
            debounceTime(150),
            tap(() => {
                if (subscription) {
                    subscription.unsubscribe();
                }
            }),
            tap(() => {
                subscription = this.loadMore().subscribe();
        })).subscribe();
    }

    close() {
        this.top = null;
    }

    ngOnChanges() {
        if (this.top) {
            this.page = 1;
            this.obsSearch.next(null);
        }
    }

    sendIcon(selectedIcon) {
        this.changed.emit(selectedIcon);
        this.close();
    }

    filterElements() {
        this.page = 1;
        this.tabIcons = [];
        this.obsSearch.next(null);
    }

    clearSearchBar() {
        this.page = 1;
        this.tabIcons = [];
        this.searchValue = '';
        this.obsSearch.next(null);
    }

    onLoadMore() {
        this.page++;
        this.obsSearch.next(null);
    }

    loadMore() {
        this.displayTabIcons = true;
        this.isLoading = true;
        this.moreDataToLoad = false;
        return this.loadIcons(this.page, this.pageSize).pipe(
            catchError((e) => {
                return of([]);
            }),
            map((icons: IconDto[]) => {
                if (icons && icons.length > 0) {
                    this.tabIcons = this.tabIcons.concat(_.uniqBy(_.map(icons, (icon) => {
                        const split = icon.name.split('.');
                        const icn: DisplayIcon = {
                            key: 'fa-solid fa-' + split[0],
                            popup: split[0],
                        };
                        return icn;
                    }), 'key'));
                    this.moreDataToLoad = (this.tabIcons.length - (this.page * this.pageSize)) === 0;
                } else {
                    this.moreDataToLoad = false;
                }
                this.isLoading = false;
        }));
    }

    loadIcons(page: number, pageSize: number) {
        if (this.searchValue !== '') {
            return this.iconPopUpService.getSearchedIcons(this.searchValue, page, pageSize);
        } else {
            return this.iconPopUpService.getAllIcons(page, pageSize);
        }
    }
}
