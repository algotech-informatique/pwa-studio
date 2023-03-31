import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { HomePage } from './home/home.page';
import { AppPreviewComponent, EncodeGuard, WorkflowDebuggerFrameComponent } from '@algotech-ce/business';
import { SignInGuard } from '@algotech-ce/angular';
import { DocPage } from './doc/doc.page';
import { NotAuthorizedPage } from './notauthorized/notauthorized.page';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'home',
        component: HomePage,
        canActivate: [SignInGuard],
        data: { groups: ['sadmin', 'admin', 'plan-editor', 'process-manager'], redirectUrl: '/notauthorized' },
    },
    {
        path: 'doc',
        component: DocPage,
        canActivate: [SignInGuard],
        data: { groups: ['sadmin', 'doc'], redirectUrl: '/notauthorized' },
    },
    {
        path: 'debugger',
        component: WorkflowDebuggerFrameComponent,
        data: { groups: ['sadmin', 'admin', 'plan-editor', 'process-manager'], redirectUrl: '/notauthorized' },
    },
    {
        path: 'app/:keyApp',
        component: AppPreviewComponent,
        canActivate: [EncodeGuard],
        data: { groups: ['sadmin', 'admin', 'plan-editor', 'process-manager'], redirectUrl: '/notauthorized' },
    },
    {
        path: 'app/:keyApp/:keyPage',
        component: AppPreviewComponent,
        canActivate: [EncodeGuard],
        data: { groups: ['sadmin', 'admin', 'plan-editor', 'process-manager'], redirectUrl: '/notauthorized' },
    },
    {
        path: 'notauthorized',
        component: NotAuthorizedPage,
        canActivate: [],
    },
    {
        path: '**',
        component: PageNotFoundComponent
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }

