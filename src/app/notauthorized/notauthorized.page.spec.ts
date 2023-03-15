import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotAuthorizedPage } from './notauthorized.page';

describe('NotAuthorizedPage', () => {
    let component: NotAuthorizedPage;
    let fixture: ComponentFixture<NotAuthorizedPage>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [NotAuthorizedPage],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(NotAuthorizedPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
