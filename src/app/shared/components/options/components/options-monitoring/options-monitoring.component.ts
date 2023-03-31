import { ProcessMonitoringDto } from '@algotech-ce/core';
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'options-monitoring',
    templateUrl: './options-monitoring.component.html',
    styleUrls: ['./options-monitoring.component.scss'],
})
export class OptionsMonitoringComponent {

    @Input() monitorings: ProcessMonitoringDto[];
    @Output() select = new EventEmitter<ProcessMonitoringDto>();

    selectedMonitoring = '';
    logMonitoring = '';

    constructor(
        private datePipe: DatePipe,
    ) {
    }

    onSelect(element: ProcessMonitoringDto) {
        this.select.emit(element);

        this.selectedMonitoring = this.selectedMonitoring === element.uuid ? '' : element.uuid;
            this.logMonitoring = JSON.stringify({
                start: !element.createdDate ? '' : this.datePipe.transform(element.createdDate, 'd LLLL HH:mm'),
                update: !element.updateDate ? '' : this.datePipe.transform(element.updateDate, 'd LLLL HH:mm'),
                status: element.processState,
                advancement: !element.total ? '100%' :
                    element.current == null ? '0%' :
                        `${Math.round(100 * (element.current) / (element.total))}%`,
                message: element.result
            }, null, 4);
    }

}
