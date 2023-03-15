import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DataInputsTextComponent } from './data-inputs-text.component';

describe('DataInputsTextComponent', () => {
    let component: DataInputsTextComponent;
    let fixture: ComponentFixture<DataInputsTextComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [DataInputsTextComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataInputsTextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
