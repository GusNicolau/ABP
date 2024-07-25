import { Component, OnDestroy } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import {PopupActualizarService} from '../../services/popupActualizar.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-act-usuario',
  templateUrl: './popup-act-usuario.component.html',
  styleUrls: ['./popup-act-usuario.component.css']
})
export class PopupActUsuarioComponent implements OnDestroy {

  public formSubmint2 = false;
  public waiting2 = false;

  roles = ['ROL_ADMIN', 'ROL_BASICO'];
 


  usuario: any = {
    nombre: localStorage.getItem('nombre') || "No disponible",
    apellidos: localStorage.getItem('apellidos') || "No disponible",
    _id: localStorage.getItem('idUsuario') || "No disponible",
    rol:localStorage.getItem('rolUsuario') || "No disponible",
    email: localStorage.getItem('emailUsuario') || "No disponible"
  }

  rolSeleccionado = this.usuario.rol;

  

  constructor(private usuariosService: UsuarioService,
     private popupActService: PopupActualizarService){

  }

  ngOnDestroy(): void {

    this.popupActService.closePopup();

  }

  closePopup(){

    this.usuariosService.putUsuarios(this.usuario,this.usuario._id).subscribe({
      next: (res:any) => {
        Swal.fire({
          title: '¡Usuario actualizado!',
          text: `El usuario se ha actualizado de manera correcta`,
          icon: 'success',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        }).then(function (result) {
          if(true) {

            window.location.reload();
          }

        });
        this.popupActService.closePopup();

      },
      error: (err) => {
        Swal.fire({
          title: '¡Error al actualizar usuario!',
          text: err.error.msg,
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
      }, complete: () => console.info('Complete')
    });



  }

}
