import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverprodRenderComponent } from './coverprod-render.component';

describe('CoverprodRenderComponent', () => {
  let component: CoverprodRenderComponent;
  let fixture: ComponentFixture<CoverprodRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverprodRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverprodRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
