import { NgModule } from '@angular/core';
import { CustomerCodePipe } from './customer-code.pipe';
import { GetWatcherPipe } from './get-watcher.pipe';
import { GetPercentagePipe } from './percentage.pipe';
import { ReduceTextPipe } from './reduce-text.pipe';

@NgModule({
    declarations: [
        CustomerCodePipe,
        ReduceTextPipe,
        GetWatcherPipe,
        GetPercentagePipe,
    ],
    imports: [
    ],
    exports: [
        CustomerCodePipe,
        ReduceTextPipe,
        GetWatcherPipe,
        GetPercentagePipe,
    ]
})
export class PipeModule { }
