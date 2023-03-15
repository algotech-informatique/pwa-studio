import { ChangeDetectorRef, Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SN_BASE_METADATA } from '../../../smart-nodes';
import { SnNodeSchema } from '../../../smart-nodes/dto';
import { SnSection } from '../../../smart-nodes/models';
import { SnActionsService } from '../../../smart-nodes/services';
import { SnATNodeUtilsService } from '../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';
import { SnATNodeComponent } from '../sn-at-node/sn-at-node.component';

@Component({
    ...SN_BASE_METADATA,
    template: SN_BASE_METADATA.template
})
export class SnDBConnectorNodeComponent extends SnATNodeComponent {

    constructor(
        protected snActions: SnActionsService,
        protected snATNodeUtils: SnATNodeUtilsService,
        protected translate: TranslateService,
        protected ref: ChangeDetectorRef) {
        super(snActions, snATNodeUtils, ref);
    }

    initialize(schema: SnNodeSchema) {
        this.load([
            {
                key: 'mysql',
                value: 'MySql'
            },
            {
                key: 'mssql',
                value: 'SqlServer'
            },
            {
                key: 'postgre',
                value: 'PostGre'
            },
            {
                key: 'oracle',
                value: 'Oracle'
            },
            // {
            //     key: 'mongodb',
            //     value: 'MongoDB'
            // },
            {
                key: 'firebird',
                value: 'FireBird'
            }
        ], 'type');
        super.initialize(schema);
    }

    calculate() {
        const options: SnSection = this.snATNodeUtils.findSection(this.node, 'options');
        const dbType: string = this.snATNodeUtils.findValue(this.node, 'type');
        options.hidden = dbType !== 'mssql';
        super.calculate();
    }

}
