import { Component, OnInit, NgModule } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';

import { PopupService } from '../../services/popup.service';
import { UploadsService } from '../../services/uploads.service';
import { PopupActualizarService } from '../../services/popupActualizar.service';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  showPopup: boolean = false;

  formularioSearch: FormGroup;

  usuarioAdmin: boolean = false;

  users: any[] = [];

  public espera = false;
  usuarios: any[]=[{
    nombre: "",
    apellidos: "",
    _id: "",
    email: "",
    rol:"",
    alta:""
  }];

  constructor(private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private popupService: PopupService,
    private popupActualizarService: PopupActualizarService,
    private uploadService: UploadsService,
    private router: Router) {
      this.formularioSearch = this.fb.group({
        nombre: ['']
      });
    }

  ngOnInit(): void {

    this.getUsuarios();

    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/test');
    }

  }

  search(): void {
    const filtro = this.formularioSearch.value;
    console.log(filtro);
    this.usuarioService.searcher(filtro).subscribe({
      next: (users:any) => {
        //console.log('Respuesta al subscribe de busqueda:', users);
        this.users = users;
      },
      error: (err) => {
        console.error('Error al buscar usuarios', err);
      },
      complete: () => console.info('Completed your search')
    });
  }

  getUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(res => {

    this.usuarios = res['usuarios'];

    });
  }

  actualizarUsuarios(nuevo: any []) {



    this.usuarios = nuevo;




  }

  mostrarUsuario(usuario: any){


    this.popupService.openPopupUsuario(usuario);


  }

  editarUsuario(usuario:any){

    this.popupActualizarService.openPopupUsuario(usuario);



  }

  borrarUsuario(id: any){

    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {



        this.usuarioService.deleteUsuarios(id).subscribe({
          next: (res:any) => {

            for (let i = 0; i < this.usuarios.length; i++) {

              if(this.usuarios[i]._id == id) {

                this.usuarios.splice(i,1);


              }
            }

            this.actualizarUsuarios(this.usuarios);

            Swal.fire({
              title: '¡Usuario eliminado!',
              text: `El usuario se ha eliminado de manera correcta`,
              icon: 'success',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            }).then(function (result) {
              if(true) {
               // window.location.reload();
              }
            });
          },
          error: (err) => {
            Swal.fire({
              title: '¡Error!',
              text: `No se pudo eliminar el usuario de manera correcta`,
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
          }, complete: () => console.info('Complete')
        });


      }
    });



  }

}
