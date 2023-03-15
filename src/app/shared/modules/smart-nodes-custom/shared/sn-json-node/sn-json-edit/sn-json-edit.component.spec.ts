import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnJsonEditComponent } from './sn-json-edit.component';

describe('SnJsonEditComponent', () => {
    let component: SnJsonEditComponent;
    let fixture: ComponentFixture<SnJsonEditComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnJsonEditComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnJsonEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
