import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendIntegrationComponent } from './backend-integration.component';

describe('BackendIntegrationComponent', () => {
  let component: BackendIntegrationComponent;
  let fixture: ComponentFixture<BackendIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackendIntegrationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackendIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
