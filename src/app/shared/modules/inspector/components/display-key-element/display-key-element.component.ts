import { Component, EventEmitter, Input, Output, OnChanges, ChangeDetectorRef, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import { PairDto, SnModelDto } from '@algotech-ce/core';
import { SnModelsService, SessionsService } from '../../../../services';
import { SnParam } from '../../../smart-nodes';
import { KeyFormaterService } from '@algotech-ce/angular';
import { fromEvent, Subscription } from 'rxjs';
import * as _ from 'lodash';
import { PopupContainerDto } from '../../dto/popup-container.dto';

@Component({
    selector: 'display-key-element',
    templateUrl: './display-key-element.component.html',
    styleUrls: ['./display-key-element.component.scss'],
})
export class DisplayKeyElementComponent {

    @ViewChild('container') container: ElementRef;

    @Input() title: string;
    @Input() key: string;
    @Input() snModel: SnModelDto;
    @Input() disabled = false;
    @Input() param: SnParam = null;
    @Input() params: SnParam[] = [];
    @Input() case: 'uppercase' | 'lowercase' | 'any' = 'any';
    @Input() suggestionsList: PairDto[];
    @Input() showIcon = true;
    @Input() placeholder: string;
    @Input() errorCalculation: (key: string) => boolean = this.hasError;
    @Input() formatKey = true;
    @Output() changed = new EventEmitter<string>();
    closeListSubscription: Subscription;

    error = false;
    keyContainer: PopupContainerDto;
    popupMargin = 3;
    showList = false;

    constructor(
        private snModelService: SnModelsService,
        private sessionService: SessionsService,
        private keyFormaterService: KeyFormaterService,
        private changeDetectorRef: ChangeDetectorRef,
    ) { }

    onKeyChanged() {
        this.key = this.validateCase(this.key);
        this.error = this.errorCalculation(this.key);
        if (!this.error) {
            this.changed.emit(this.validateCase(this.key));
        }
    }

    onInputClicked(event) {
        if (this.suggestionsList && !this.showList) {
            this.closeListSubscription = fromEvent(document, 'click').subscribe((ev) => {
                const className = (ev.target as HTMLInputElement).className;
                if ((!_.isString(className) || (_.isString(className) && !className.includes('select-item-list'))) && this.showList) {
                    this.clickOutsideList();
                } else if (!this.showList) {
                    ev.stopPropagation();
                    this.keyContainer = {
                        top: this.container.nativeElement.offsetTop,
                        height: this.container.nativeElement.offsetHeight,
                        left: this.container.nativeElement.offsetLeft,
                        containerClientRect: this.container.nativeElement.getBoundingClientRect(),
                    };
                    this.showList = !this.showList;
                    this.changeDetectorRef.detectChanges();
                    this.showList = true;
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    onKeyChanging() {
        if (this.suggestionsList && this.showList) {
            this.onKeyChanged();
            this.clickOutsideList();
        }
    }

    clickOutsideList() {
        this.showList = false;
        if (this.closeListSubscription) {
            this.closeListSubscription.unsubscribe();
        }
    }

    selectSuggestion(suggestion: PairDto) {
        this.key = suggestion.key;
        this.onKeyChanged();
        this.clickOutsideList();
    }

    private hasError(key: string): boolean {
        if (!this.snModel) { return false; }
        return !this.snModelService.checkKey(
            this.snModel,
            key,
            this.sessionService.active.datas.write.snModels,
            this.sessionService.active.datas.read.smartModels,
            this.param,
            this.params,
        );
    }

    private validateCase(key: string) {
        if (this.suggestionsList && this.suggestionsList.length > 0 && this.suggestionsList.some(pair => pair.key === key)) {
            return key;
        }
        if (this.formatKey) {
            switch (this.case) {
                case 'any':
                    return this.keyFormaterService.format(key);
                case 'lowercase':
                    return this.keyFormaterService.format(key).toLowerCase();
                case 'uppercase':
                    return this.keyFormaterService.format(key).toUpperCase();
            }
        } else {
            return key;
        }
    }

}
