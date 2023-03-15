import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnEditTextFormattingComponent } from './sn-edit-text-formatting.component';

describe('SnEditTextFormattingComponent', () => {
    let component: SnEditTextFormattingComponent;
    let fixture: ComponentFixture<SnEditTextFormattingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnEditTextFormattingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnEditTextFormattingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
