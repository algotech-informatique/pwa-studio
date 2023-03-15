import {
    Component, Input, AfterViewInit, ChangeDetectorRef, OnChanges
} from '@angular/core';
import { SnParam } from '../../../models';
import { SnDOMService } from '../../../services';
import * as _ from 'lodash';

@Component({
    selector: 'sn-param-connection',
    templateUrl: './sn-param-connection.component.html',
    styleUrls: ['./sn-param-connection.component.scss'],
})
export class SnParamConnectionComponent implements OnChanges, AfterViewInit {
    @Input()
    direction: 'in' | 'out' = 'in';

    @Input()
    param: SnParam;

    @Input()
    types: string;

    @Input()
    connected: boolean;

    @Input()
    error: boolean;

    errorVarName = '--SN-COLOR-ERROR';
    defaultParamVarName = '--SN-NODE-PARAM-COLOR';
    paramVarName = this.defaultParamVarName;
    gradient = [];
    size = 8;

    constructor(private ref: ChangeDetectorRef, private snDOMService: SnDOMService) { }

    ngAfterViewInit() {
        this.refreshType();
    }

    ngOnChanges() {
        this.refreshType();
    }

    refreshType() {
        if (this.error) {
            this.paramVarName = this.errorVarName;
            return;
        }

        if (this.types) {
            this.paramVarName = this.snDOMService.getVarName(this.defaultParamVarName,
                Array.isArray(this.types) ?
                    this.types[0].toUpperCase() : this.types.toUpperCase());

            if (Array.isArray(this.types)) {
                const colors = _.uniq(this.types.map((type: string) => {
                    return this.snDOMService.getVarName(this.defaultParamVarName,
                        Array.isArray(this.types) ?
                            type.toUpperCase() : this.types.toUpperCase(), true);
                }));

                this.gradient = colors.map((color: string, index: number) => {
                    return {
                        percent: index === 0 ? 0 : Math.round((index / (colors.length - 1)) * 100),
                        color
                    };
                });
            } else {
                this.gradient = [];
            }

            this.ref.detectChanges();
        }
    }
}
