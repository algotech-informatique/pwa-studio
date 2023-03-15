import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsListsDetailLineComponent } from './tags-lists-detail-line.component';

describe('TagsListsDetailLineComponent', () => {
    let component: TagsListsDetailLineComponent;
    let fixture: ComponentFixture<TagsListsDetailLineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TagsListsDetailLineComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TagsListsDetailLineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
