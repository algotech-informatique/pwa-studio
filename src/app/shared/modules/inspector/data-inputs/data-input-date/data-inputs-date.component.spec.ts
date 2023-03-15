import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsDateComponent } from './data-inputs-date.component';

describe('DataInputsDateComponent', () => {
    let component: DataInputsDateComponent;
    let fixture: ComponentFixture<DataInputsDateComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsDateComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsDateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
