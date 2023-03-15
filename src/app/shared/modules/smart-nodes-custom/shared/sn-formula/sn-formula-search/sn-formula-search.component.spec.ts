import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnFormulaSearch } from './sn-formula-search.component';

describe('SnFormulaSearch', () => {
    let component: SnFormulaSearch;
    let fixture: ComponentFixture<SnFormulaSearch>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnFormulaSearch]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnFormulaSearch);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
