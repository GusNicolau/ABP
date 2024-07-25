import { Component, OnDestroy, OnInit } from '@angular/core';
import { PopupService } from '../../services/popup.service';

@Component({
  selector: 'app-popup-usuario',
  templateUrl: './popup-usuario.component.html',
  styleUrls: ['./popup-usuario.component.css']
})
export class PopupUsuarioComponent implements OnInit, OnDestroy{

  usuarioSeleccionado: any;

  info: any = {
    nombre: localStorage.getItem('nombre') || "No disponible",
    apellidos: localStorage.getItem('apellidos') || "No disponible",
    _id: "",
    rol:localStorage.getItem('rolUsuario') || "No disponible",
    email: localStorage.getItem('emailUsuario') || "No disponible"
  }

  ngOnInit(): void {

    this.usuarioSeleccionado = this.info;

  }

  ngOnDestroy(): void {

    this.popupService.closePopup();

  }

  constructor(private popupService: PopupService){

  }

  openPopup(usuario: any) {
    this.popupService.openPopupUsuario(usuario);


  }
  
  closePopup(){
    this.popupService.closePopup();
  }

}
