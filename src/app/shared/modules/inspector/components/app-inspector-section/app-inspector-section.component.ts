import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AppActionsService } from '../../../app/services/app-actions/app-actions.service';
import { InspectorSectionButton } from '../../dto/inspector-section-button.dto';
import * as _ from 'lodash';
import { sections } from '../../../app-custom/widgets/_data/inspector-sections';

@Component({
    selector: 'app-inspector-section',
    template: `
        <inspector-section
            [title]="title"
            [titleIcon]="titleIcon"
            [subTitle]="subTitle"
            [subTitleIcon]="subTitleIcon"
            [defaultOpen]="defaultOpen"
            [display]="display"
            [color]="color"
            [button]="button"
            [section]="section"
            [showLock]="(appActions.update | isShared:snApp: widgets) && showLock"
            [locked]="appActions.update | isLocked:section: widgets"
            (closeSection)="onCloseSection()"
            (clickButton)="onClickButton($event)"
            (lockChange)="onLockChange($event)"
        >
            <ng-content></ng-content>
        </inspector-section>
    `,
    styleUrls: ['app-inspector-section.component.scss'],
})

export class AppInspectorSectionComponent implements AfterViewInit {

    @Input() snApp: SnAppDto;
    @Input() title: string;
    @Input() titleIcon: string;
    @Input() subTitle: string;
    @Input() subTitleIcon: string;
    @Input() defaultOpen = true;
    @Input() display: 'section' | 'card' = 'section';
    @Input() color: string;
    @Input() button: InspectorSectionButton;
    @Input() section = '';
    @Input() showLock = true;
    @Input() widgets: SnPageWidgetDto[];
    @Output() closeSection = new EventEmitter();
    @Output() clickButton = new EventEmitter<string>();

    constructor(public appActions: AppActionsService) {

    }

    ngAfterViewInit() {
        if (!environment.production) {
            if (!this.section) {
                console.warn('section required for lock some part of widget');
            } else if(_.isEqual(_.at(sections, [this.section]), [undefined])) {
                console.error(`section unknown ${this.section}`);
            }
        }
    }

    onCloseSection() {
        this.closeSection.emit();
    }
    onClickButton(event: string) {
        this.clickButton.emit(event);
    }
    onLockChange(event: { section: string; locked: boolean }) {
        this.appActions.lockWidgetProperty(this.snApp, event.section, event.locked, this.widgets);
    }

}
