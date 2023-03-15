import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { I18nMonitoringComponent } from './i18n-monitoring.component';

describe('I18nMonitoringComponent', () => {
    let component: I18nMonitoringComponent;
    let fixture: ComponentFixture<I18nMonitoringComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [I18nMonitoringComponent],
            imports: [IonicModule.forRoot()]
        }).compileComponents();

        fixture = TestBed.createComponent(I18nMonitoringComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
