import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectDetailComponent } from './media-object-detail.component';

describe('MediaObjectDetailComponent', () => {
  let component: MediaObjectDetailComponent;
  let fixture: ComponentFixture<MediaObjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MediaObjectDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaObjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
