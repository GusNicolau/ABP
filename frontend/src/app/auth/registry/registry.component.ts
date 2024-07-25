import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.css']
})
export class RegistryComponent implements OnInit{

  public formSubmint = false;
  public waiting = false;

  psw2: any = '';

   loginForm: any ={
    email:'',
    password:''
   }
    

  public registryForm = this.fb.group({
    nombre: ['', Validators.required ],
    apellidos: ['', Validators.required ],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required ],
    password2: ['']
  });

  constructor( private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router ) {
  }

  ngOnInit(): void {
    
  }

  registry() {

    this.formSubmint = true;

    if(this.registryForm.value.nombre == '' || 
       this.registryForm.value.email == '' || 
       this.registryForm.value.password == ''){
        
        Swal.fire({
          title: '¡Error!',
          text:'Faltan campos por rellenar',
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });
        return;          }

        if(this.registryForm.value.password != this.registryForm.value.password2){

          Swal.fire({
            title: '¡Error!',
            text:'Las contraseñas no coinciden',
            icon: 'error',
            confirmButtonText: 'De acuerdo',
            allowOutsideClick: false
          });
          return;
          
        }

    if(!this.registryForm.valid) {
      console.warn('Errores en el formulario');
      Swal.fire({
        title: '¡Error!',
        text:'Rellene los campos correctamente',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    this.waiting=true;

    this.usuarioService.registry(this.registryForm.value ?? '').subscribe({ // utilizar   ??  o ||
      next: (res:any) => {
        console.log('Respuesta al subscribe de registry:', res);
  
        localStorage.setItem('email', this.registryForm.value.email!);
        localStorage.setItem('rol', 'ROL_BASICO');

        this.loginForm.email = this.registryForm.value.email;
        this.loginForm.password = this.registryForm.value.password;

        Swal.fire({
          title: '¡Registro completado!',
          text: ``,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        }).then( (result) => {
          if(true) {
            this.usuarioService.login(this.loginForm).subscribe((resp: any) =>{
              localStorage.setItem('token',resp.token);
            } )
            this.router.navigateByUrl('/three');
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

  campoValido( campo: string ) {
    return this.registryForm.get(campo)?.valid || this.formSubmint; // Porque sin el interrogante da error ???
  }

}
