import { Component, OnInit, Input } from '@angular/core';
import { SnActionsService } from '../../services';
import { SnComment } from '../../models/sn-comment';
import { SnView } from '../../models';

@Component({
    selector: 'sn-comment',
    templateUrl: './sn-comment.component.html',
    styleUrls: ['./sn-comment.component.scss'],
})
export class SnCommentComponent implements OnInit {

    @Input()
    comment: SnComment;

    @Input()
    snView: SnView;

    constructor(
        private snAction: SnActionsService,
    ) { }

    ngOnInit() { }

    closeComment() {
        this.comment.open = false;
        this.snAction.notifyHide(this.snView);
    }

    deleteComment() {
        this.snAction.removeComment(this.snView, this.comment);
    }

    updateComment() {
        this.snAction.notifyComment(this.snView, this.comment);
    }
}
