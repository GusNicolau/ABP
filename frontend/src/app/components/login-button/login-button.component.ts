import { Component, ElementRef, HostListener, OnInit  } from '@angular/core';
import { UsuarioService } from './../../services/usuario.service';
import { FormBuilder, Validators, FormsModule, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { Exercise } from 'src/app/interfaces/exercise.interface';
import { NewFav } from 'src/app/interfaces/newFav.interface';

import { passwordValidator } from 'src/app/auth/validators/password.validator';
//import * as TMotorTAG from 'src/app/motor/TMotorTAG';
import { TMotorTAG } from './../../motor/TMotorTAG';
import * as glm from 'gl-matrix';


@Component({
  selector: 'app-login-button',
  templateUrl: './login-button.component.html',
  styleUrls: ['./login-button.component.css']
})
export class LoginButtonComponent implements OnInit {
  favoritos: Exercise[] = [];

  constructor(private elementRef: ElementRef,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router,
  ){}

  public formSubmint = false;
  public waiting = false;


  public sesion= false;

 exercises: Exercise[] = [];

  ejsPrueba: Exercise[] = [
  {
      titulo: 'Ejercicio 1',
      descripcion: 'Descripción del ejercicio 1Descripción del ejercicio 1Descripción del ejercicio 1Descripción del ejercicio 1Descripción del ejercicio 1Descripción del ejercicio 1Descripción del ejercicio 1',
      imagen: 'imagen1.png',
      parteCuerpo: 'Piernas',
      musculo: 'Cuádriceps',
      consejos: ['Calentar antes de empezar', 'Mantener la espalda recta'],
      ejercicioAlternativo: 'Sentadilla con peso',
      video: 'https://www.youtube.com/watch?v=OAlNlOpBU1Y&list=RDZOvEN3-JWak&index=4'
  }
];

ejsPrueba1: Exercise[] = [
  {
      titulo: '',
      descripcion: '',
      imagen: '',
      parteCuerpo: '',
      musculo: '',
      consejos: [''],
      ejercicioAlternativo: '',
      video: ''
  }
];

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required ]
  });

  public loginForm2 = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required ]
  });

  public pswForm = this.fb.group({
    pswAct: ['', [Validators.required]],
    pswNueva: ['',[Validators.required, passwordValidator()]],
    pswNueva2: ['', [Validators.required, passwordValidator()] ]
  });

  public registerForm = this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos:['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['',[Validators.required, passwordValidator()]],
    password2: ['',[Validators.required, passwordValidator()] ],
    terms: false
  });

  usuario: any={
    email:"",
    password:""
  };

  nuevoFav: NewFav = {
    email: localStorage.getItem('email'),
    favoritos: []  // Inicialmente un array vacío de Exercise
  };



  ngOnInit(): void {

    if(localStorage.getItem('token') != ''){
      this.usuarioService.validarToken().subscribe(
        res => {
          if(res) {
            this.sesion = true;

          }
        });
    }
    this.actualizarFavoritos();





  }

  showPopup: boolean = false;

  popupVisible: boolean = false;

  dropdownOpen: boolean = false;

  showChangePasswordForm: boolean = false;

  showRegister: boolean = false;

  showFavoritos: boolean = false;

  favsVacios: boolean = false;

  hayFavs: boolean = false;




  toggleDropdown(event: Event) {
    event.stopPropagation(); // Evita el cierre automático del menú al hacer clic
    this.dropdownOpen = !this.dropdownOpen;

    if(this.showChangePasswordForm == true){
      this.showChangePasswordForm = false;
      this.dropdownOpen = false;
    }

    if(this.showFavoritos == true){

      this.showFavoritos = false;

    }
  }



  showFavs() {
    this.showFavoritos = !this.showFavoritos;
    this.dropdownOpen = false;
    //Forma de subir a favoritos
    this.usuarioService.getFavoritos(localStorage.getItem('uid')).subscribe(
      resp => {
        if (resp) {
          this.exercises = resp;
          if (this.exercises.length === 0) {
            this.favsVacios = true;
          }

          else{

            this.favsVacios = false;

            this.hayFavs = true;
          }
          // Añadir favorito al array
          //this.exercises.push(this.ejsPrueba[0]);

          this.nuevoFav.favoritos = this.exercises;
          //this.usuarioService.putFavoritos(this.nuevoFav, localStorage.getItem('uid')).subscribe(resp =>{console.log(resp)});

        }
      });
  }

  toggleVideo(ejercicio) {
    const videoId = this.getYouTubeVideoId(ejercicio.video);
    if (videoId) {
      const videoLink = document.createElement('a');
      videoLink.href = ejercicio.video;
      videoLink.target = '_blank';
      videoLink.classList.add('video-link');
      videoLink.style.borderRadius = '10px';
      videoLink.style.overflow = 'hidden';
      videoLink.style.marginTop = '20px';
      const videoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      videoLink.innerHTML = `<img src="${videoThumbnailUrl}" style="width: 100%; height: auto;">`;
      return videoLink; // Devolver solo el videoLink
    }
    return null;
  }
  


  getYouTubeVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  }

  async expandExercise(ejercicio, event) {
    await this.actualizarFavoritos();
    const exerciseDiv = event.currentTarget as HTMLElement;
    const expandedItems = document.querySelectorAll('.exercise-item.expanded') as NodeListOf<HTMLElement>;
  
    if (exerciseDiv.classList.contains('expanded')) {
      exerciseDiv.classList.remove('expanded');
      exerciseDiv.style.height = 'auto'; // Restaurar la altura automática
      const descriptionElement = exerciseDiv.querySelector('.exercise-description');
  
      if (descriptionElement) {
        descriptionElement.textContent = ejercicio.descripcion.slice(0, 25) + (ejercicio.descripcion.length > 25 ? '...' : '');
      }
      const videoLink = exerciseDiv.querySelector('.video-link');
      if (videoLink) {
        videoLink.remove();
      }
      const playButton = exerciseDiv.querySelector('.play-button');
      /*if (playButton) {
        playButton.remove();
      }*/
    } else {
      expandedItems.forEach(expandedItem => {
        expandedItem.classList.remove('expanded');
        expandedItem.style.height = 'auto'; // Restaurar la altura automática
        const descriptionElement = expandedItem.querySelector('.exercise-description');
        const musculoElement = expandedItem.querySelector('.exercise-musculo');
        if (musculoElement) {
          const musculo = expandedItem.getAttribute('data-musculo');
          musculoElement.textContent = musculo;
        }
        if (descriptionElement) {
          const description = expandedItem.getAttribute('data-description') || '';
          descriptionElement.textContent = description.slice(0, 25) + (description.length > 25 ? '...' : '');
        }
        const expandedVideoLink = expandedItem.querySelector('.video-link');
        if (expandedVideoLink) {
          expandedVideoLink.remove();
        }
        const starButton = expandedItem.querySelector('.star-button');
        if (starButton) {
          //starButton.remove();
        }
        const playButton = expandedItem.querySelector('.play-button');
        /*if (playButton) {
          playButton.remove();
        }*/
      });
  
      exerciseDiv.classList.add('expanded');
      exerciseDiv.style.height = 'auto'; // Restaurar la altura automática
      exerciseDiv.style.marginTop = '15px';
      exerciseDiv.style.marginBottom = '15px';
  
      const descriptionElement = exerciseDiv.querySelector('.exercise-description');
      if (descriptionElement) {
        descriptionElement.textContent = ejercicio.descripcion;
      }
  
      const videoLink = this.toggleVideo(ejercicio);
      if (videoLink) {
        const textContainer = exerciseDiv.querySelector('.text-container');
        if (textContainer) {
          textContainer.appendChild(videoLink);
        }
      }
  
      // Crear y agregar el botón de reproducción
      const playButton = document.createElement('div');
      playButton.classList.add('play-button');
      playButton.innerHTML = '&#9658;'; // Código HTML para el triángulo (►)
      playButton.style.width = '30px';
      playButton.style.height = '30px';
      playButton.style.fontSize = '30px';
      playButton.style.color = '#fff';
      playButton.style.cursor = 'pointer';
      let val = 1;
      playButton.addEventListener('click', () => {
        if (val === 1) {
          playButton.innerHTML = '&#10074;&#10074;';
          val = 0;
          //const motorTAG = new TMotorTAG();
          //TMotorTAG.crearAnimacion(TMotorTAG.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(1, 1, 1), "animaciones/sentadilla/Sentadilla");
          //TMotorTAG.activarAnimacion(); // Llamar a la función para activar la animación
        } else {
          playButton.innerHTML = '&#9658;';
          val = 1;
          //TMotorTAG.desactivarAnimacion(); // Llamar a la función para desactivar la animación
        }
      });
  
      //exerciseDiv.appendChild(playButton); // Agregar el botón de reproducción al div del ejercicio
    }
  }

  
  
  getRandomColor2() {
    const colors = ['#FFCC99', '#FFD699', '#FFEC99', '#FFFD99', '#F9FF99']; // Agrega los colores de tu gama de naranjas claros
    return colors[Math.floor(Math.random() * colors.length)];

  }
  async toggleFavorite(ejercicio: any, event: Event) {
    // Lógica para eliminar el ejercicio de favoritos

    for(let i = 0; i < this.favoritos.length; i++){
      if(this.favoritos[i].titulo == ejercicio.titulo){

          this.favoritos.splice(i, 1);
          this.nuevoFav.favoritos = this.favoritos;
         await this.usuarioService.putFavoritos(this.nuevoFav, localStorage.getItem('uid')).subscribe(resp => {});
          this.actualizarFavoritos();
      }
    }
  }


  private actualizarFavoritos(){
    this.favoritos = [];
    this.usuarioService.getFavoritos(localStorage.getItem('uid')).subscribe(resp => {
        this.favoritos = resp;
    });
  }




  /*
  @HostListener('document:click', ['$event'])
  clickOutsideDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.dropdown')) {
      this.dropdownOpen = false;
    }
  }
*/
  togglePopup() {

    if(this.showRegister){
      this.showRegister= false;
    }

    else{
      this.showPopup = true;
    }


  }

  cerrarLogin(){
    this.showPopup = false;


  }

  retrocederLogin(){

    this.showRegister = !this.showRegister;

    this.showPopup = !this.showPopup;


  }

  retrocederContra(){

    this.showChangePasswordForm = false;

    this.showFavoritos = false;


    this.dropdownOpen = true;

    this.actualizarFavoritos();

  }

  popupRegister(){



    this.showPopup = !this.showPopup;

    this.showRegister = !this.showRegister;

  }

  register(){

    this.formSubmint = true;

    if(this.registerForm.value.nombre == '' ||
       this.registerForm.value.password == '' ||
       this.registerForm.value.password2 == ''){

        Swal.fire({
          title: '¡Error!',
          text:'Faltan campos por rellenar',
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });
        return;          }

        if(this.registerForm.value.password != this.registerForm.value.password2){

          Swal.fire({
            title: '¡Error!',
            text:'Las contraseñas no coinciden',
            icon: 'error',
            confirmButtonText: 'De acuerdo',
            allowOutsideClick: false
          });
          return;

        }

    if(this.registerForm.get('email')?.invalid) {

      Swal.fire({
        title: '¡Error!',
        text:'El email no tiene un formato correcto',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    if(this.registerForm.get('password')?.invalid || this.registerForm.get('password2')?.invalid) {

      Swal.fire({
        title: '¡Error!',
        text:'La contraseña debe tener al menos 7 caracteres y tener al menos un número y una mayúscula',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    if(this.registerForm.value.terms == false) {

      Swal.fire({
        title: '',
        text:'Debe aceptar los Términos y Condiciones para poder crear su cuenta',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      return;
    }

    //console.log(this.registerForm.value);

    this.usuarioService.registry(this.registerForm.value ?? '').subscribe({ // utilizar   ??  o ||
      next: (res:any) => {

        localStorage.setItem('email', this.registerForm.value.email!);
        localStorage.setItem('rol', 'ROL_BASICO');

        this.loginForm.value.email = this.registerForm.value.email;
        this.loginForm.value.password = this.registerForm.value.password;

        Swal.fire({
          title: '¡Registro completado!',
          text: ``,
          icon: 'success',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        }).then( (result) => {
          if(true) {

            this.login();
           // this.router.navigateByUrl('/three');
           //window.location.reload();
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

  login(){

    this.formSubmint = true;

    if(this.loginForm.value.email == '' || this.loginForm.value.password == '') {
      Swal.fire({
        title: '¡Error!',
        text:'Faltan campos por rellenar',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;
    }

    this.waiting=true;

    console.log('Campos:', this.loginForm.value);


    this.usuarioService.login(this.loginForm.value).subscribe({ // utilizar   ??  o ||
      next: (res:any) => {
        //console.log('Respuesta al subscribe de login:', res);



          localStorage.setItem('email', this.loginForm.value.email!);
          localStorage.setItem('token', res.token);
          localStorage.setItem('uid', res.usuarioBD._id)



          window.location.reload();



      },
      error: (err) => {
        console.warn('Error respuesta api:', err);
        Swal.fire({
          title: '¡Error!',
          text: err.error.msg || 'No pudo completarse la acción. Vuelva a intentarlo más tarde',
          icon: 'error',
          confirmButtonText: 'Ok',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => console.info('Complete')
    });

  }

  changePsw(){

    if(this.pswForm.value.pswAct == '' || this.pswForm.value.pswNueva == '' || this.pswForm.value.pswNueva2 == '') {
      Swal.fire({
        title: '¡Error!',
        text:'Faltan campos por rellenar',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;
    }

    if(this.pswForm.value.pswNueva !=  this.pswForm.value.pswNueva2) {
      Swal.fire({
        title: '¡Error!',
        text:'Las contraseñas nuevas no coinciden',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;
    }

    if(this.pswForm.value.pswAct == this.pswForm.value.pswNueva){
      Swal.fire({
        title: '¡Error!',
        text:'La contraseña nueva no puede ser igual a la actual',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;

    }

    if(!this.pswForm.valid) {
      Swal.fire({
        title: '¡Error!',
        text:'La nueva contraseña debe ser de al menos 7 caracteres tener al menos un número y una mayúscula',
        icon: 'error',
        confirmButtonText: 'De acuerdo',
        allowOutsideClick: false
      });
      this.waiting = false;
      return;
    }







    this.formSubmint = true;

    //this.loginForm2.value.email = localStorage.getItem('email');
    //this.loginForm2.value.password = this.pswForm.value.pswAct;

    this.usuario.email= localStorage.getItem('email');
    this.usuario.password  = this.pswForm.value.pswAct;



    this.usuarioService.login(this.usuario || '').subscribe({ // utilizar   ??  o ||
      next: (res:any) => {
        //console.log('Respuesta al subscribe de login:', res);

        if(res){

          this.usuario.password  = this.pswForm.value.pswNueva; //Le asignamos la nueva contraseña para actualizarla

          this.usuarioService.putContra(this.usuario, localStorage.getItem('uid')).subscribe({
            next: (res:any) => {

              console.log(res);

              if(res){

                Swal.fire({
                  title: '¡Contraseña actualizada!',
                  text: ``,
                  icon: 'success',
                  confirmButtonText: 'De acuerdo',
                  allowOutsideClick: false
                }).then( (result) => {
                  if(true) {
                    window.location.reload();
                    this.waiting = true;
                  }
                });

              }

            },

            error: (err) => {

              Swal.fire({
                title: '¡Error!',
                text:'No se pudo actualizar la contraseña',
                icon: 'error',
                confirmButtonText: 'De acuerdo',
                allowOutsideClick: false
              });
              this.waiting = false;
              return;


            }



          })

        }


      },
      error: (err) => {

        Swal.fire({
          title: '¡Error!',
          text:'La contraseña actual es incorrecta',
          icon: 'error',
          confirmButtonText: 'De acuerdo',
          allowOutsideClick: false
        });
        this.waiting = false;
      },
      complete: () => console.info('Complete')
    });



    }


  eliminar(){


    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Tu cuenta se eliminará permanentemente!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, eliminar cuenta'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.deleteUsuarios(localStorage.getItem('uid')).subscribe({
          next: (res:any) => {

            if(res){

              localStorage.removeItem('email');

              this.logout();

            }

          },
          error: (err) => {

            Swal.fire({
              title: '¡Error!',
              text:'No se pudo eliminar correctamente la cuenta',
              icon: 'error',
              confirmButtonText: 'De acuerdo',
              allowOutsideClick: false
            });
            return;

          }

        });

      }});

  }







  cambioContra(){

    this.actualizarFavoritos();

    this.dropdownOpen = !this.dropdownOpen;
    this.showChangePasswordForm = !this.showChangePasswordForm;

  }

  logout(){
    this.usuarioService.logoutPublic();
    window.location.reload();
  }

  campoValido( campo: string ) {
    return this.loginForm.get(campo)?.valid || this.formSubmint; // Porque sin el interrogante da error ???
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      //this.showPopup = false;
      //this.dropdownOpen = false;
      //this.showRegister = false;
    }
  }



private getRandomColor(): string {
  const colors = ['#2d98c2', '#59bbe0 ', '#548ea4', '#4e7fe5', '#95b4f5', '#2e4e8f', '#3d7af8', '#59509a', '#9de0fa', '#b8e6f8', '#1bb4ef', '#755dcf'];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}
}
