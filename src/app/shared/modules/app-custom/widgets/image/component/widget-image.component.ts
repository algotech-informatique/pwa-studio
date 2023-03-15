import { SnAppDto, SnPageWidgetDto } from '@algotech/core';
import { Component } from '@angular/core';
import { WidgetComponentInterface } from '../../../../app/interfaces';

@Component({
    selector: 'widget-image',
    templateUrl: './widget-image.component.html',
    styleUrls: ['widget-image.component.scss'],
})
export class WidgetImageComponent implements WidgetComponentInterface {

    // custom params
    imageUuid: string;
    imageUri: string;
    typeSrc: 'file' | 'uri';
    srcExists = false;

    snApp: SnAppDto;
    widget: SnPageWidgetDto;

    initialize() {
      this.typeSrc = this.widget.custom?.typeSrc;
      this.imageUri = this.widget.custom?.imageUri;
      this.imageUuid = this.widget.custom?.imageUuid;

      this.srcExists = this.typeSrc === 'file' && !!this.imageUuid || this.typeSrc === 'uri' && !!this.imageUri;
    }
}
