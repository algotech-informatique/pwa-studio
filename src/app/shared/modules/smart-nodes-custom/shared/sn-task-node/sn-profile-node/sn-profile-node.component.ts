import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { SnNode, SnView } from '../../../../smart-nodes/models';
import { PairDto } from '@algotech-ce/core';
import { WorkflowProfilModelDto } from '@algotech-ce/core';
import { SnATNodeUtilsService } from '../../sn-at-node/sn-at-node-utils.service/sn-at-node-utils.service';

@Component({
    selector: 'sn-profile-node',
    templateUrl: './sn-profile-node.component.html',
    styleUrls: ['./sn-profile-node.component.scss']
})
export class SnProfileNodeComponent implements OnChanges {

    @Input() profil: string;
    @Input() profiles: PairDto[] = [];
    @Input() node: SnNode;
    @Input() snView: SnView;

    @Output() profileChanged = new EventEmitter();

    activeProfil: WorkflowProfilModelDto;

    constructor(
        private snATNodeUtils: SnATNodeUtilsService,
    ) {}

    ngOnChanges() {
        this.activeProfil = this.snATNodeUtils.getProfil(this.snView, this.node.custom.profile);
    }

    onProfileChanged(value) {
        this.profileChanged.emit(value);
    }
}
