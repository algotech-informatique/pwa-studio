import { DirectivesModule, PipesModule } from '@algotech/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { OptionsModule } from '../options/options.module';
import { PopUpModule } from '../pop-ups/pop-up.module';
import { SecurityAuditTrailComponent } from './security-audit-trail/security-audit-trail.component';
import { SecurityGroupDetailComponent } from './security-groups/security-group-detail/security-group-detail.component';
import { SecurityGroupMainComponent } from './security-groups/security-group-main/security-group-main.component';
import { SecurityGroupsComponent } from './security-groups/security-groups.component';
import { SecurityUserDetailComponent } from './security-users/security-user-detail/security-user-detail.component';
import { SecurityUserMainComponent } from './security-users/security-user-main/security-user-main.component';
import { SecurityUserPasswordComponent } from './security-users/security-user-password/security-user-password.component';
import { SecurityUserPasswordService } from './security-users/security-user-password/security-user-password.service';
import { SecurityUsersComponent } from './security-users/security-users.component';
import { SecurityGroupService } from './services/security-group.service';
import { SecurityUserService } from './services/security-user.service';

@NgModule({
    declarations: [
        SecurityGroupsComponent,
        SecurityUsersComponent,
        SecurityGroupDetailComponent,
        SecurityGroupMainComponent,
        SecurityUserMainComponent,
        SecurityUserDetailComponent,
        SecurityUserPasswordComponent,
        SecurityAuditTrailComponent,
    ],
    imports: [
        DirectivesModule,
        CommonModule,
        OptionsModule,
        IonicModule,
        FormsModule,
        PipesModule,
        TranslateModule,
        PopUpModule,
    ],
    exports: [
        SecurityGroupsComponent,
        SecurityUsersComponent,
        SecurityAuditTrailComponent,
    ],
    entryComponents: [
        SecurityGroupDetailComponent,
        SecurityGroupMainComponent,
        SecurityUserMainComponent,
        SecurityUserDetailComponent,
    ],
    providers: [
        SecurityGroupService,
        SecurityUserService,
        SecurityUserPasswordService,
    ]
})
export class SecurityModule { }
