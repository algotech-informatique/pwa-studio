import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'store-login',
    templateUrl: './store-login.component.html',
    styleUrls: ['./store-login.component.scss'],
})
export class StoreLoginComponent implements OnInit {

    @Input() data;
    @Input() readonly = false;
    @Output() changed = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    updateLogin(login) {
        this.data.login = login;
        this.changed.emit(this.data);
    }

    updatePassword(password) {
        this.data.password = password;
        this.changed.emit(this.data);
    }

    updateUrl(url) {
        this.data.serverUrl = url;
        this.changed.emit(this.data);
    }

    updateCustomer(customer) {
        this.data.customer = customer;
        this.changed.emit(this.data);
    }

    updateApi(api) {
        this.data.serverApi = api;
        this.changed.emit(this.data);
    }
}

