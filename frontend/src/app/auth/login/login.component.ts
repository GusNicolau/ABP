import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmint = false;
  public waiting = false;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required ],
    remember: [false || localStorage.getItem('email')]
  });

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router ) {
  }

  ngOnInit(): void {

    if(localStorage.getItem('rol') === 'ROL_ADMIN'){
      this.usuarioService.validarToken().subscribe(
        res => {
          if(res) {
            this.router.navigateByUrl('/dashboard');
          }
        });
    }

  }


  login() {

    this.formSubmint = true;

    if(!this.loginForm.valid) {
      Swal.fire({
        title: '¡Error!',
        text:'Faltan campos por rellenar',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;
    }

    this.waiting=true;

    this.usuarioService.login(this.loginForm.value ?? '').subscribe({ // utilizar   ??  o ||
      next: (res:any) => {
        //console.log('Respuesta al subscribe de login:', res);

        if(res.usuarioBD.rol === 'ROL_BASICO'){

          Swal.fire({
            title: '¡Error!',
            text:'No tiene permisos de acceso',
            icon: 'error',
            confirmButtonText: 'De acuerdo',
            allowOutsideClick: false
          });
          this.waiting = false;
          return;

        }

          //localStorage.setItem('email', res['email']!); // asi se guarda a undefined
          localStorage.setItem('email', this.loginForm.value.email!);
          localStorage.setItem('uid', res.usuarioBD._id);
          localStorage.setItem('token', res.token);



        Swal.fire({
          title: '¡Inicio de sesión correcto!',
          text: ``,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        }).then( (result) => {
          if(true) {
            this.router.navigateByUrl('/dashboard');
            this.waiting = true;
          }
        });


      },
      error: (err) => {
        console.warn('Error respuesta api:', err);
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción. Vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => console.info('Complete')
    });

  }


  campoValido( campo: string ) {
    return this.loginForm.get(campo)?.valid || this.formSubmint; // Porque sin el interrogante da error ???
  }

}
