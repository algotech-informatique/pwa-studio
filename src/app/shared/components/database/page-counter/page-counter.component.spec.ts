import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AppDataBasePageCounterComponent } from './page-counter.component';

describe('AppDataBasePageCounterComponent', () => {
    let component: AppDataBasePageCounterComponent;
    let fixture: ComponentFixture<AppDataBasePageCounterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AppDataBasePageCounterComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(AppDataBasePageCounterComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
