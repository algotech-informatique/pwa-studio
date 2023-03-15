import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnFormulaSelected } from './sn-formula-selected.component';

describe('SnFormulaSelected', () => {
    let component: SnFormulaSelected;
    let fixture: ComponentFixture<SnFormulaSelected>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnFormulaSelected]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnFormulaSelected);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
