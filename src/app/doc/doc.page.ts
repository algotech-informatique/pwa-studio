import {
    Component, OnInit
} from '@angular/core';
import { AuthService } from '@algotech-ce/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-doc',
    templateUrl: 'doc.page.html',
    styleUrls: ['doc.page.scss'],
})
export class DocPage implements OnInit {

    url: SafeResourceUrl;

    constructor(
        private authService: AuthService,
        private sanitizer: DomSanitizer,
    ) { }

    ngOnInit(): void {
        if (this.authService.isAuthenticated) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.authService.api + '/documentation/?jwt=' + this.authService.localProfil.key);
        }
    }
}
