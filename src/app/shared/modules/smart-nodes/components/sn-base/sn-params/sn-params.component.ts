import {
    Component, Input
} from '@angular/core';
import { SnParam, SnView, SnNode } from '../../../models';

@Component({
    selector: 'sn-params',
    templateUrl: './sn-params.component.html',
    styleUrls: ['./sn-params.component.scss'],
})
export class SnParamsComponent {
    @Input()
    params: SnParam[] = [];

    @Input()
    node: SnNode;

    @Input()
    snView: SnView;
}
