import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourcePermissionComponent } from './resource-permission.component';

describe('ResourcePermissionComponent', () => {
  let component: ResourcePermissionComponent;
  let fixture: ComponentFixture<ResourcePermissionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResourcePermissionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourcePermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
