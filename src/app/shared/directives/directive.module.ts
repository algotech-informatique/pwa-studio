import { NgModule } from '@angular/core';
import { DragNdDropDirective } from './dragAndDrop/dragNdrop.directive';
import { WebviewDirective } from './webview/webview.directive';

@NgModule({
    declarations: [
        DragNdDropDirective,
        WebviewDirective,
    ],
    imports: [
    ],
    exports: [
        DragNdDropDirective,
        WebviewDirective,
    ],
})
export class DirectiveModule { }
