import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTemplatesEditorComponent } from './report-templates-editor.component';

describe('ReportTemplatesEditorComponent', () => {
    let component: ReportTemplatesEditorComponent;
    let fixture: ComponentFixture<ReportTemplatesEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ReportTemplatesEditorComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ReportTemplatesEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
