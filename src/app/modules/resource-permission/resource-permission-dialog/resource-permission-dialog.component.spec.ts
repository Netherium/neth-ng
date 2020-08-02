import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePermissionDialogComponent } from './resource-permission-dialog.component';

describe('ResourcePermissionDialogComponent', () => {
  let component: ResourcePermissionDialogComponent;
  let fixture: ComponentFixture<ResourcePermissionDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePermissionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePermissionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
