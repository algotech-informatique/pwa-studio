import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { OptionsObjectDto } from '../../../../dtos';

@Component({
    selector: 'scheduled-task-log',
    templateUrl: './scheduled-task-log.component.html',
    styleUrls: ['./scheduled-task-log.component.scss'],
})
export class ScheduledTaskLogComponent implements OnInit {

    @Input() smartLogs: OptionsObjectDto[] = [];
    @Output() exportToCSV = new EventEmitter();
    @Output() reload = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    exportCSV() {
        return this.exportToCSV.emit();
    }

    onReloadLog() {
        this.reload.emit();
    }
}
