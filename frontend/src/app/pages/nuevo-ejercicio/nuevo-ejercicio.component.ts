import { Component, OnInit } from '@angular/core';
import { ExerciceService } from 'src/app/services/exercice.service';
import { UploadsService } from 'src/app/services/uploads.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-nuevo-ejercicio',
  templateUrl: './nuevo-ejercicio.component.html',
  styleUrls: ['./nuevo-ejercicio.component.css']
})
export class NuevoEjercicioComponent implements OnInit {

  public formSubmint2 = false;
  public waiting2 = false;

  imagenGuardada: boolean = false;

  textoError = '';

  existeTitulo = false;

  selecMusculo = false;

  ejercicio: any = {
    titulo: "",
    descripcion:"",
    consejos: [],
    imagen: "defecto.jpg",
    parteCuerpo: "",
    musculo: "",
    ejercicioAlternativo:"",
    video: ""
  }

  constructor( private fb: FormBuilder,
    private exerciceService: ExerciceService,
    private uploadsService: UploadsService,
    private router: Router ) {
  }

  imagenVariable: any;

  formDataFoto: any;

  partesCuerpoSelect!: HTMLSelectElement;
  entrenamientoSelect!: HTMLSelectElement;

  usuarioAdmin: boolean = false;

  ngOnInit(): void {

    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/test');
    }

      const partesCuerpoSelect = document.getElementById('parteCuerpo') as HTMLSelectElement;
      const entrenamientoSelect = document.getElementById('musculo') as HTMLSelectElement;

      partesCuerpoSelect.addEventListener('change', function() {
      const selectedParteCuerpo = partesCuerpoSelect.value;

      if (selectedParteCuerpo === 'Ninguna') {
        entrenamientoSelect.disabled = true;
        entrenamientoSelect.innerHTML = '<option value="Ninguno">Primero selecciona parte del cuerpo arriba...</option>';
      } else {
        entrenamientoSelect.disabled = false;
        entrenamientoSelect.innerHTML = '';

        if (selectedParteCuerpo === 'Pierna') {
          addOption(entrenamientoSelect, 'vacio', 'Seleccione un músculo...');
          addOption(entrenamientoSelect, 'cuadriceps', 'Cuádriceps');
          addOption(entrenamientoSelect, 'isquiotibiales', 'Isquiotibiales');
          addOption(entrenamientoSelect, 'gluteos', 'Glúteos');
          addOption(entrenamientoSelect, 'gemelos', 'Gemelos');
        } else if (selectedParteCuerpo === 'Brazo') {
          addOption(entrenamientoSelect, 'vacio', 'Seleccione un músculo...');
          addOption(entrenamientoSelect, 'biceps', 'Bíceps');
          addOption(entrenamientoSelect, 'triceps', 'Tríceps');
          addOption(entrenamientoSelect, 'hombros', 'Hombros');
          addOption(entrenamientoSelect, 'antebrazos', 'Antebrazos');
        } else if (selectedParteCuerpo === 'Espalda') {
          addOption(entrenamientoSelect, 'vacio', 'Seleccione un músculo...');
          addOption(entrenamientoSelect, 'dorsales', 'Dorsales');
          addOption(entrenamientoSelect, 'trapecios', 'Trapecios');
          addOption(entrenamientoSelect, 'lumbares', 'Lumbares');
        } else if (selectedParteCuerpo === 'Core') {
          addOption(entrenamientoSelect, 'vacio', 'Seleccione un músculo...');
          addOption(entrenamientoSelect, 'pectorales', 'Pectorales');
          addOption(entrenamientoSelect, 'abdominales', 'Abdominales');
          addOption(entrenamientoSelect, 'oblicuos', 'Oblicuos');
        }
      }
    });

