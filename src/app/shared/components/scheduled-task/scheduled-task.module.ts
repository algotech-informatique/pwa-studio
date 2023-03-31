import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScheduledTaskComponent } from './scheduled-task.component';
import { ScheduledTaskDetailComponent } from './components/scheduled-task-detail/scheduled-task-detail.component';
import { ScheduledTaskListComponent } from './components/scheduled-task-list/scheduled-task-list.component';
import { ScheduledTaskLogComponent } from './components/scheduled-task-log/scheduled-task-log.component';
import { OptionsModule } from '../options/options.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { PipesModule, SmartTasksService } from '@algotech-ce/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ScheduledTaskService } from './services/scheduled-task.service';
import { ScheduledTaskExportService } from './services/scheduled-task-export.service';
import { ScheduledTaskDetailService } from './services/scheduled-task-detail.service';
import { ScheduledTaskCombinedComponent } from './components/scheduled-task-combined/scheduled-task-combined.component';
import { ScheduledTaskLogService } from './services/scheduled-task-log.service';
import { ScheduledTaskCombinedListComponent } from './components/scheduled-task-combined-list/scheduled-task-combined-list.component';
import { PopUpModule } from '../pop-ups/pop-up.module';

@NgModule({
    declarations: [
        ScheduledTaskComponent,
        ScheduledTaskDetailComponent,
        ScheduledTaskListComponent,
        ScheduledTaskLogComponent,
        ScheduledTaskCombinedComponent,
        ScheduledTaskCombinedListComponent
    ],
    imports: [
        CommonModule,
        OptionsModule,
        IonicModule,
        FormsModule,
        PipesModule,
        TranslateModule,
        PopUpModule,
    ],
    exports: [
        ScheduledTaskComponent
    ],
    entryComponents: [
        ScheduledTaskDetailComponent,
        ScheduledTaskListComponent,
        ScheduledTaskLogComponent,
    ],
    providers: [
        SmartTasksService,
        ScheduledTaskService,
        ScheduledTaskExportService,
        ScheduledTaskDetailService,
        ScheduledTaskLogService,
    ]
})
export class ScheduledTaskModule { }
