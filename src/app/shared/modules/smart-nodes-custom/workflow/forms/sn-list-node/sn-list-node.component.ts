import {
    Component
} from '@angular/core';
import { SnNodeSchema } from '../../../../smart-nodes/dto';
import { SN_TASK_METADATA } from '../../../shared/sn-task-node/sn-task-node.metadata';
import { SnTaskNodeComponent } from '../../../shared/sn-task-node/sn-task-node.component';

@Component({
    template: SN_TASK_METADATA.template,
})
export class SnListNodeComponent extends SnTaskNodeComponent {

    initialize(schema: SnNodeSchema) {
        super.initialize(schema);
    }

    calculate() {
        let notifyHide = false;

        this.loadProperties('items', 'columnsDisplay', 'object');
        this.loadProperties('items', 'filterProperty', 'object');

        this.calculateMultiple('multipleSelection');
        this.calculateTypeWithParam('items');

        super.calculate();

        const loopMode = this.snATNodeUtils.findValue(this.node, 'loop') ? true : false;
        const flowExit = this.node.flows.find((f) => f.key === 'done');

        if (flowExit) {
            if (flowExit.displayState.hidden !== !loopMode) {
                notifyHide = true;
                flowExit.displayState.hidden = !loopMode;
            }
        }

        const sectionSearch = this.node.sections.find((s) => s.key === 'searchMode');
        const searchShow = this.snATNodeUtils.findValue(this.node, 'search');
        const searchValue = sectionSearch.params.find((p) => p.key === 'searchValue');

        if (searchValue.displayState.hidden !== !searchShow) {
            notifyHide = true;
            searchValue.displayState.hidden = !searchShow;
        }

        const sectionFilter = this.node.sections.find((s) => s.key === 'filter');
        if (!sectionFilter) {
            return;
        }
        const filterProperty = sectionFilter.params.find((p) => p.key === 'filterProperty');
        const filterActive = sectionFilter.params.find((p) => p.key === 'filterActive');

        if (!filterProperty || !filterActive) {
            return;
        }

        if (filterActive.displayState.hidden !== !filterProperty.value) {
            notifyHide = true;
            filterActive.displayState.hidden = !filterProperty.value;
        }

        if (notifyHide) {
            this.snActions.notifyHide(this.snView, this.node);
        }
        super.calculate();
    }
}
