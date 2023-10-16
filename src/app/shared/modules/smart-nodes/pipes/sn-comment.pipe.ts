import { Pipe, PipeTransform } from '@angular/core';
import { SnElement } from '../models';
import { SnComment } from '../models/sn-comment';

@Pipe({
    name: 'snHasComment',
    pure: false
})

export class SnHasCommentPipe implements PipeTransform {
    transform(comments: SnComment[], container: SnElement): boolean {
        const comment = comments.find((c) => c.parentId === container.id);
        if (!comment) {
            return false;
        }
        return comment.open || (!comment.open && !!comment.comment);
    }
}
