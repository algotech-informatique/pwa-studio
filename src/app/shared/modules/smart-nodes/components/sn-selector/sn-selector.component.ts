import { Component, Input, Output, EventEmitter, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { SnEntryComponents, SnEntryComponent } from '../../dto';
import * as _ from 'lodash';
import { SnTranslateService, SnActionsService } from '../../services';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SnNode, SnView } from '../../models';

@Component({
    selector: 'sn-selector',
    templateUrl: './sn-selector.component.html',
    styleUrls: ['./sn-selector.component.scss'],
})
export class SnSelectorComponent implements OnInit, OnDestroy {
    @ViewChild('search') searchEdit: ElementRef;

    @Input() snEntryComponents: SnEntryComponents;
    @Input() node: SnNode;
    @Input() snView: SnView;

    @Output() selectedComponent = new EventEmitter();

    snEntryComponentsFiltered: SnEntryComponents;
    searchValue = '';
    placeHolder = '';

    subscription: Subscription;

    constructor(
        private snAction: SnActionsService,
        private snTranslate: SnTranslateService,
        private translateService: TranslateService,
    ) {
    }

    ngOnInit() {
        this.placeHolder = this.translateService.instant('SELECTOR-SEARCH-BOX');
        this.snEntryComponentsFiltered = _.cloneDeep(this.snEntryComponents);

        // select search focus after added
        this.subscription = this.snAction.onNodeUpdate(this.snView, 'add').subscribe((data: { node: SnNode }) => {
            if (data.node.id === this.node.id && this.searchEdit) {
                this.searchEdit.nativeElement.focus();
            }
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    filterElements() {
        this.snEntryComponentsFiltered = _.cloneDeep(this.snEntryComponents);
        for (const group of this.snEntryComponentsFiltered.groups) {
            group.components = _.reduce(group.components, (result, component: SnEntryComponent) => {
                const displayName = this.snTranslate.transform(component.displayName);
                if (displayName.toLowerCase().indexOf(this.searchValue.toLowerCase()) > -1) {
                    result.push(component);
                }
                return result;
            }, []);
        }

        this.snEntryComponentsFiltered.groups = this.snEntryComponentsFiltered.groups.filter((group) => {
            return group.components.length > 0;
        });
    }

    onClicked(element: SnEntryComponent) {
        this.selectedComponent.emit(element.schema);
    }

    clearSearchBar() {
        this.searchValue = '';
        this.filterElements();
    }
}
