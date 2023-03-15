import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnPreviewTextFormattingComponent } from './sn-preview-text-formatting.component';

describe('SnPreviewTextFormattingComponent', () => {
    let component: SnPreviewTextFormattingComponent;
    let fixture: ComponentFixture<SnPreviewTextFormattingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnPreviewTextFormattingComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnPreviewTextFormattingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
