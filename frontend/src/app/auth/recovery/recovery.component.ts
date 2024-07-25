import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent {

  public formSubmint = false;

  constructor( private fb: FormBuilder) {
  }

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]]
  });

  campoValido( campo: string ) {
    return this.loginForm.get(campo)?.valid || this.formSubmint; // Porque sin el interrogante da error ???
  }

}
