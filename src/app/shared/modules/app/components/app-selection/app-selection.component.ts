import { SnPageWidgetDto } from '@algotech-ce/core';
import { Component, Input } from '@angular/core';
import { AppSelectionService, AppZoomService } from '../../services';

@Component({
    selector: 'app-selection',
    template: `
        <svg>
            <g *ngFor="let widget of widgets; trackBy: trackById" [class]="appSelection.selections.widgets | elementSelected:widget">
                <foreignObject *ngIf="!(widget | widgetType)?.disabledBox"
                    class="resize"
                    [attr.x]="0"
                    [attr.y]="0"
                    [attr.height]="widget.box.y + widget.box.height + 50"
                    [attr.width]="widget.box.x + widget.box.width + 50">
                    <xhtml:app-resize [widget]="widget"></xhtml:app-resize>
                </foreignObject>

                <rect
                    *ngIf="widget.group"
                    class="selection"
                    [attr.x]="widget.box.x"
                    [attr.y]="widget.box.y"
                    [attr.height]="widget.box?.height"
                    [attr.width]="widget.box?.width"
                    [attr.stroke-width]="((appZoom.transform.k | scaleZoom: '+/-') / 2) + 'px'">
                </rect>

                <foreignObject
                    *ngIf="widget.group"
                    [attr.x]="widget.box.x"
                    [attr.y]="widget.box.y"
                    [attr.height]="widget.box?.height"
                    [attr.width]="widget.box?.width">

                    <xhtml:app-selection [widgets]="widget.group.widgets"></xhtml:app-selection>
                </foreignObject>
            </g>
        </svg>
    `,
    styleUrls: ['./app-selection.component.scss']
})
export class AppSelectionComponent {

    @Input() widgets: SnPageWidgetDto[];

    constructor(public appSelection: AppSelectionService, public appZoom: AppZoomService) {}

    trackById(index, item) {
        return item.id;
    }
}
