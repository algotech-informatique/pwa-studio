import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsTimeComponent } from './data-inputs-time.component';

describe('DataInputsTimeComponent', () => {
    let component: DataInputsTimeComponent;
    let fixture: ComponentFixture<DataInputsTimeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsTimeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
