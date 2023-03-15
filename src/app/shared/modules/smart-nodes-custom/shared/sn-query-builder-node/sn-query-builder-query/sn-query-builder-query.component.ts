import { SnSection } from './../../../../smart-nodes/models/sn-section';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sn-query-builder-query',
  templateUrl: './sn-query-builder-query.component.html',
  styleUrls: ['./sn-query-builder-query.component.scss']
})
export class SnQueryBuilderQueryComponent {

    @Input() section: SnSection;
    @Input() queryText: string;
    @Output() queryChange = new EventEmitter();

    onChangeQuery() {
        this.queryChange.emit(this.queryText);
    }

}
