import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupActComponent } from './popup-act.component';

describe('PopupActComponent', () => {
  let component: PopupActComponent;
  let fixture: ComponentFixture<PopupActComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupActComponent]
    });
    fixture = TestBed.createComponent(PopupActComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
