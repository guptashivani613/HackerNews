import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackendIntegrationComponent } from './backend-integration.component';
import { ApiService } from 'src/shared/services/api.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BackendIntegrationComponent', () => {
  let component: BackendIntegrationComponent;
  let fixture: ComponentFixture<BackendIntegrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ BackendIntegrationComponent ],
      providers:[ApiService]
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