    function addOption(select: HTMLSelectElement, value: string, text: string) {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = text;
      select.appendChild(option);
    }
  }

  async buscar(): Promise<boolean> {
    try {
      const existe = await this.exerciceService.getEjercicio(this.ejercicio.titulo).toPromise();
      if (existe !== undefined) { // Check if existe is not undefined
        return existe;
      } else {
        return false; // Return false if existe is undefined
      }
    } catch (error) {
      console.error('Error al buscar ejercicio:', error);
      return false; // Return false in case of error
    }
  }

  previewImage(event: Event) {
    const fotoInput = event.target as HTMLInputElement;
    const file: File | null = (fotoInput.files && fotoInput.files[0]) || null;

    if (file) {
        this.formDataFoto = file;

        this.ejercicio.imagen = file.name;
    }

    const input = event.target as HTMLInputElement;
    const preview = document.getElementById('imagenPrevia') as HTMLImageElement;

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            if (e.target && typeof e.target.result === 'string') {
                preview.src = e.target.result as string;
                preview.style.display = 'block';
            }
        };

        reader.readAsDataURL(input.files[0]);
    }
}

  onFormSubmit(event: Event) {
    event.preventDefault(); // Evitar que el formulario se envíe automáticamente

    const formData = new FormData();
    const fileInput = (event.target as HTMLFormElement).querySelector('#imagen') as HTMLInputElement;

    if (fileInput.files && fileInput.files[0]) {
      formData.append('imagen', fileInput.files[0]);

      console.log(formData);

      // Aquí puedes enviar la formData al servidor usando Angular HttpClient
      // Ejemplo:
      // this.httpClient.post('/ruta/del/servidor', formData).subscribe(response => {
      //   // Manejar la respuesta del servidor
      // }, error => {
      //   // Manejar errores
      // });
    } else {
      console.log('No se ha seleccionado ninguna imagen');
    }
  }



 async subirFoto() {

  this.uploadsService.postFoto(this.formDataFoto).subscribe({next: (res: any) =>{
    console.log('Respuesta al subscribe de foto:', res);

    this.ejercicio.imagen= res.nombre;

    this.imagenGuardada = true;

    console.log(this.imagenGuardada);

  },
    error: (err) =>{

  console.log(err.error.msg);

    }});

  }



  async subirEjercicio() {

    if (this.ejercicio.titulo !== '' && this.ejercicio.descripcion !== '' && this.ejercicio.parteCuerpo !== '' && this.ejercicio.musculo !== '') {

      //Buscamos el titulo en la base de datos

    const ejercicioExiste = await this.buscar();



      if(!ejercicioExiste){

        this.waiting2 = true;

      try {
        // Enviar la foto al servidor y esperar la respuesta
        if(this.ejercicio.imagen !='defecto.jpg'){
        const resFoto: any = await this.uploadsService.postFoto(this.formDataFoto).toPromise();
        console.log('Respuesta al guardar foto:', resFoto);

        // Guardar el nombre de la imagen en el ejercicio
        this.ejercicio.imagen = resFoto.nombre;

      }

        // Guardar el ejercicio utilizando el nombre de la imagen
        const resEjercicio: any = await this.exerciceService.postItems(this.ejercicio).toPromise();
        console.log('Respuesta al guardar ejercicio:', resEjercicio);

        Swal.fire({
          title: '¡Ejercicio creado!',
          text: `El ejercicio se ha creado de manera correcta`,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        }).then((result) => {
          if (true) {
            this.router.navigateByUrl('/dashboard/ejercicios');
          }
        });
      } catch (error) {
        console.error('Error al guardar foto o ejercicio:', error);
        Swal.fire({
          title: '¡Error!',
          text: 'Ocurrió un error al guardar la foto o el ejercicio',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
      } finally {
        this.waiting2 = false;
      }

      }

      else{

        Swal.fire({
          title: '¡El titulo ya existe!',
          text: `Cambia el titulo por otro diferente`,
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });

      }



    } else {
      Swal.fire({
        title: '¡No se pudo crear el ejercicio!',
        text: `Rellena todos los campos obligatorios`,
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
    }
  }

}
