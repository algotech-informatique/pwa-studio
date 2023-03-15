import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services';
import { SnView } from '../../modules/smart-nodes';

// const { app } = require('electron');

@Component({
    selector: 'app-top-bar',
    templateUrl: './top-bar.component.html',
    styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

    isMac: boolean;
    top: number;
    snView: SnView;

    constructor(
        private messageService: MessageService,
    ) {
        this.isMac = (navigator.platform.toUpperCase().indexOf('MAC')) >= 0;
    }

    ngOnInit() {
    }

    sendMsg() { }

    market(event) {
        this.top = event.srcElement.offsetTop + 5;
    }

    onChanged(data) {
        // console.log('ev', data);
    }

    close() {
        // this.electronService.remote.getCurrentWindow().close();
    }

    minimize() {
        // this.electronService.remote.getCurrentWindow().minimize();
    }

    maximize() {
        /* const window = this.electronService.remote.getCurrentWindow();
        if (window.isMaximized()) {
            this.electronService.remote.getCurrentWindow().unmaximize();
        } else {
            this.electronService.remote.getCurrentWindow().maximize();
        } */
    }
}
