import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { ExplorerModule } from '../shared/components/explorer/explorer.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ExplorerModule,
        SharedModule,
        HomePageRoutingModule
    ],
    declarations: [
        HomePage,
        ToastComponent,
    ],
})
export class HomePageModule { }
