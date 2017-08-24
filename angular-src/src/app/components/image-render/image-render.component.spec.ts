import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageRenderComponent } from './image-render.component';

describe('ImageRenderComponent', () => {
  let component: ImageRenderComponent;
  let fixture: ComponentFixture<ImageRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
