import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePermissionDetailComponent } from './resource-permission-detail.component';

describe('ResourcePermissionDetailComponent', () => {
  let component: ResourcePermissionDetailComponent;
  let fixture: ComponentFixture<ResourcePermissionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePermissionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePermissionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
