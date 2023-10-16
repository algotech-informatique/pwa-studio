import { ListItem } from './../../dto/list-item.dto';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, tap } from 'rxjs/operators';
import { IconDto } from '@algotech-ce/core';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';
import { IconPopUpService } from '../../../../components/pop-ups/icon-pop-up/icon-pop-up.service';

interface DisplayIcon {
    key: string;
    popup: string;
}

@Component({
    selector: 'select-icon',
    templateUrl: './select-icon.component.html',
    styleUrls: ['./select-icon.component.scss'],
})
export class SelectIconComponent {

    @ViewChild('searchInput') searchInput: ElementRef;
    @ViewChild('container') container: ElementRef;
    @Input() insideCard = false;
    @Input() icon: string;
    @Input() error = false;
    @Input() title: string;
    @Output() changed = new EventEmitter();

    selectedItem: ListItem;
    showIcons = false;
    obsSearch = new Subject();
    searchValue = '';
    tabIcons: DisplayIcon[] = [];
    page = 0;
    pageSize = 60; // multiple de 12 car affichage 4x4
    displayTabIcons = false;
    moreDataToLoad = false;
    isLoading = false;
    iconContainer: PopupContainerDto;
    popupMargin = 3;

    constructor(
        private iconPopUpService: IconPopUpService,
        private changeDetectorRef: ChangeDetectorRef,
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

    onIconChanged(icon: string) {
        this.icon = icon;
        this.showIcons = false;
        this.changed.emit(this.icon);
    }

    iconPopUp(event: any) {
        event.stopPropagation();
        this.page = 0;
        this.showIcons = !this.showIcons;
        this.iconContainer = {
            top: this.container.nativeElement.offsetTop,
            height: this.container.nativeElement.offsetHeight,
            left: this.container.nativeElement.offsetLeft,
            containerClientRect: this.container.nativeElement.getBoundingClientRect(),
        };
        this.changeDetectorRef.detectChanges();
        this.obsSearch.next(null);
        if (this.showIcons) { this.searchInput.nativeElement.focus(); }
    }

    filterElements() {
        this.page = 0;
        this.tabIcons = [];
        this.obsSearch.next(null);
    }

    clearSearchBar() {
        this.page = 0;
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
            catchError((e) => of([])),
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
                this.changeDetectorRef.detectChanges();
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
