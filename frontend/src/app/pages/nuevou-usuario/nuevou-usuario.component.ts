import { Component } from '@angular/core';
import { UsuarioService } from './../../services/usuario.service';

import { FormBuilder, Validators, FormsModule, FormGroup } from '@angular/forms';

import { passwordValidator } from 'src/app/auth/validators/password.validator';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevou-usuario',
  templateUrl: './nuevou-usuario.component.html',
  styleUrls: ['./nuevou-usuario.component.css']
})
export class NuevouUsuarioComponent {

  public waiting2 = false;

  password2: any = "";

  tok: any = localStorage.getItem('token');

  rol: any = localStorage.getItem('rol');


  public formSubmint = false;
  public waiting = false;

  usuario: any = {
    nombre: "",
    apellidos:"",
    email: "",
    password: ""


  }

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos:['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, passwordValidator()]],
    password2: ['',[Validators.required, passwordValidator()] ]
  });

  constructor(private usuarioService: UsuarioService,
              private router: Router,
              private fb: FormBuilder){

  }

  usuarioAdmin: boolean = false;

  ngOnInit() {



    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/test');
    }



  }

  register(){

    this.formSubmint = true;

    if(this.registerForm.value.nombre == '' ||
       this.registerForm.value.password == '' ||
       this.registerForm.value.password2 == ''){

        Swal.fire({
          title: '¡Error!',
          text:'Faltan campos por rellenar',
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });
        return;          }

        if(this.registerForm.value.password != this.registerForm.value.password2){

          Swal.fire({
            title: '¡Error!',
            text:'Las contraseñas no coinciden',
            icon: 'error',
            confirmButtonText: 'De acuerdo',
            allowOutsideClick: false
          });
          return;

        }

    if(this.registerForm.get('email')?.invalid) {

      Swal.fire({
        title: '¡Error!',
        text:'El email no tiene un formato correcto',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    if(this.registerForm.get('password')?.invalid || this.registerForm.get('password2')?.invalid) {

      Swal.fire({
        title: '¡Error!',
        text:'La contraseña debe tener al menos 7 caracteres y tener al menos un número y una mayúscula',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    //console.log(this.registerForm.value);

    this.usuarioService.registry(this.registerForm.value ?? '').subscribe({ // utilizar   ??  o ||
      next: (res:any) => {


        Swal.fire({
          title: '¡Usuario registrado!',
          text: ``,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        }).then( (result) => {
          if(true) {

            localStorage.setItem('token',this.tok);

            localStorage.setItem('rol',this.rol);

           this.router.navigateByUrl('/dashboard/usuarios');
           //window.location.reload();
          }
        });
      },
      error: (err) => {
        console.warn('Error respuesta api:', err);
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción. Vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => console.info('Complete')
    });



  }

}
