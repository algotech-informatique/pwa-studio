import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotAuthorizedPage } from './notauthorized.page';

const routes: Routes = [
    {
        path: '',
        component: NotAuthorizedPage,
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotAuthorizedPageRoutingModule { }
