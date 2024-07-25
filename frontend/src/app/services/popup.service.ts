
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { PopupCourseComponent } from '../components/popup-course/popup-course.component';
import { PopupUsuarioComponent } from '../components/popup-usuario/popup-usuario.component';
import { PopupActUsuarioComponent } from '../components/popup-act-usuario/popup-act-usuario.component';

@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(private dialog: MatDialog) { }

  openPopup(ejercicio:any) {

    //Guardamos la información del ejercicio
    localStorage.setItem('titulo', ejercicio.titulo);
    localStorage.setItem('descripcion', ejercicio.descripcion);
    localStorage.setItem('parteCuerpo', ejercicio.parteCuerpo);
    localStorage.setItem('musculo', ejercicio.musculo);
    localStorage.setItem('video', ejercicio.video);

    this.dialog.open(PopupCourseComponent);

   
  }

  openPopupUsuario(usuario: any){

    localStorage.setItem('nombre', usuario.nombre);
    localStorage.setItem('apellidos', usuario.apellidos);
    localStorage.setItem('emailUsuario', usuario.email);
    localStorage.setItem('rolUsuario', usuario.rol);

    this.dialog.open(PopupUsuarioComponent);

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

    localStorage.removeItem('nombre');
    localStorage.removeItem('apellidos');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('rolUsuario');

   
    
  }

  

}
