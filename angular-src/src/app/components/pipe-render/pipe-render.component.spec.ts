import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PipeRenderComponent } from './pipe-render.component';

describe('PipeRenderComponent', () => {
  let component: PipeRenderComponent;
  let fixture: ComponentFixture<PipeRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PipeRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PipeRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
