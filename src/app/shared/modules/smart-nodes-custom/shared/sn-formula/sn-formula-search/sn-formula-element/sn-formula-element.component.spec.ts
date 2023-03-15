import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnFormulaElement } from './sn-formula-element.component';

describe('SnFormulaElement', () => {
    let component: SnFormulaElement;
    let fixture: ComponentFixture<SnFormulaElement>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnFormulaElement]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnFormulaElement);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
