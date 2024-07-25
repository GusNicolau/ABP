import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupCourseComponent } from './popup-course.component';

describe('PopupCourseComponent', () => {
  let component: PopupCourseComponent;
  let fixture: ComponentFixture<PopupCourseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupCourseComponent]
    });
    fixture = TestBed.createComponent(PopupCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
