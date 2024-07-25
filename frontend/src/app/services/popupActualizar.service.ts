
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PopupActComponent } from '../components/popup-act/popup-act.component';
import { PopupActUsuarioComponent } from '../components/popup-act-usuario/popup-act-usuario.component';

@Injectable({
  providedIn: 'root'
})
export class PopupActualizarService {

  constructor(private dialog: MatDialog) { }

  openPopup(ejercicio:any) {

    //Guardamos la información del ejercicio
    localStorage.setItem('titulo', ejercicio.titulo);
    localStorage.setItem('descripcion', ejercicio.descripcion);
    localStorage.setItem('parteCuerpo', ejercicio.parteCuerpo);
    localStorage.setItem('musculo', ejercicio.musculo);
    localStorage.setItem('video', ejercicio.video);
    localStorage.setItem('id', ejercicio._id);

    this.dialog.open(PopupActComponent);

   
  }

  openPopupUsuario(usuario: any){

    localStorage.setItem('nombre', usuario.nombre);
    localStorage.setItem('apellidos', usuario.apellidos);
    localStorage.setItem('emailUsuario', usuario.email);
    localStorage.setItem('rolUsuario', usuario.rol);
    localStorage.setItem('idUsuario', usuario._id);

    this.dialog.open(PopupActUsuarioComponent);

  }

  closePopup() {
    //Cerramos el popup y borramos la información
    this.dialog.closeAll();

    this.limpiarLocalStorage();

  }


  limpiarLocalStorage() {
    localStorage.removeItem('titulo');
    localStorage.removeItem('descripcion');
    localStorage.removeItem('imagen');
    localStorage.removeItem('video');
    localStorage.removeItem('musculo');
    localStorage.removeItem('parteCuerpo');
    localStorage.removeItem('id');

    localStorage.removeItem('nombre');
    localStorage.removeItem('apellidos');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('idUsuario');
    
  }

}
