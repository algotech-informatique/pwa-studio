import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsBooleanComponent } from './data-inputs-boolean.component';

describe('DataInputsBooleanComponent', () => {
    let component: DataInputsBooleanComponent;
    let fixture: ComponentFixture<DataInputsBooleanComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsBooleanComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsBooleanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
