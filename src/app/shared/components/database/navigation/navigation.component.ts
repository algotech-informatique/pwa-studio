import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BreadCrumbLink } from '../interfaces/link.interface';


@Component({
    selector: 'app-data-base-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})

export class AppDataBaseNavigationComponent {
    @Input() breadCrumb: BreadCrumbLink[];
    @Output() navigateTo = new EventEmitter<BreadCrumbLink>();
    constructor() { }

    onNavigate(link: BreadCrumbLink) {
        this.navigateTo.emit(link);
    }

}
