import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotAuthorizedPage } from './notauthorized.page';
import { NotAuthorizedPageRoutingModule } from './notauthorized-routing.module';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NotAuthorizedPageRoutingModule,
        TranslateModule,
        IonicModule,
        // SharedModule,
    ],
    declarations: [
        NotAuthorizedPage,
    ],
})
export class NotAuthorizedPageModule { }
