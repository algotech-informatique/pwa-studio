import { Injectable, } from '@angular/core';
import { ToastComponent } from '../../components/toast/toast.component';

@Injectable({
    providedIn: 'root'
})
export class ToastService {

    ref;

    constructor(
    ) { }

    initialize(ref) {
        this.ref = ref;
    }

    addToast(type, title, message, delay = -1) {
        const componentRef = this.ref.createComponent(ToastComponent);
        componentRef.instance.ref = componentRef;
            componentRef.instance.toast = {
            type,
            title,
            message,
        };
        componentRef.instance.eventEmitter = (data => {
            if (data.event === 'destroy') {
                data.ref.destroy();
            }
        });

        if (delay !== -1) {
            setTimeout(() => {
                componentRef.destroy();
            }, delay);
        }

        return componentRef;
    }

}
