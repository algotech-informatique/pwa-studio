import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OptionsMarkdownMultilangComponent } from './options-markdown-multilang.component';

describe('OptionsMarkdownMultilangComponent', () => {
    let component: OptionsMarkdownMultilangComponent;
    let fixture: ComponentFixture<OptionsMarkdownMultilangComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OptionsMarkdownMultilangComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OptionsMarkdownMultilangComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
