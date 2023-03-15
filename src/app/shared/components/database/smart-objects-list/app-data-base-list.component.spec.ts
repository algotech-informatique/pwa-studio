import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDataBaseListComponent } from './app-data-base-list.component';

describe('AppDataBaseListComponent', () => {
    let component: AppDataBaseListComponent;
    let fixture: ComponentFixture<AppDataBaseListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppDataBaseListComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppDataBaseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
