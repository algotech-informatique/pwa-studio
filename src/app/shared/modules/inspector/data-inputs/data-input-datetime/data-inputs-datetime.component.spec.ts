import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsDatetimeComponent } from './data-inputs-datetime.component';

describe('DataInputsDatetimeComponent', () => {
    let component: DataInputsDatetimeComponent;
    let fixture: ComponentFixture<DataInputsDatetimeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsDatetimeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsDatetimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
