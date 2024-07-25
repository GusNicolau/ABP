import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupActUsuarioComponent } from './popup-act-usuario.component';

describe('PopupActUsuarioComponent', () => {
  let component: PopupActUsuarioComponent;
  let fixture: ComponentFixture<PopupActUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupActUsuarioComponent]
    });
    fixture = TestBed.createComponent(PopupActUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
