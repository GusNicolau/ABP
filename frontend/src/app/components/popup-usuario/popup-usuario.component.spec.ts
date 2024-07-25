import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupUsuarioComponent } from './popup-usuario.component';

describe('PopupUsuarioComponent', () => {
  let component: PopupUsuarioComponent;
  let fixture: ComponentFixture<PopupUsuarioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PopupUsuarioComponent]
    });
    fixture = TestBed.createComponent(PopupUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
