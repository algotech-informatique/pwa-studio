import { SnAppDto, SnPageDto, SnPageWidgetDto } from '@algotech-ce/core';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WidgetParametersInterface } from '../../../../models/widget-parameters.interface';
import * as _ from 'lodash';
import { WidgetInput } from '../../../../dto/widget-input.dto';
import { AppCustomService } from '../../../../services';
import { Observable } from 'rxjs';
import { ListItem } from '../../../../../inspector/dto/list-item.dto';
import { EventTextInputChanged } from '../../../../../inspector/dto/event-text-input-changed.dto';
import { PageWidgetParametersService } from '../../../../../inspector/services/page-widget-parameters.service';

@Component({
    selector: 'tab-widget-parameters',
    templateUrl: './tab-widget-parameters.component.html',
    styleUrls: ['./tab-widget-parameters.component.scss'],
})
export class TabWidgetParametersComponent implements WidgetParametersInterface, OnInit {

    changed = new EventEmitter();

    snApp: SnAppDto;
    page: SnPageDto;
    widget: SnPageWidgetDto;

    items: Observable<WidgetInput[]>;
    pageList: ListItem[];

    constructor(
        private pageWidgetParametersService: PageWidgetParametersService,
        private appCustomService: AppCustomService,
    ) { }

    ngOnInit() {
        this.pageList = this.pageWidgetParametersService.getPagesList(this.snApp);
    }

    initialize() {
        this.items = this.appCustomService.getAvailableInputs$(this.page, this.widget);
    }

    onIconChanged(icon: string) {
        this.widget.custom.icon = icon;
        this.changed.emit();
    }

    onChangeTitle(event: EventTextInputChanged) {
        this.widget.custom.text = event.value;
        if (event.notify) {
            this.changed.emit();
        }
    }

    onChangePreview(data: string) {
        this.widget.custom.preview = data;
        this.changed.emit();
    }
}
