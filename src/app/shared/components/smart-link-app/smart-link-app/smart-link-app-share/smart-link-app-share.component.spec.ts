import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SmartLinkAppShareComponent } from './smart-link-app-share.component';

describe('SmartLinkAppShareComponent', () => {
    let component: SmartLinkAppShareComponent;
    let fixture: ComponentFixture<SmartLinkAppShareComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ SmartLinkAppShareComponent ],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(SmartLinkAppShareComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

});
