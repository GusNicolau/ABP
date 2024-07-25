import { Component, OnInit } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { PopupService } from '../../services/popup.service';
import { UploadsService } from '../../services/uploads.service';
import { PopupActualizarService } from '../../services/popupActualizar.service';
import { FormGroup, FormBuilder } from '@angular/forms';

import { Router } from '@angular/router';

import Swal from 'sweetalert2';



@Component({
  selector: 'app-ejercicios',
  templateUrl: './ejercicios.component.html',
  styleUrls: ['./ejercicios.component.css']
})
export class EjerciciosComponent implements OnInit {

  gruposMusculares: { parteCuerpo: string, items: any[] }[] = [];

  showPopup: boolean = false;

  usuarioAdmin: boolean = false;

  formularioBusqueda: FormGroup;

  // Se puede eliminar la variable y dejar items que se use para
  // dos listados o es necesario crear una variable ind. por listado??
  ejercicios: any[] = [];

  public espera = false;
  items: any[]=[{
    titulo: "",
    descripcion: "",
    _id: "",
    consejos: [],
    imagen:"",
    parteCuerpo: "",
    musculo: "",
    ejercicioAlternativo:"",
    video: ""

  }];

  public ejerciciosForm = ({
    titulo: ['Curl de bicepss'],
    descripcion: ['Este ejercicio...blablabla']
  });

  constructor(private fb: FormBuilder,
    private exerciseService: ExerciceService,
    private popupService: PopupService,
    private popupActualizarService: PopupActualizarService,
    private uploadService: UploadsService,
    private router :Router) {
      this.formularioBusqueda = this.fb.group({
        titulo: ['']
      });
    }

  ngOnInit(): void {


    this.getItems();

    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/test');
    }

  }

  buscar(): void {
    const filtro = this.formularioBusqueda.value;
    this.exerciseService.buscador(filtro).subscribe({ // utilizar   ??  o ||
      next: (ejercicios:any) => {
        console.log('Respuesta al subscribe de busqueda:', ejercicios);
        this.ejercicios = ejercicios;
      },
      error: (err) => {
        console.error('Error al buscar ejercicios', err);
      },
      complete: () => console.info('Completed your search')
    });
  }


  obtenerGruposMusculares(): any[] {

    const grupos: any[] = [];

    this.items.forEach((item : any) => {
      if (!grupos.includes(item.parteCuerpo)){

        grupos.push(item.parteCuerpo);

      }

    });

    return grupos;
  }


  getItems(): void {

    this.exerciseService.getItems().subscribe(items => {


    this.items = items['ejercicios'];

    console.log('Cargo los ejercicios',this.items);

    this.agruparEjerciciosPorMusculo();
    });


  }


  actualizarItems(nuevo: any []) {



    this.items = nuevo;

    this.agruparEjerciciosPorMusculo();



  }

  agruparEjerciciosPorMusculo() {

    this.gruposMusculares = [];

    this.items.forEach(item => {

      const grupoMuscularIndex = this.gruposMusculares.findIndex(grupo => grupo.parteCuerpo === item.parteCuerpo);

      if (grupoMuscularIndex === -1) {
        this.gruposMusculares.push({ parteCuerpo: item.parteCuerpo, items: [item] });
      } else {
        this.gruposMusculares[grupoMuscularIndex].items.push(item);
      }
    });


  }

  mostrarEjercicio(ejercicio: any){


    this.popupService.openPopup(ejercicio);


  }

  editarEjercicio(ejercicio:any){

    this.popupActualizarService.openPopup(ejercicio);



  }

  borrarEjercicio(id :any, imagen:any){

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



        this.exerciseService.deleteItems(id).subscribe({
          next: (res:any) => {

            if(imagen !='defecto.jpg'){

              this.uploadService.deleteFoto(imagen).subscribe({next: (res: any) =>{
                console.log('Respuesta al subscribe de borrar foto:', res);



              },
                error: (err) =>{

              console.log(err);

                }});

            }

            console.log('Antes de borrar', this.items);

            for (let i = 0; i < this.items.length; i++) {

              if(this.items[i]._id == id) {

                this.items.splice(i,1);


              }



            }
            console.log('Despues de borrar',this.items);

               this.actualizarItems(this.items);
            Swal.fire({
              title: '¡Ejercicio eliminado!',
              text: `El ejercicio se ha eliminado de manera correcta`,
              icon: 'success',
              confirmButtonText: 'De acuerdo',
              allowOutsideClick: false
            }).then( async (result) => {
              if(true) {
                //window.location.reload();
                //this.reloadPageWithCache();


                //await this.getItems();
              }
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error!',
              text: `No se pudo eliminar el ejercicio de manera correcta`,
              icon: 'error',
              confirmButtonText: 'Ok',
              allowOutsideClick: false
            });
          }, complete: () => console.info('Complete')
        });


      }
    });



  }

  reloadPageWithCache() {
    // Agrega un parámetro de consulta único a la URL para evitar la caché
    const cacheBuster = new Date().getTime();
    const urlWithCacheBuster = window.location.href + '?cache=' + cacheBuster;

    // Navega a la URL con el parámetro de consulta único
    window.location.href = urlWithCacheBuster;
  }

  postItems() {
    return this.exerciseService.postItems(this.ejerciciosForm).subscribe();
  }


  /*algo( valor: number) {
    console.log('Desde dashboard recibo: ', valor);
  }*/
}
