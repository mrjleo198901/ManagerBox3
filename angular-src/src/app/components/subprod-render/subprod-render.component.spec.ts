import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubprodRenderComponent } from './subprod-render.component';

describe('SubprodRenderComponent', () => {
  let component: SubprodRenderComponent;
  let fixture: ComponentFixture<SubprodRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubprodRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubprodRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
