import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsNumberComponent } from './data-inputs-number.component';

describe('DataInputsNumberComponent', () => {
    let component: DataInputsNumberComponent;
    let fixture: ComponentFixture<DataInputsNumberComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsNumberComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsNumberComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
