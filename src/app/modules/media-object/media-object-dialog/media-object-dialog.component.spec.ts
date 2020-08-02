import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaObjectDialogComponent } from './media-object-dialog.component';

describe('MediaObjectDialogComponent', () => {
  let component: MediaObjectDialogComponent;
  let fixture: ComponentFixture<MediaObjectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MediaObjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaObjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
