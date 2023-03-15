import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnEditButtonFormattingComponent } from './sn-edit-button-formatting.component';

describe('SnEditButtonFormattingComponent', () => {
    let component: SnEditButtonFormattingComponent;
    let fixture: ComponentFixture<SnEditButtonFormattingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnEditButtonFormattingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnEditButtonFormattingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
