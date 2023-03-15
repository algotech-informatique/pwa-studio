import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsListsDetailComponent } from './tags-lists-detail.component';

describe('TagsListsDetailComponent', () => {
    let component: TagsListsDetailComponent;
    let fixture: ComponentFixture<TagsListsDetailComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagsListsDetailComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagsListsDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
