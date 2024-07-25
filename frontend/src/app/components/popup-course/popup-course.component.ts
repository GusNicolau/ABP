import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PopupService } from '../../services/popup.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-popup-course',
  templateUrl: './popup-course.component.html',
  styleUrls: ['./popup-course.component.css']
})
export class PopupCourseComponent implements OnInit, OnDestroy {

  popupForm: FormGroup;

  ejercicioSeleccionado: any;

  info: any = {
    titulo: localStorage.getItem('titulo') || "No disponible",
    descripcion: localStorage.getItem('descripcion') || "No disponible",
    _id: "",
    consejos: [],
    imagen:"",
    parteCuerpo: localStorage.getItem('parteCuerpo') || "No disponible",
    musculo: localStorage.getItem('musculo') || "No disponible",
    ejercicioAlternativo:"",
    enlaceVideo: localStorage.getItem('video') || "No disponible"
  }

  ngOnInit(): void {

this.ejercicioSeleccionado = this.info;

if(this.info.enlaceVideo=== "undefined"){
  this.info.enlaceVideo = 'No disponible'
}
if(this.info.parteCuerpo=== "undefined"){
  this.info.parteCuerpo = 'No disponible'
}
if(this.info.musculo=== "undefined"){
  this.info.musculo = 'No disponible'
}


  }

  ngOnDestroy(): void {

    this.popupService.closePopup();
    
  }

  constructor(private formBuilder: FormBuilder, private popupService: PopupService, private dialog: MatDialog) {
    this.popupForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  mostrarInfo(ejercicio:any){

    console.log(ejercicio);



  }

  openPopup(ejercicio: any) {
    this.popupService.openPopup(ejercicio);


  }

  closePopup(){
    this.popupService.closePopup();

  }



}
