import { Component, OnInit } from '@angular/core';
import { ExerciceService } from 'src/app/services/exercice.service';
import {PopupActualizarService} from '../../services/popupActualizar.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-popup-act',
  templateUrl: './popup-act.component.html',
  styleUrls: ['./popup-act.component.css']
})
export class PopupActComponent implements OnInit {

  partesCuerpoSelect!: HTMLSelectElement;
  entrenamientoSelect!: HTMLSelectElement;

  public formSubmint2 = false;
  public waiting2 = false;

  partes = ['ROL_ADMIN', 'ROL_BASICO'];

  musculo = ['ROL_ADMIN', 'ROL_BASICO'];


  ejercicio: any = {
    titulo: localStorage.getItem('titulo') || "No disponible",
    descripcion: localStorage.getItem('descripcion') || "No disponible",
    _id: localStorage.getItem('id'),
    consejos: [],
    parteCuerpo: localStorage.getItem('parteCuerpo') || "No disponible",
    musculo: localStorage.getItem('musculo') || "No disponible",
    ejercicioAlternativo:"",
    video: localStorage.getItem('video') || "No disponible"
  }

  public createForm = this.fb.group({
    titulo: ['Prueba', Validators.required],
    descripcion: ['Prueba', Validators.required],
    imagen: ['imagen.png', Validators.required],
    parteCuerpo: ['Pierna', Validators.required],
    musculo: ['Gemelos', Validators.required],
    consejos: ['', Validators.required],
    ejercicioAlternativo: ['', Validators.required]
  });

  constructor( private fb: FormBuilder,
    private exerciceService: ExerciceService,
    private router: Router,
    private popupActService: PopupActualizarService ) {
  }


  ngOnInit(): void {

    //Variables para modificar valor del elemento HTML select
    const partesCuerpoSelect = document.getElementById('parteCuerpo') as HTMLSelectElement;
    const entrenamientoSelect = document.getElementById('musculo') as HTMLSelectElement;

    if (this.ejercicio.parteCuerpo === 'Pierna') {
      addOption(entrenamientoSelect, 'cuadriceps', 'Cuádriceps');
      addOption(entrenamientoSelect, 'isquiotibiales', 'Isquiotibiales');
      addOption(entrenamientoSelect, 'gluteos', 'Glúteos');
      addOption(entrenamientoSelect, 'gemelos', 'Gemelos');
    } else if (this.ejercicio.parteCuerpo === 'Brazo') {
      addOption(entrenamientoSelect, 'biceps', 'Bíceps');
      addOption(entrenamientoSelect, 'triceps', 'Tríceps');
      addOption(entrenamientoSelect, 'hombros', 'Hombros');
      addOption(entrenamientoSelect, 'antebrazos', 'Antebrazos');
    } else if (this.ejercicio.parteCuerpo === 'Espalda') {
      addOption(entrenamientoSelect, 'dorsales', 'Dorsales');
      addOption(entrenamientoSelect, 'trapecios', 'Trapecios');
      addOption(entrenamientoSelect, 'lumbares', 'Lumbares');
    } else if (this.ejercicio.parteCuerpo === 'Core') {
      addOption(entrenamientoSelect, 'pectorales', 'Pectorales');
      addOption(entrenamientoSelect, 'abdominales', 'Abdominales');
      addOption(entrenamientoSelect, 'oblicuos', 'Oblicuos');
    } else {
      addOption(entrenamientoSelect, 'provisional', 'Selecciona un musculo')
    }

    partesCuerpoSelect.addEventListener('change', function() {

      vaciarSelect();

      const selectedParteCuerpo = partesCuerpoSelect.value;

      if (selectedParteCuerpo === 'Pierna') {
        addOption(entrenamientoSelect, 'cuadriceps', 'Cuádriceps');
        addOption(entrenamientoSelect, 'isquiotibiales', 'Isquiotibiales');
        addOption(entrenamientoSelect, 'gluteos', 'Glúteos');
        addOption(entrenamientoSelect, 'gemelos', 'Gemelos');
      } else if (selectedParteCuerpo === 'Brazo') {
        addOption(entrenamientoSelect, 'biceps', 'Bíceps');
        addOption(entrenamientoSelect, 'triceps', 'Tríceps');
        addOption(entrenamientoSelect, 'hombros', 'Hombros');
        addOption(entrenamientoSelect, 'antebrazos', 'Antebrazos');
      } else if (selectedParteCuerpo === 'Espalda') {
        addOption(entrenamientoSelect, 'dorsales', 'Dorsales');
        addOption(entrenamientoSelect, 'trapecios', 'Trapecios');
        addOption(entrenamientoSelect, 'lumbares', 'Lumbares');
      } else if (selectedParteCuerpo === 'Core') {
        addOption(entrenamientoSelect, 'pectorales', 'Pectorales');
        addOption(entrenamientoSelect, 'abdominales', 'Abdominales');
        addOption(entrenamientoSelect, 'oblicuos', 'Oblicuos');
      }

    });

    function vaciarSelect(): void {
        while (entrenamientoSelect.options.length > 0) {
          entrenamientoSelect.remove(0);
        }
    }

    function addOption(select: HTMLSelectElement, value: string, text: string) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    }

    if(this.ejercicio.enlaceVideo=== "undefined"){
      this.ejercicio.enlaceVideo = ''
    }
    if(this.ejercicio.parteCuerpo=== "undefined"){
      this.ejercicio.parteCuerpo = ''
    }
    if(this.ejercicio.musculo=== "undefined"){
      this.ejercicio.musculo = ''
    }

  }

  ngOnDestroy(): void {

    this.popupActService.closePopup();

  }



  closePopup(){

    this.exerciceService.putItems(this.ejercicio,this.ejercicio._id).subscribe({
      next: (res:any) => {
        Swal.fire({
          title: 'Ejercicio actualizado!',
          text: `El ejercicio se ha actualizado de manera correcta`,
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
          title: 'Error al actualizar ejercicio!',
          text: err,
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
      }, complete: () => console.info('Complete')
    });



  }


}
