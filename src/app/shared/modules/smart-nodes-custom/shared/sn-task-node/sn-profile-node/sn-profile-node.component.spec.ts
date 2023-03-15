import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SnProfileNodeComponent } from './sn-profile-node.component';

describe('SnProfileNodeComponent', () => {
    let component: SnProfileNodeComponent;
    let fixture: ComponentFixture<SnProfileNodeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SnProfileNodeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SnProfileNodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
