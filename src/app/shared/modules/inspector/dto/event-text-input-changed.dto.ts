export class EventTextInputChanged {
    value: any;
    notify: boolean;

    constructor(value: any, notifify: boolean) {
        this.value = value;
        this.notify = notifify;
    }
}
