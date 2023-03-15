import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDataBaseComponent } from './app-data-base.component';

describe('AppDataBaseComponent', () => {
    let component: AppDataBaseComponent;
    let fixture: ComponentFixture<AppDataBaseComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppDataBaseComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppDataBaseComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
