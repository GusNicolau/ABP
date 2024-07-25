import { ElementRef, OnInit } from '@angular/core';
import * as glm from 'gl-matrix';
import * as twgl from 'twgl.js';
import { TNodo } from './arbol/TNodo';
import { TLuz } from './arbol/TLuz';
import { TModelo } from './arbol/TModelo';
import {TCamara} from './arbol/TCamara';
import {TGestorRecurso} from './gestor/TGestorRecurso';
import { HttpClient } from '@angular/common/http';
import { TRecursoMalla } from './gestor/TRecursoMalla';
import { TRecursoShader } from './gestor/TRecursoShader';
import { TEntidad } from './arbol/TEntidad';
import { TAnimacion } from './arbol/TAnimacion';
import { TMalla } from './gestor/TMalla';
import { ExerciceService } from '../services/exercice.service'; // Importa el servicio de ejercicios
import { TRecursoMaterial } from './gestor/TRecursoMaterial';
import { TRecursoTextura } from './gestor/TRecursoTextura';

import { Exercise } from 'src/app/interfaces/exercise.interface';
import { NewFav } from 'src/app/interfaces/newFav.interface';
import { UsuarioService } from '../../app/services/usuario.service';

export class TMotorTAG {

    raiz: TNodo;
    gestor: TGestorRecurso;
    httpc: HttpClient;
    canvasc: ElementRef<HTMLCanvasElement>;
    exerciseService: ExerciceService;

    shader: TRecursoShader | null;

    camaras: TNodo[];
    luces: TNodo[];

    camactiva: number;
    lucesactivas: boolean[];

    actualizarluz: boolean;
    actualizarcamara: boolean;

    programa: WebGLProgram;
    currentAngle: number[];

    cuerpo: TNodo | null;

    seleccionado: number;
    hoveado: number;

    modoAnimacion: boolean;
    zoomeando: boolean;
    ultimoEye: glm.vec3;

    nuevoFav: NewFav = {
        email: localStorage.getItem('email'),
        favoritos: []  // Inicialmente un array vacío de Exercise
      };

    private muscleInfoDiv!: HTMLDivElement;
    private infoDivVisible: boolean = false;
    private infoDiv!: HTMLDivElement;

    exercises: Exercise[] = [];
    favoritos: Exercise[] = [];

    ejsPrueba1: any[] = [

    ];

    //luces y cam


    constructor(
        http: HttpClient,
        canvas: ElementRef<HTMLCanvasElement>,
        exerciseService: ExerciceService, // Inyecta el servicio de ejercicios
        private usuarioService: UsuarioService,
    ) {
        this.exerciseService = exerciseService; // Inicializa aquí
        this.raiz = new TNodo("Escena");
        this.gestor = new TGestorRecurso(http, canvas);

        this.httpc = http;
        this.canvasc = canvas;

        this.shader = null;

        this.camaras = [];
        this.luces = [];

        this.camactiva= -1;
        this.lucesactivas = [];

        this.actualizarluz = false;
        this.actualizarcamara = false;

        this.programa = -1;

        this.currentAngle = [0.00, 0.00];

        this.cuerpo = null;

        this.seleccionado = 0;
        this.hoveado = 0;

        this.modoAnimacion = false;

        this.zoomeando = false;

        this.ultimoEye = glm.vec3.fromValues(0, 1, 0);





        // Pasa la camara al llamar a createControlsDiv
        this.createControlsDiv();

        // Crear un elemento 'img' para la imagen
        const imageElement = document.createElement('img');
        imageElement.src = 'assets/images/NoName7.png'; // Reemplaza 'ruta/de/la/imagen.png' con la ruta de tu imagen
        imageElement.style.position = 'absolute';
        imageElement.style.top = '10px'; // Ajusta la distancia desde la parte superior
        imageElement.style.right = '10px'; // Ajusta la distancia desde la derecha
        imageElement.style.width = '80px'; // Establece el ancho de la imagen
        imageElement.style.height = '80px'; // Establece la altura de la imagen
        imageElement.style.cursor = 'pointer'; // Cambia el cursor al pasar sobre la imagen

        // Crear un elemento 'a' para el enlace
        const linkElement = document.createElement('a');
        linkElement.href = 'https://www.tecnicfit.ovh/noname7'; // Reemplaza 'https://www.ejemplo.com' con la URL deseada
        linkElement.target = '_blank'; // Abre el enlace en una nueva pestaña
        linkElement.style.position = 'absolute';
        linkElement.style.top = '10px'; // Ajusta la distancia desde la parte superior
        linkElement.style.right = '10px'; // Ajusta la distancia desde la derecha
        linkElement.style.width = '50px'; // Establece el ancho del enlace
        linkElement.style.height = '50px'; // Establece la altura del enlace
        linkElement.style.display = 'block'; // Hace que el enlace ocupe todo el contenedor


        // Agregar la imagen al enlace
        linkElement.appendChild(imageElement);

        // Agregar el enlace al contenedor del documento
        document.body.appendChild(linkElement);
        //luces y cam
    }

    calcularCoeficientesUniforme(rgb: glm.vec3): glm.vec3  {
        const ka: glm.vec3 = glm.vec3.fromValues((rgb[0]/3)/255, (rgb[1]/3)/255, (rgb[2]/3)/255)
        const kd: glm.vec3 = glm.vec3.fromValues((rgb[0]/3)/255, (rgb[1]/3)/255, (rgb[2]/3)/255)
        const ks: glm.vec3 = glm.vec3.fromValues((rgb[0]/3)/255, (rgb[1]/3)/255, (rgb[2]/3)/255)
        return ( ka);
    }

    crearNodo(npadre: TNodo | null, traslacion: glm.vec3, rotacion: glm.vec3, escalado: glm.vec3): TNodo{
        const nodoHecho:TNodo = new TNodo("nodo");

        if(npadre == null){
            nodoHecho.setPadre(this.raiz);
            this.raiz.addHijo(nodoHecho);
        }
        if(npadre != null){
            nodoHecho.setPadre(npadre);
            npadre.addHijo(nodoHecho);
        }

        nodoHecho.setTraslacion(traslacion);
        nodoHecho.setEscalado(escalado);
        nodoHecho.setRotacion(rotacion);

        nodoHecho.setActualizarMatriz(true);

        return nodoHecho;
    }

    crearCamara(npadre: TNodo | null, traslacion: glm.vec3, rotacion: glm.vec3, escalado: glm.vec3, esperspe: boolean, fovy: number,  izq: number, drch: number, inf: number, sup: number, near: number, far: number): TNodo{
        const nodoHecho:TNodo = new TNodo("nCamara");

        if(npadre == null){
            nodoHecho.setPadre(this.raiz);
            this.raiz.addHijo(nodoHecho);
        }
        if(npadre != null){
            nodoHecho.setPadre(npadre);
            npadre.addHijo(nodoHecho);
        }

        const camara:TCamara = new TCamara(esperspe, fovy, izq, drch, inf, sup, near, far);
        nodoHecho.setEntidad(camara);

        nodoHecho.setTraslacion(traslacion);
        nodoHecho.setEscalado(escalado);
        nodoHecho.setRotacion(rotacion);

        nodoHecho.setActualizarMatriz(true);

        return nodoHecho;

    }

    crearLuz(npadre :TNodo | null, traslacion: glm.vec3, rotacion: glm.vec3, escalado: glm.vec3, intensidad: glm.vec3, direccion: glm.vec3) : TNodo {
        const nodoHecho:TNodo = new TNodo("nLuz");

        if(npadre == null){
            nodoHecho.setPadre(this.raiz);
            this.raiz.addHijo(nodoHecho);
        }
        if(npadre!= null){
            nodoHecho.setPadre(npadre);
            npadre.addHijo(nodoHecho);
        }

        const luz:TLuz = new TLuz(intensidad, direccion);
        nodoHecho.setEntidad(luz);

        nodoHecho.setTraslacion(traslacion);
        nodoHecho.setEscalado(escalado);
        nodoHecho.setRotacion(rotacion);

        nodoHecho.setActualizarMatriz(true);

        return nodoHecho;
    }

    async crearModelo(npadre: TNodo | null, traslacion: glm.vec3, rotacion: glm.vec3, escalado: glm.vec3, path: string, indice: number) :Promise<TNodo>{
        const nodoHecho:TNodo = new TNodo("nModelo");

        if(npadre == null){
            nodoHecho.setPadre(this.raiz);
            this.raiz.addHijo(nodoHecho);
        }
        if(npadre!= null){
            nodoHecho.setPadre(npadre);
            npadre.addHijo(nodoHecho);
        }

        const recmalla = await this.gestor.getRecursoMalla(path, indice);

        nodoHecho.setTraslacion(traslacion);
        nodoHecho.setEscalado(escalado);
        nodoHecho.setRotacion(rotacion);


        var modelo: TModelo;
        if (recmalla instanceof TRecursoMalla){
             modelo = new TModelo(recmalla);
             nodoHecho.setEntidad(modelo);

             nodoHecho.setActualizarMatriz(true);
        }else{
            console.error("Error creando la malla recurso");

            nodoHecho.setActualizarMatriz(true);
        }



        return nodoHecho;
    }

    async crearAnimacion(npadre: TNodo | null, traslacion: glm.vec3, rotacion: glm.vec3, escalado: glm.vec3, path: string) :Promise<TNodo>{
        const nodoHecho:TNodo = new TNodo("nModelo");

        if(npadre == null){
            nodoHecho.setPadre(this.raiz);
            this.raiz.addHijo(nodoHecho);
        }
        if(npadre!= null){
            nodoHecho.setPadre(npadre);
            npadre.addHijo(nodoHecho);
        }

        const recursosMalla: TRecursoMalla[] = [];
        for (let index = 1; index < 41; index++) {
            let rutapa = path + (index + '' + '.obj');
            const recmallaa = await this.gestor.getRecursoMalla2(rutapa);

            if(recmallaa instanceof TRecursoMalla){
                recursosMalla.push(recmallaa);
            }else{
                console.error("No se ha cargado una malla");
            }
        }

        nodoHecho.setTraslacion(traslacion);
        nodoHecho.setEscalado(escalado);
        nodoHecho.setRotacion(rotacion);

        //console.log(recursosMalla);
        const animacion = new TAnimacion(recursosMalla);

        //console.log(animacion);

        if (animacion instanceof TAnimacion){
             nodoHecho.setEntidad(animacion);

             nodoHecho.setActualizarMatriz(true);
        }else{
            console.error("Error creando la malla recurso");

            nodoHecho.setActualizarMatriz(true);
        }

        this.raiz.recorrerAnimaciones(glm.mat4.create(), animacion);

        return nodoHecho;
    }

    async crearMaterial(nodoMalla: TNodo, path: string) {

        const entid = nodoMalla.getEntidad();

        if(entid instanceof TModelo && entid != null){
            var modelo1: TModelo = entid;
            //const recmalla = await this.gestor.getRecursoMalla(path, indice);
            const recmaterial = await this.gestor.getRecursoMaterial(path);

            if(recmaterial instanceof TRecursoMaterial){
                entid.setMaterial(recmaterial);
            }
        }else{
            console.error("Error: No se ha facilitado un nodo malla")
        }


/*
        var modelo: TModelo;
        if (recmalla instanceof TRecursoMalla){
             modelo = new TModelo(recmalla);
             nodoHecho.setEntidad(modelo);

             nodoHecho.setActualizarMatriz(true);
        }
*/

    }

    async crearTextura(nodoMalla: TNodo, path: string) {

        const entid = nodoMalla.getEntidad();

        if(entid instanceof TModelo && entid != null){
            var modelo1: TModelo = entid;
            //const recmalla = await this.gestor.getRecursoMalla(path, indice);
            const recmatext = await this.gestor.getRecursoTextura(path);

            if(recmatext instanceof TRecursoTextura){
                entid.setTextura(recmatext);
            }
        }else{
            console.error("Error: No se ha facilitado un nodo malla")
        }


/*
        var modelo: TModelo;
        if (recmalla instanceof TRecursoMalla){
             modelo = new TModelo(recmalla);
             nodoHecho.setEntidad(modelo);

             nodoHecho.setActualizarMatriz(true);
        }
*/

    }


    async dibujarEscenaRapido(){
        //await this.raiz.recorrer(glm.mat4.create());


        var camaraActiva: TNodo | null = null;

        if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
            camaraActiva = this.camaras[this.camactiva];
        }

        //console.log("vamos a dibujar");


        const gl = this.canvasc.nativeElement.getContext('webgl');
        gl?.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
        gl?.clearDepth(1.0); // Clear everything
        gl?.enable(gl.DEPTH_TEST); // Enable depth testing
        gl?.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl?.enable(gl.CULL_FACE);
        gl?.cullFace(gl.BACK);


        // Clear the canvas before we start drawing on it.

        gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this.raiz.recorrerDibujar(glm.mat4.create(), this.canvasc, this.programa, camaraActiva, this.luces,1, -1);
    }

    async dibujarEscenaRapido3(){
        //await this.raiz.recorrer(glm.mat4.create());

        var camaraActiva: TNodo | null = null;

        if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
            camaraActiva = this.camaras[this.camactiva];
        }

        this.cuerpo?.rotar(glm.vec3.fromValues(this.currentAngle[0], this.currentAngle[1], 0));


        const gl = this.canvasc.nativeElement.getContext('webgl');
        gl?.clearColor(0.0, 0.0, 1.0, 1.0); // Clear to black, fully opaque
        gl?.clearDepth(1.0); // Clear everything
        gl?.enable(gl.DEPTH_TEST); // Enable depth testing
        gl?.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl?.enable(gl.CULL_FACE);
        gl?.cullFace(gl.BACK);



        gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    }

    getZoomeando(): boolean{
        return this.zoomeando;
    }

    setZoomeando(zoomeando: boolean){
        this.zoomeando = zoomeando;
    }

    getModoAnimacion(): boolean{
        return this.modoAnimacion;
    }

    setUltimoeye(eyee: glm.vec3){
        this.ultimoEye = eyee;
    }

    async dibujarEscena(){

        this.actualizarFavoritos();

        var camaraActiva: TNodo | null = null;

        if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
            camaraActiva = this.camaras[this.camactiva];
        }

        var luces: TNodo[] = this.luces;


        const shaderPrgm = await this.gestor.getRecursoShader("Programa");

        var programa;
        if(shaderPrgm instanceof TRecursoShader){
            programa = await shaderPrgm.setShader2();

            this.programa = programa;
        }else{
            console.error("No es un program shader");
        }


        //console.log("vamos a dibujar");
        //console.log("He llamado a reccorrerDIbujar");

        const gl = this.canvasc.nativeElement.getContext('webgl');
        //var ctx2 = this.canvasc.nativeElement.getContext('2d');
        //console.log(ctx2);


        //gl?.clearColor(0.0, 0.0, 0.0, 0.0); // Clear to black, fully opaque
        gl?.clearDepth(1.0); // Clear everything
        gl?.enable(gl.DEPTH_TEST); // Enable depth testing
        gl?.depthFunc(gl.LEQUAL); // Near things obscure far things
        gl?.enable(gl.CULL_FACE);
        gl?.cullFace(gl.BACK);

        const cuerpon = this.cuerpo;
        const angulos: number[] = this.currentAngle;
        const canvas1 = this.canvasc;
        const motor = this;

        var contador = 0;

        var frameAnimacion = 0;
        var animacionEmpezada = false;
        var tiempoEntreAnimaciones = 30;

        var tiempoAnterior = 0;


        this.hacerZoomInicial(glm.vec3.create(), glm.vec3.create());
/*
        var then = Date.now() * 0.001;
        var zoomTimer = 0;
        var zoomDuration = 2.5 * 10;

        var target = glm.vec3.fromValues(0, 1, 0);
        var newTarget = glm.vec3.fromValues(0, 1, 0);

        var up = glm.vec3.fromValues(0, 1, 0);


        var eye = glm.vec3.fromValues(0, 1, 30);
        //var eye = camaraActiva?.getTraslacion();






        ///////////
var halfSize = 2 * 1 * 1.5 * 0.5;



////////



            var direction2 = glm.vec3.create();
            glm.vec3.subtract(direction2, eye!, newTarget);


        var distance = halfSize / Math.tan(45 * 0.5);

        var direction5 = glm.vec3.create();
        glm.vec3.normalize(direction5, direction2);


        var direction = direction5;

        console.log(direction);
        //Si direction da Z positiva, significa que la camara este enfrente del objeto (0, 0, 1)
        //Si direction da Z negativa, significa que la camara este enfrente del objeto (0, 0, -1)


        var direction6 = glm.vec3.create();
        //glm.vec3.scale(direction6, glm.vec3.fromValues(0, 0, 1), distance);
        glm.vec3.scale(direction6, direction, distance);


        var direction7 = glm.vec3.create();
         glm.vec3.add(direction7, newTarget, direction6);

         var newEye = direction7;



         this.zoomeando = true;

        var tick = async function() {
            contador++;

        if(zoomTimer < 3 && motor.getZoomeando() == true){



            var time = Date.now() * 0.001;
            var elapsed = time - then;


            then = time;

            zoomTimer += elapsed;
            var lerp = motor.easeInOut(Math.min(1, zoomTimer / zoomDuration), 0, 1);



            var direction3 = glm.vec3.create();
            //glm.vec3.lerp(direction3, eye, newEye, lerp);
            var eyesup = twgl.v3.lerp(eye!, newEye, lerp);


           // eye = glm.vec3.fromValues(eyesup[0], eyesup[1], eyesup[2]);

           eye = glm.vec3.fromValues(eyesup[0], eyesup[1], eyesup[2]);

           motor.setUltimoeye(eye);

            //console.log("CON: EYE =  " + eye + " New");

            //eye = glm.vec3.lerp(direction2, eye, newEye, lerp);

            var direction8 = glm.vec3.create();
            glm.vec3.lerp(direction8, target, newTarget, lerp);
            target = direction8;

            var camera = glm.mat4.create();
            //glm.mat4.lookAt(camera, eye, target, up);
            twgl.m4.lookAt(eye, target, up, camera);


            //console.log(eye);
            camaraActiva?.setMatrizTransf(camera);
            //console.log(camaraActiva?.getMatrizTransf());
        }

*/
var tick = async function() {
    contador++;

            if(cuerpon != null ){

                cuerpon.setRotacion(glm.vec3.fromValues(0, angulos[1], 0));
                cuerpon.actualizaHijos();

                //camaraActiva?.setRotacion(glm.vec3.fromValues(0, angulos[1], 0))
            }else{

                console.error("No esta definido el nodo principal");
            }

            gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            //console.log("Se ha llamado a recorrer");


            /// ANIMACIONES ANIMACIONES ANIMACIONES
            if(motor.modoAnimacion == false){//no estamos en modo animacion
                await motor.raiz.recorrerDibujar(glm.mat4.create(), canvas1, programa, camaraActiva, luces, 1, -1);
            }else{

                //estamos en modo animacion
                if(animacionEmpezada == false){
                    animacionEmpezada = true;
                    camaraActiva?.setTraslacion(glm.vec3.fromValues(0, 1, 3.5))

                    tiempoAnterior = Date.now();
                }

                if((tiempoAnterior+tiempoEntreAnimaciones) < Date.now()){

                    tiempoAnterior= Date.now();
                    if(frameAnimacion == 39){
                        frameAnimacion = 0;
                    }else{
                        frameAnimacion++;
                    }
                    if(frameAnimacion == 0){
                        //console.log(frameAnimacion);
                    }
                }else{

                }

                //console.log(frameAnimacion);
                await motor.raiz.recorrerDibujar(glm.mat4.create(), canvas1, programa, camaraActiva, luces, 1, frameAnimacion);

            }

            requestAnimationFrame(tick);

         };
         tick();


    }


    easeInOut(t, start, end) {
        var c = end - start;
        if ((t /= 0.5) < 1) {
          return c / 2 * t * t + start;
        } else {
          return -c / 2 * ((--t) * (t - 2) - 1) + start;
        }
    }


    hacerZoomInicial(directionnn: glm.vec3, posicionnn: glm.vec3){
        var motor = this;
        const cuerpon = this.cuerpo;
        if(cuerpon != null ){
            this.setCurrentAngle(0, 0);


            //camaraActiva?.setRotacion(glm.vec3.fromValues(0, angulos[1], 0))
        }else{

            console.error("No esta definido el nodo principal");
        }
        function easeInOut(t, start, end) {
            var c = end - start;
            if ((t /= 1) < 1) {
              return c / 2 * t * t + start;
            } else {
              return -c / 2 * ((--t) * (t - 2) - 1) + start;
            }
        }

        var camaraActiva: TNodo | null = null;

        if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
            camaraActiva = this.camaras[this.camactiva];
        }

        //var eye = camaraActiva?.getTraslacion();

        var then = Date.now() * 0.001;
        var zoomTimer = 0;
        var zoomDuration = 0.34 * 10;

        var target = glm.vec3.fromValues(0, 1, 0);
        var newTarget = glm.vec3.fromValues(0, 0.97, -0.71);

        var up = glm.vec3.fromValues(0, 1, 0);


        var eye = glm.vec3.fromValues(0, 1, 30);
        //var eye = camaraActiva?.getTraslacion();






        ///////////
var halfSize = 2 * 1 * 1.5 * 0.5;



////////

var direction2 = glm.vec3.create();
glm.vec3.subtract(direction2, eye!, newTarget);


var distance = halfSize / Math.tan(45 * 0.5);

var direction5 = glm.vec3.create();
glm.vec3.normalize(direction5, direction2);


var direction = direction5;

//console.log(direction);
//Si direction da Z positiva, significa que la camara este enfrente del objeto (0, 0, 1)
//Si direction da Z negativa, significa que la camara este enfrente del objeto (0, 0, -1)


var direction6 = glm.vec3.create();
//glm.vec3.scale(direction6, glm.vec3.fromValues(0, 0, 1), distance);
glm.vec3.scale(direction6, direction, distance);


var direction7 = glm.vec3.create();
glm.vec3.add(direction7, newTarget, direction6);

var newEye = direction7;



this.zoomeando = true;
     var newEye = direction7;

    var tick = async function() {



            var time = Date.now() * 0.001;
            var elapsed = time - then;

            then = time;

            zoomTimer += elapsed;
            var lerp = easeInOut(Math.min(1, zoomTimer / zoomDuration), 0, 1);



            var direction3 = glm.vec3.create();
            //glm.vec3.lerp(direction3, eye, newEye, lerp);
            var eyesup = twgl.v3.lerp(eye!, newEye, lerp);


           // eye = glm.vec3.fromValues(eyesup[0], eyesup[1], eyesup[2]);

           eye = glm.vec3.fromValues(eyesup[0], eyesup[1], eyesup[2]);
           //motor.setUltimoeye(eye);

            //console.log("CON: EYE =  " + eye + " New");

            //eye = glm.vec3.lerp(direction2, eye, newEye, lerp);

            var direction8 = glm.vec3.create();
            glm.vec3.lerp(direction8, target, newTarget, lerp);
            target = direction8;

            var camera = glm.mat4.create();
            //glm.mat4.lookAt(camera, eye, target, up);
            twgl.m4.lookAt(eye, target, up, camera);

            //console.log(eye);
            camaraActiva?.setMatrizTransf(camera);
            //console.log(camaraActiva?.getMatrizTransf());
            if(zoomTimer < 2){
                requestAnimationFrame(tick);
            }else{
                motor.setZoomeando(false);
            }
    };
    tick();


    }



    hacerZoom(directionnn: glm.vec3, posicionnn: glm.vec3){
        var motor = this;
        const cuerpon = this.cuerpo;
        if(cuerpon != null ){
            this.setCurrentAngle(0, 0);


            //camaraActiva?.setRotacion(glm.vec3.fromValues(0, angulos[1], 0))
        }else{

            console.error("No esta definido el nodo principal");
        }
        function easeInOut(t, start, end) {
            var c = end - start;
            if ((t /= 1) < 1) {
              return c / 2 * t * t + start;
            } else {
              return -c / 2 * ((--t) * (t - 2) - 1) + start;
            }
        }

        var camaraActiva: TNodo | null = null;

        if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
            camaraActiva = this.camaras[this.camactiva];
        }

        var then = Date.now() * 0.001;
        var zoomTimer = 0;
        var zoomDuration = 0.16 * 10;

        var target = glm.vec3.fromValues(0, 1, 0);
        var newTarget = posicionnn;

        var up = glm.vec3.fromValues(0, 1, 0);
        //console.log(this.ultimoEye);
        //console.log(directionnn);


          var eye = this.ultimoEye;
        //var eye = camaraActiva?.getTraslacion();






        ///////////
var halfSize = 2 * 1 * 1.5 * 0.5;



////////

   // glm.vec3.scale(direction6, directionnn, distance);



        var direction2 = glm.vec3.create();
        glm.vec3.subtract(direction2, eye!, newTarget);


    var distance = halfSize / Math.tan(45 * 0.5);

    var direction5 = glm.vec3.create();
    glm.vec3.normalize(direction5, direction2);



    var direction = direction5;

    //console.log(direction);

    var direction6 = glm.vec3.create();
    glm.vec3.scale(direction6, directionnn, distance);

    var direction7 = glm.vec3.create();
     glm.vec3.add(direction7, newTarget, direction6);

     this.zoomeando = true;
     var newEye = direction7;
    var tick = async function() {



            var time = Date.now() * 0.001;
            var elapsed = time - then;



            then = time;

            zoomTimer += elapsed;
            var lerp = easeInOut(Math.min(1, zoomTimer / zoomDuration), 0, 1);



            var direction3 = glm.vec3.create();
            //glm.vec3.lerp(direction3, eye, newEye, lerp);
            var eyesup = twgl.v3.lerp(eye!, newEye, lerp);


           // eye = glm.vec3.fromValues(eyesup[0], eyesup[1], eyesup[2]);

            eye = glm.vec3.fromValues(eyesup[0] + 0.02, eyesup[1], eyesup[2]);

           //console.log(elapsed);
           motor.setUltimoeye(eye);

            //console.log("CON: EYE =  " + eye + " New");

            //eye = glm.vec3.lerp(direction2, eye, newEye, lerp);

            var direction8 = glm.vec3.create();
            glm.vec3.lerp(direction8, target, newTarget, lerp);
            target = direction8;

            var camera = glm.mat4.create();
            //glm.mat4.lookAt(camera, eye, target, up);
            twgl.m4.lookAt(eye, target, up, camera);

            //console.log(eye);
            camaraActiva?.setMatrizTransf(camera);
            //console.log(camaraActiva?.getMatrizTransf());
            if(zoomTimer < 2.2){
                requestAnimationFrame(tick);
            }else{
                motor.setZoomeando(false);
            }
    };
    tick();


    }

    activarZoom( ){
        if(this.camactiva == -1){
            console.error("Necesitas tener una camara activa!");
        }else
        {
        this.canvasc.nativeElement.addEventListener('wheel', (e) => {
            e.preventDefault();

            const [clipX, clipY] = this.getClipSpaceMousePosition(e);


            var camaraEnUso: TCamara = this.camaras[this.camactiva].entidad as TCamara;
            const projectionMatrix = camaraEnUso.getProyeccion();
            const viewMatrix = this.camaras[this.camactiva].getMatrizVist();
            const viewProjectionMat = glm.mat4.create();

            glm.mat4.multiply(viewProjectionMat, projectionMatrix, viewMatrix);



            const viewPoint = glm.vec4.fromValues(clipX, clipY, -1, 1); // Usamos -1 para z y 1 para w para obtener un punto en el plano near del espacio de vista
            var punto4: glm.vec4 = glm.vec4.create();
            glm.vec4.transformMat4(punto4, viewPoint, glm.mat4.invert(glm.mat4.create(), viewProjectionMat));


            if(this.camaras[this.camactiva].getEntidad() instanceof TCamara){
                var camara: TCamara = this.camaras[this.camactiva].entidad as TCamara;


                var deltaNuevo = 0;

                if(e.deltaY < 0){
                    deltaNuevo = -80;
                }else{
                    deltaNuevo = 80;
                }

                const newZoom = camara.getZoom() * Math.pow(2, deltaNuevo * -0.005);
                var zooom = Math.max(0.5, Math.min(2, newZoom));
                camara.setZoom(zooom);

                //console.log("EL DELTAAAA ES : " + e.deltaY);

                //console.log("EL ZOOOOOOOM ES : " + zooom);

                //updateViewProjection();
            }else{
                console.error("No es posible hacer zoom");
            }


            const projectionMatrix2 = camaraEnUso.getProyeccion();
            const viewMatrix2 = this.camaras[this.camactiva].getMatrizVist();
            const viewProjectionMat2 = glm.mat4.create();

            glm.mat4.multiply(viewProjectionMat2, projectionMatrix2, viewMatrix2);


            var puntopost4: glm.vec4 = glm.vec4.create();
            glm.vec4.transformMat4(puntopost4, viewPoint, glm.mat4.invert(glm.mat4.create(), viewProjectionMat2));



            var traslacion = glm.vec3.fromValues((punto4[0] - puntopost4[0]), (punto4[1] - puntopost4[1]), 0);

            this.camaras[this.camactiva].trasladar(traslacion);

            //this.dibujarEscenaRapido();
        });
        }
    }


    getClipSpaceMousePosition(e): [number, number]{
        const rect = this.canvasc.nativeElement.getBoundingClientRect();
        const cssX = e.clientX - rect.left;
        const cssY = e.clientY - rect.top;

        const normalizedX = cssX / this.canvasc.nativeElement.clientWidth;
        const normalizedY = cssY / this.canvasc.nativeElement.clientHeight;

        const clipX = normalizedX *  2 - 1;
        const clipY = normalizedY * -2 + 1;

        //console.log(clipX, clipY)
        return [clipX, clipY];
    }


    activarRotacion(nodoPadre:TNodo, currentAngle: number[]){
        var dragging = false;
        var lastX = -1, lastY = -1;

        const canvasElement = this.canvasc.nativeElement as HTMLCanvasElement;

        this.cuerpo = nodoPadre;

        canvasElement.onmousedown = function(ev) {
            var x = ev.clientX, y = ev.clientY;
            var rect = canvasElement.getBoundingClientRect();
            if (rect.left <= x && x < rect.right &&
                 rect.top <= y && y < rect.bottom) {
              lastX = x; lastY = y;
              dragging = true;
            }
        };
        this.canvasc.nativeElement.onmouseup = function(ev) { dragging = false;};

        const motor:TMotorTAG = this;

        this.canvasc.nativeElement.onmousemove = function(ev) {
            var x = ev.clientX, y = ev.clientY;
            if (dragging) {
              var factor = 100/canvasElement.height;
              var dx = factor * (x - lastX);
              var dy = factor * (y - lastY);
              var angulo1 = Math.max(Math.min(currentAngle[0] + dy, 90.0), -90.0);
              var angulo2 = currentAngle[1] + dx;
              motor.setCurrentAngle(angulo1, angulo2);
              //console.log(motor.getCurrentAngle());
            }
            lastX = x, lastY = y;
            //motor.dibujarEscenaRapido3();
        };

    }


    getCurrentAngle(): number[]{
        return this.currentAngle;
    }

    setCurrentAngle(current, currentt){
        this.currentAngle[0] = current;
        this.currentAngle[1] = currentt;
    }


    async activarHover2(){
        const canvas = this.canvasc.nativeElement as HTMLCanvasElement;
        const gl = this.canvasc.nativeElement.getContext('webgl');

    gl?.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl?.enable(gl.CULL_FACE);
    gl?.enable(gl.DEPTH_TEST);

    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var luces: TNodo[] = this.luces;

    var programa = this.programa;
    var camaraActiva: TNodo | null = null;

    if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
        camaraActiva = this.camaras[this.camactiva];
    }
    var motor = this;
    var canvas1 = this.canvasc;

        this.canvasc.nativeElement.addEventListener('mousemove', (e) => {

            if(motor.getModoAnimacion() == false && motor.getZoomeando()==false){
                motor.raiz.recorrerDibujar(glm.mat4.create(), canvas1, programa, camaraActiva, luces, 2, -1);
                const rect = canvas.getBoundingClientRect();
                var mouseX = e.clientX - rect.left;
                var mouseY = e.clientY - rect.top;

                const pixelX = mouseX * canvas.width / canvas.clientWidth;
                const pixelY = canvas.height - mouseY * canvas.height / canvas.clientHeight - 1;
                const data = new Uint8Array(4);
                gl?.readPixels(
                    pixelX,            // x
                    pixelY,            // y
                    1,                 // width
                    1,                 // height
                    gl.RGBA,           // format
                    gl.UNSIGNED_BYTE,  // type
                    data);             // typed array to hold result
                    //console.log(data);
                const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
                //console.log(id);

                if(id != this.hoveado && id != 0 && id != 1){
                    this.gestor.deshoveaMalla(this.hoveado)
                    this.hoveado = id;
                    this.gestor.hoveaMalla(id);
                }else if(id == 0 || id == 1){
                    this.gestor.deshoveaMalla(this.hoveado);
                    this.hoveado = 0;
                }

            }

        });

    }



    async activarClick2(){
        const canvas = this.canvasc.nativeElement as HTMLCanvasElement;
        const gl = this.canvasc.nativeElement.getContext('webgl');

    gl?.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl?.enable(gl.CULL_FACE);
    gl?.enable(gl.DEPTH_TEST);

    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var luces: TNodo[] = this.luces;

    var programa = this.programa;
    var camaraActiva: TNodo | null = null;

    if(this.camactiva>= 0 && this.camactiva<this.camaras.length){
        camaraActiva = this.camaras[this.camactiva];
    }
    var motor = this;
    var canvas1 = this.canvasc;

        this.canvasc.nativeElement.addEventListener('click', (e) => {
            if(motor.getModoAnimacion() == false && motor.getZoomeando() == false){
                motor.raiz.recorrerDibujar(glm.mat4.create(), canvas1, programa, camaraActiva, luces, 2, -1);
                const rect = canvas.getBoundingClientRect();
                var mouseX = e.clientX - rect.left;
                var mouseY = e.clientY - rect.top;

                const pixelX = mouseX * canvas.width / canvas.clientWidth;
                const pixelY = canvas.height - mouseY * canvas.height / canvas.clientHeight - 1;
                const data = new Uint8Array(4);
                gl?.readPixels(
                    pixelX,            // x
                    pixelY,            // y
                    1,                 // width
                    1,                 // height
                    gl.RGBA,           // format
                    gl.UNSIGNED_BYTE,  // type
                    data);             // typed array to hold result
                    //console.log(data);
                const id = data[0] + (data[1] << 8) + (data[2] << 16) + (data[3] << 24);
                //console.log(id);

                if(id == 0 || id == 1){
                    if(this.seleccionado != 0){
                        //this.gestor.deseleccionaMalla(this.seleccionado);
                    }
                    //this.seleccionado = 0;
                    //this.accionClick(this.seleccionado);

                }else{
                    if(this.seleccionado != 0){
                        this.gestor.deseleccionaMalla(this.seleccionado);
                    }
                    this.seleccionado = id;
                    this.accionClick(this.seleccionado);
                    this.gestor.seleccionaMalla(id);
                }
            }
        });

    }

    activarAnimacion(){
        this.modoAnimacion = true;
    }

    desactivarAnimacion(){
        this.modoAnimacion = false;
    }

    async accionClick(seleccion: number){
        //aqui Gustavo implementara toda la accion que se hace con el click
        //cada vez que se clica, se manda el identificador de donde se ha clicado
        //si se manda 0 es que no se ha clicado en ningún musculo, si se manda otra
        //es que se ha clicado en cualquier otro músculo, identificaod al crearlo
        // en test.component.ts, consultar para saber que se ha clicado (revcomendanle switch)

        //recomendaria que hicieras una clase, porque meter todo el cídigo dentro de esta clase MOTOR,
        //puede resultar demasiado engorroso, seria mejor una clase royo "control modelo" para ir abriendo divs

        switch (seleccion) {
            case 0:
                //no se hace click en un musculo, sino fuera, es decir deseleccion
                //tipico caso de cerrar div

                break;

            case 1:
                //nunca se ejecutara porque 1 es clicar en cuerpo_fondo y cuando se clica se manda 0 tambien(eliminable)

                break;

            case 2 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Abdominales");
                //await this.crearAnimacion(this.cuerpo,glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla/Sentadilla");
                //this.activarAnimacion();
                //this.activarAnimacion();
                this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 1.35, -1.8));
                break;
            case 3 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Antebrazos");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 1.25, 2.0));
                break;
            case 4 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Biceps");
                this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 1.42, -2.1));
                break;
            case 5 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Cuadriceps");
                this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 0.8, -1.91));
                break;
            case 6 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Abdominales");
                break;
            case 7 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Espalda");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 1.5, 1.8));
                break;
            case 8 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Gemelos");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 0.39, 1.8));
                break;
            case 9 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Gluteos");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 1.0, 1.9));

                break;
            case 10 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Hombros");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 1.55, 1.9));
                break;
            case 11 * 10000:
                // Se ha clicado en el músculo "Musculo1"
                this.createInfoDiv("Isquiotibiales");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 0.8, 1.8));
                break;

            case 12 * 10000:
                // Se ha clicado en el músculo "Musculo2"
                this.createInfoDiv("Oblicuos");
                //await this.crearAnimacion(this.cuerpo,glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla2/AnimacionSentadilla");
                //this.activarAnimacion();
                //this.activarAnimacion();
                this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 1.2, -2.1));
                break;

            case 13 * 10000:
                // Se ha clicado en el músculo "Musculo2"
                this.createInfoDiv("Pectorales");
                this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 1.45, -1.9));
                break;

            case 14 * 10000:
                // Se ha clicado en el músculo "Musculo2"
                this.createInfoDiv("Triceps");
                this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 1.41, 2.11));
                break;


            default:
                break;
        }
    }
// Método para cerrar el div de información
cerrarInfoDiv() {
    let infoDiv = document.getElementById("infoDiv");
    if (infoDiv) {
        // Oculta el div y limpia su contenido
        infoDiv.style.display = "none";
        infoDiv.innerHTML = '';
        this.gestor.deseleccionaMalla(this.seleccionado);
        this.seleccionado = 0;
    }
    this.actualizarFavoritos();
}

// Método para crear el div de información del músculo
 async createInfoDiv(muscleName: string) {
    await this.actualizarFavoritos();
    // Verificar si ya existe el div
    let infoDiv = document.getElementById("infoDiv");
    if (!infoDiv) {
        infoDiv = document.createElement("div");
        infoDiv.id = "infoDiv";
        infoDiv.style.backgroundColor = "white";
        infoDiv.style.position = "absolute";
        infoDiv.style.top = "100px"; // Ajustar la distancia desde la parte superior
        infoDiv.style.left = "100px"; // Ajustar la distancia desde la izquierda
        infoDiv.style.padding = "20px";
        infoDiv.style.borderRadius = "15px"; // Redondear las esquinas
        infoDiv.style.width = "430px"; // Establecer el ancho del div
        infoDiv.style.overflowX = "hidden"; // Ocultar la barra de desplazamiento horizontal

        // Establecer la posición vertical del contenido en el centro
        infoDiv.style.display = "flex";
        infoDiv.style.flexDirection = "column";
        infoDiv.style.alignItems = "center";

        // Establecer estilos específicos de la barra de desplazamiento
        infoDiv.style.overflowY = "auto"; // Solo scrollbar vertical
        infoDiv.style.maxHeight = "585px"; // Altura máxima para activar el scrollbar
        infoDiv.style.setProperty("-ms-overflow-style", "scrollbar");
        infoDiv.style.setProperty("scrollbar-width", "thin");
        infoDiv.style.setProperty("scrollbar-color", "#888 #ddd");

        // Crear el botón de cerrar
        const closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        closeButton.style.color = "#888";
        closeButton.addEventListener("click", () => {
            // Al hacer clic en la cruz, cerrar el div
            this.cerrarInfoDiv();
            this.desactivarAnimacion();
            this.actualizarFavoritos();
        });

        // Agregar el botón de cerrar al div
        infoDiv.appendChild(closeButton);

        // Agregar el título del músculo
        const muscleTitle = document.createElement("h2");
        muscleTitle.textContent = muscleName;
        muscleTitle.style.fontSize = "24px";
        muscleTitle.style.fontWeight = "bold";
        muscleTitle.style.color = "#333";
        muscleTitle.style.margin = "0"; // Eliminar el margen para evitar espacios innecesarios
        infoDiv.appendChild(muscleTitle);

        // Agregar más contenido específico del músculo si es necesario
        this.addExerciseItemsToDiv(muscleName, infoDiv).then(() => {
            document.body.appendChild(infoDiv!); // Agregar el div al cuerpo del documento
            this.setMaxHeight(this.infoDiv);

        });
    } else {
        // Si el div ya existe, simplemente actualizar su contenido y mostrarlo
        infoDiv.innerHTML = '';

        // Crear el botón de cerrar
        const closeButton = document.createElement("span");
        closeButton.textContent = "✖";
        closeButton.style.position = "absolute";
        closeButton.style.top = "10px";
        closeButton.style.right = "10px";
        closeButton.style.cursor = "pointer";
        closeButton.style.fontSize = "20px";
        closeButton.style.color = "#888";
        closeButton.addEventListener("click", () => {
            // Al hacer clic en la cruz, cerrar el div
            this.cerrarInfoDiv();
            this.desactivarAnimacion();
            this.actualizarFavoritos();
        });

        // Agregar el botón de cerrar al div
        infoDiv.appendChild(closeButton);

        // Agregar el título del músculo
        const muscleTitle = document.createElement("h2");
        muscleTitle.textContent = muscleName;
        muscleTitle.style.fontSize = "24px";
        muscleTitle.style.fontWeight = "bold";
        muscleTitle.style.color = "#333";
        muscleTitle.style.margin = "0"; // Eliminar el margen para evitar espacios innecesarios
        infoDiv.appendChild(muscleTitle);

        // Agregar más contenido específico del músculo si es necesario
        this.addExerciseItemsToDiv(muscleName, infoDiv).then(() => {
            // No es necesario volver a agregar el div al cuerpo del documento
            this.setMaxHeight(this.infoDiv);

        });

        // Mostrar el div
        infoDiv.style.display = "flex"; // Cambiar la visualización a flexbox para el centrado vertical
    }
}
setMaxHeight(infoDiv: HTMLElement) {
    const contentHeight = infoDiv.scrollHeight;
    const maxHeight = window.innerHeight - 200; // 100px de margen superior e inferior
    infoDiv.style.maxHeight = `${Math.min(contentHeight, maxHeight)}px`;
}



private async addExerciseItemsToDiv(muscleName: string, infoDiv: HTMLElement): Promise<void> {

    this.actualizarFavoritos();
    try {
        let favoritos: Exercise[] = [];
        if (localStorage.getItem('uid')) {

           await this.usuarioService.getFavoritos(localStorage.getItem('uid')).subscribe(resp => {
                if (resp) {

                this.favoritos = resp;
                favoritos = resp;
            }});

            //console.log(favResponse);
        }
        const response: any = await this.exerciseService.getItems().toPromise();
        if (response && response['ejercicios']) {
            const items = response['ejercicios'];
            if (Array.isArray(items)) {
                let lastPausedButton: HTMLElement | null = null;
                let isExpanded = false;

                const filteredItems = items.filter(item => item.musculo.toLowerCase() === muscleName.toLowerCase());

                if (filteredItems.length === 0) {
                    const noExerciseMessage = document.createElement('div');
                    noExerciseMessage.textContent = 'No hay ejercicios disponibles.';
                    noExerciseMessage.style.color = '#333';
                    noExerciseMessage.style.fontWeight = 'bold';
                    noExerciseMessage.style.marginTop = '10px';
                    infoDiv.appendChild(noExerciseMessage);
                } else {
                    filteredItems.forEach(item => {
                        const exerciseDiv = document.createElement('div');
                        exerciseDiv.classList.add('exercise-item');
                        exerciseDiv.style.backgroundColor = this.getRandomColor();
                        exerciseDiv.style.margin = '10px';
                        exerciseDiv.style.borderRadius = '10px';
                        exerciseDiv.style.padding = '10px';
                        exerciseDiv.style.display = 'flex';
                        exerciseDiv.style.alignItems = 'center';
                        exerciseDiv.style.transition = 'transform 0.3s, background-color 0.3s';
                        exerciseDiv.style.maxWidth = '400px';
                        exerciseDiv.style.width = '100%';
                        exerciseDiv.style.height = 'auto';

                        const originalColor = exerciseDiv.style.backgroundColor;

                        exerciseDiv.addEventListener('mouseenter', () => {
                            if (!exerciseDiv.classList.contains('expanded')) {
                                exerciseDiv.style.transform = 'scale(1.1)';
                            }
                        });

                        exerciseDiv.addEventListener('mouseleave', () => {
                            if (!exerciseDiv.classList.contains('expanded')) {
                                exerciseDiv.style.transform = 'scale(1)';
                            }
                        });

                        const imageElement = document.createElement('img');
                        imageElement.src = '../../../assets/uploads/foto/' + item.imagen;
                        imageElement.style.width = '100px';
                        imageElement.style.height = '100px';

                        const textContainer = document.createElement('div');
                        textContainer.style.maxWidth = 'calc(100% - 120px)';
                        textContainer.style.flex = '1';
                        textContainer.style.display = 'flex';
                        textContainer.style.flexDirection = 'column';
                        textContainer.style.marginLeft = '10px';

                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = item.titulo;
                        titleSpan.style.fontWeight = 'bold';
                        titleSpan.style.color = '#fff';
                        titleSpan.style.fontSize = '18px';
                        titleSpan.style.marginBottom = '5px';
                        titleSpan.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.5)';

                        const descriptionSpan = document.createElement('span');
                        const words = item.descripcion.split(' ');
                        const limitedDescription = words.slice(0, 5).join(' ');
                        descriptionSpan.textContent = limitedDescription + (words.length > 5 ? '...' : '');
                        descriptionSpan.style.color = '#333';

                        textContainer.appendChild(titleSpan);
                        textContainer.appendChild(descriptionSpan);

                        const playButton = document.createElement('div');
                        playButton.classList.add('play-button');
                        playButton.innerHTML = '&#9658;';
                        playButton.style.width = '30px';
                        playButton.style.height = '30px';
                        playButton.style.fontSize = '30px';
                        playButton.style.color = '#fff';
                        playButton.style.cursor = 'pointer';
                        let val = 1;

                        playButton.addEventListener('click', async () => {

                                if (lastPausedButton !== null && lastPausedButton !== playButton) {
                                    lastPausedButton.innerHTML = '&#9658;';
                                }

                                if (val === 1) {
                                        playButton.innerHTML = '&#10074;&#10074;';
                                        lastPausedButton = playButton;
                                        val = 0;
                                        console.log(item.titulo);
                                        console.log(muscleName);
                                        if(item.titulo.toLowerCase() === "pectorales ejercicio"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla2/AnimacionSentadilla");
                                            this.activarAnimacion();
                                        }
                                        else if(item.titulo.toLowerCase() === "ii ji ikjj ml ml k nk l"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/zancada/AnimacionZancada");
                                            this.activarAnimacion();
                                        }
                                        else if(item.titulo.toLowerCase() === "dfsdf sfdf sdf s f"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/pistol/AnimacionPistol");
                                            this.activarAnimacion();
                                        }
                                        else if(item.titulo.toLowerCase() === "sentadillas"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla2/AnimacionSentadilla");
                                            this.activarAnimacion();
                                        }
                                        else if(item.titulo.toLowerCase() === "zancadas"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/zancada/AnimacionZancada");
                                            this.activarAnimacion();
                                        }
                                        else if(item.titulo.toLowerCase() === "pistol squat"){
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/pistol/AnimacionPistol");
                                            this.activarAnimacion();
                                        }
                                        else{
                                            await this.crearAnimacion(this.cuerpo, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla2/AnimacionSentadilla");
                                            this.activarAnimacion();
                                        }
                                } else {
                                    playButton.innerHTML = '&#9658;';
                                    lastPausedButton = null;
                                    val = 1;
                                    this.desactivarAnimacion();
                                }

                        });

                        if (localStorage.getItem('token')) {
                            const starButton = document.createElement('div');
                            starButton.classList.add('star-button');
                            starButton.style.width = '30px';
                            starButton.style.height = '30px';
                            starButton.style.fontSize = '30px';
                            starButton.style.color = '#fff';
                            starButton.style.cursor = 'pointer';
                            starButton.style.marginTop = '10px';

                            let isFavorited = false;
                            //this.actualizarFavoritos();
                            for (let i = 0; i < this.favoritos.length; i++) {
                                if (this.favoritos[i].titulo === item.titulo) {
                                    isFavorited = true;
                                    starButton.innerHTML = '&#9733;';
                                     // Salimos del bucle tan pronto encontramos el ítem
                                }
                                else{
                                    starButton.innerHTML = '&#9734;';

                                }
                            }
                            starButton.innerHTML = isFavorited ? '&#9733;' : '&#9734;';


                            starButton.addEventListener('click', async () => {
                                if (localStorage.getItem('token')) {
                                    try {
                                        const selectedExercise = item;
                                        if (selectedExercise.titulo) {
                                            console.log('Ejercicio seleccionado:', selectedExercise);
                                            //this.actualizarFavoritos();
                                            if (isFavorited) {
                                                // Desmarcar como favorito
                                                //favoritos = favoritos.filter(fav => fav.titulo !== item.titulo);

                                                    for(let i = 0; i < this.favoritos.length; i++){
                                                        if(this.favoritos[i].titulo == item.titulo){
                                                            this.favoritos.splice(i, 1);
                                                            this.nuevoFav.favoritos = this.favoritos;
                                                            this.usuarioService.putFavoritos(this.nuevoFav, localStorage.getItem('uid')).subscribe(resp => { console.log("AQUI"); console.log(resp); });
                                                            //this.actualizarFavoritos();
                                                        }

                                                    }
                                                    this.actualizarFavoritos();
                                                    isFavorited = false;

                                                //starButton.innerHTML = '&#9733;';
                                            } else {
                                                favoritos.push(item);
                                                this.usuarioService.getFavoritos(localStorage.getItem('uid')).subscribe(
                                                    resp => {
                                                        if (resp) {
                                                            let num = 0;
                                                            for(let i = 0; i < resp.length -1; i++){

                                                                if(resp[i].titulo == item.titulo){
                                                                    num++;
                                                                }
                                                            }
                                                            if(num == 0){
                                                                this.exercises = resp;
                                                                this.nuevoFav.favoritos = this.exercises;
                                                                this.ejsPrueba1.push(item);
                                                                delete this.ejsPrueba1[0]._id;
                                                                this.exercises.push(this.ejsPrueba1[0]);
                                                                this.nuevoFav.favoritos = this.exercises;
                                                                this.usuarioService.putFavoritos(this.nuevoFav, localStorage.getItem('uid')).subscribe(resp => { console.log(resp); });
                                                                this.actualizarFavoritos();
                                                                this.ejsPrueba1.splice(0, 1);
                                                            }
                                                        }
                                                    });
                                                    this.actualizarFavoritos();
                                                    isFavorited = true;
                                                    //starButton.innerHTML = '&#9734;';
                                            }
                                            // Actualizar el estado de favorito
                                            //isFavorited = !isFavorited;
                                            // Actualizar el botón de estrella
                                            starButton.innerHTML = isFavorited ? '&#9733;' : '&#9734;';

                                        } else {
                                            console.error('El ejercicio seleccionado no tiene un título válido');
                                        }
                                    } catch (error) {
                                        console.error('Error al guardar el ejercicio como favorito:', error);
                                    }
                                } else {
                                    console.log('Debes iniciar sesión para guardar ejercicios como favoritos');
                                }
                            });
                            starButton.innerHTML = isFavorited ? '&#9733;' : '&#9734;';

                            exerciseDiv.appendChild(starButton);
                        }


                        exerciseDiv.appendChild(imageElement);
                        exerciseDiv.appendChild(textContainer);
                        exerciseDiv.appendChild(playButton);

                        infoDiv.appendChild(exerciseDiv);

                        exerciseDiv.addEventListener('click', (event) => {
                            // Evitar que el clic en el enlace del video se propague
                            if ((event.target as HTMLElement).tagName === 'A') {
                                return;
                            }
                            const expandedItems = infoDiv.querySelectorAll('.exercise-item.expanded');
                            if (exerciseDiv.classList.contains('expanded')) {
                                exerciseDiv.classList.remove('expanded');
                                exerciseDiv.style.height = 'auto';
                                exerciseDiv.style.marginTop = '10px';
                                descriptionSpan.textContent = limitedDescription + (words.length > 5 ? '...' : '');
                                const videoLink = exerciseDiv.querySelector('.video-link') as HTMLElement;
                                if (videoLink) {
                                    videoLink.remove();
                                }
                            } else {
                                expandedItems.forEach(expandedItem => {
                                    if (expandedItem instanceof HTMLElement) {
                                        expandedItem.classList.remove('expanded');
                                        expandedItem.style.height = 'auto';
                                        expandedItem.style.marginTop = '10px';
                                        const expandedDescriptionSpan = expandedItem.querySelector('.description') as HTMLElement;
                                        if (expandedDescriptionSpan) {
                                            const expandedWords = expandedDescriptionSpan.textContent!.split(' ');
                                            const expandedLimitedDescription = expandedWords.slice(0, 5).join(' ');
                                            expandedDescriptionSpan.textContent = expandedLimitedDescription + (expandedWords.length > 5 ? '...' : '');
                                        }
                                        /*const expandedVideoLink = expandedItem.querySelector('.video-link') as HTMLElement;
                                        if (expandedVideoLink) {
                                            expandedVideoLink.remove();
                                        }*/
                                    }
                                });
                                exerciseDiv.classList.add('expanded');
                                exerciseDiv.style.height = 'auto';
                                exerciseDiv.style.marginTop = '15px';
                                exerciseDiv.style.marginBottom = '15px';
                                isExpanded = true;
                                descriptionSpan.textContent = item.descripcion;
                                const videoId = this.getYouTubeVideoId(item.video);
                                if (videoId) {
                                    const videoLink = document.createElement('a');
                                    videoLink.href = item.video;
                                    videoLink.target = '_blank';
                                    videoLink.classList.add('video-link');
                                    videoLink.style.borderRadius = '10px';
                                    videoLink.style.overflow = 'hidden';
                                    videoLink.style.marginTop = '20px';
                                    const videoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                    videoLink.innerHTML = `<img src="${videoThumbnailUrl}" style="width: 100%; height: auto;">`;
                                    textContainer.appendChild(videoLink);
                                }
                            }
                        });
                    });
                }
            } else {
                console.error('La propiedad "ejercicios" en la respuesta no es un array:', items);
            }
        } else {
            console.error('La respuesta no tiene la propiedad "ejercicios" o es null/undefined:', response);
        }
    } catch (error) {
        console.error('Error al obtener los elementos:', error);
    }
}

    async actualizarFavoritos(){

        console.log('Actualizamos');
        this.favoritos = [];
        if(localStorage.getItem('uid')){

          await this.usuarioService.getFavoritos(localStorage.getItem('uid')).subscribe(resp => {
            this.favoritos = resp;
        });

        }
    }



    // Función para extraer el ID del video de YouTube desde el enlace
    private getYouTubeVideoId(url: string): string | null {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    }

    private getRandomColor(): string {
        const colors = ['#2d98c2', '#59bbe0 ', '#548ea4', '#4e7fe5', '#95b4f5', '#2e4e8f', '#3d7af8', '#59509a', '#9de0fa', '#b8e6f8', '#1bb4ef', '#755dcf'];
        const randomIndex = Math.floor(Math.random() * colors.length);
        return colors[randomIndex];
    }


    private createControlsDiv(): void {
        // Obtener el div de controles si ya existe
        let controlsDiv = document.getElementById('controlsDiv');

        // Si el div de controles ya existe, eliminarlo
        if (controlsDiv) {
            controlsDiv.remove();
        }

        // Crear el nuevo div de controles
        controlsDiv = document.createElement('div');
        controlsDiv.id = 'controlsDiv';
        controlsDiv.style.position = 'absolute';
        controlsDiv.style.right = '50%'; // Posiciona el div en el centro horizontalmente
        controlsDiv.style.transform = 'translateX(50%)'; // Ajusta la posición para mantenerlo centrado
        controlsDiv.style.bottom = '1px';
        controlsDiv.style.padding = '1px';
        controlsDiv.style.backgroundColor = '#FFFFFF';
        controlsDiv.style.borderRadius = '5px';
        controlsDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        controlsDiv.style.transition = 'width 0.3s, height 0.3s, transform 0.3s'; // Añade transform a la transición
        controlsDiv.style.width = '300px';
        controlsDiv.style.height = '90px';
        controlsDiv.style.display = 'flex'; // Cambia a flexbox
        controlsDiv.style.flexDirection = 'column'; // Cambia la dirección de los elementos a columna
        controlsDiv.style.alignItems = 'center'; // Centra horizontalmente los elementos

        // Guardar las propiedades originales del controlsDiv
        controlsDiv['originalWidth'] = controlsDiv.style.width;
        controlsDiv['originalHeight'] = controlsDiv.style.height;
        controlsDiv['originalTransform'] = controlsDiv.style.transform;

        // Crear el botón de alternancia (toggleButton)
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '-------'; // Texto que simula una barra lateral
        toggleButton.style.width = 'auto'; // Ancho automático para que se ajuste al texto
        toggleButton.style.padding = '1px'; // Padding similar al del botón de cambio de tamaño
        toggleButton.style.borderRadius = '0'; // Elimina el borde redondeado
        toggleButton.style.border = 'none'; // Elimina el borde
        toggleButton.style.backgroundColor = 'transparent'; // Fondo transparente
        toggleButton.style.color = '#3498db'; // Color del texto
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.textShadow = '1px 1px 2px rgba(0, 0, 0, 0.3)';
        controlsDiv.appendChild(toggleButton); // Agrega el toggleButton al principio del div

        // Crear un contenedor para los botones de acción
        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.style.display = 'flex'; // Cambia a flexbox
        actionButtonsContainer.style.justifyContent = 'center'; // Centra los botones horizontalmente

        // Crear los botones con diferentes iconos
        const buttonsData = [
            { icon: 'assets/images/background/frente.jpg', action: () => this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 0.85, -0.55)), backgroundColor: '#269DBD' },
            { icon: 'assets/images/background/espalda.jpg', action: () =>  this.hacerZoom(glm.vec3.fromValues(0,0,-1), glm.vec3.fromValues(0, 0.85, 0.55)), backgroundColor: '#AED6F1'},
            { icon: 'assets/images/background/pehco.jpg', action: () => this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 1.35, -1.8)), backgroundColor: '#F9E79F'},
            { icon: 'assets/images/background/piernas.jpg', action: () => this.hacerZoom(glm.vec3.fromValues(0,0,1), glm.vec3.fromValues(0, 0.6, -1.65)), backgroundColor: '#F5CBA7'}
        ];


        // Definir una función para restaurar las propiedades originales de los botones
        const restoreButtonProperties = (button: HTMLElement) => {
            button.style.margin = '5px';
            button.style.display = 'flex';
            button.style.left = 'auto'; // Restaurar la propiedad left
            button.style.padding = '5px'; // Elimina el padding
            button.style.borderRadius = '5px'; // Restaurar el borde redondeado
        };

        buttonsData.forEach(buttonData => {
            const button = document.createElement('button');
            const icon = document.createElement('img');
            icon.src = buttonData.icon;
            icon.width = 40; // Ajusta el ancho de la imagen del icono
            icon.height = 40; // Ajusta la altura de la imagen del icono
            icon.style.objectFit = 'cover'; // Ajusta el tamaño del icono dentro del contenedor
            button.appendChild(icon); // Agrega la imagen del icono al botón

            // Estilos para el botón
            button.style.width = '50px'; // Tamaño fijo para los botones de acción
            button.style.height = '50px'; // Tamaño fijo para los botones de acción
            button.style.padding = '0'; // Elimina el padding
            button.style.borderRadius = '5px';
            button.style.border = 'none';
            button.style.cursor = 'pointer';
            button.style.margin = '5px'; // Margen para separar los botones
            button.style.backgroundColor = buttonData.backgroundColor || 'transparent'; // Establece el color de fondo del botón

            // Guardar las propiedades originales del botón
            button['originalMargin'] = button.style.margin;
            button['originalDisplay'] = button.style.display;
            button['originalLeft'] = button.style.left;
            button['originalPadding'] = button.style.padding;
            button['originalBorderRadius'] = button.style.borderRadius;

            // Agregar evento de clic al botón
            button.addEventListener('click', buttonData.action); // Llama a la función de acción correspondiente

            // Agregar el botón al contenedor de botones de acción
            actionButtonsContainer.appendChild(button);
        });




        // Agregar el contenedor de botones de acción al div de controles
        controlsDiv.appendChild(actionButtonsContainer);

        // Función para alternar la visibilidad de los botones de zoom
        const toggleZoomButtons = () => {
            actionButtonsContainer.childNodes.forEach(child => {
                if (child instanceof HTMLElement) {
                    child.style.display = child.style.display === 'none' ? 'flex' : 'none';
                }
            });
        };

        // Función para alternar la visibilidad y tamaño del div de controles
        const toggleControls = () => {
            toggleZoomButtons(); // Ocultar o mostrar los botones de zoom
            if (toggleButton && controlsDiv) {
                toggleButton.textContent = toggleButton.textContent === '-------' ? '-------' : '-------'; // Cambiar el texto del botón de alternancia
                controlsDiv.style.width = controlsDiv.style.width === '300px' ? '100px' : '300px'; // Cambiar el ancho del div
                controlsDiv.style.height = controlsDiv.style.height === '90px' ? '23px' : '90px'; // Cambiar el alto del div

                // Ajustar la posición del controlsDiv cuando se cambia el tamaño
                controlsDiv.style.transform = controlsDiv.style.width === '200px' ? 'translateX(0)' : 'translateX(50%)';

                // Restaurar las propiedades originales de los elementos hijos del controlsDiv
                if (controlsDiv.style.width === '300px') {
                    actionButtonsContainer.childNodes.forEach(child => {
                        if (child instanceof HTMLElement) {
                            restoreButtonProperties(child);
                        }
                    });
                }
            }
        };

        //toggleZoomButtons();
        toggleControls();


        // Agregar evento de clic al botón de alternancia
        toggleButton.addEventListener('click', toggleControls);

        // Agregar el div de controles al contenedor principal si existe
        const controlsContainer = document.getElementById('controlsContainer');
        if (controlsContainer && controlsDiv) {
            controlsContainer.appendChild(controlsDiv);
        } else {
            console.error('No se pudo encontrar el contenedor de controles o el div de controles.');
        }


    }

    /*private resetModelPosition(): void {
        if (!modelo) {
            console.error("¡El modelo no está definido!");
            return;
        }

        console.log('Hay modelo');

        const initialModelPosition = { x: 0, y: 0, z: 0 }; // Posición inicial del modelo
        const targetModelPosition = { x: 0, y: 0, z: -1 }; // Posición final del modelo (moverlo hacia atrás)

        const animationFrames = 200; // Número de fotogramas de animación
        let frameCount = 0;

        // Función de animación que se llama en cada fotograma
        const animateModel = () => {
            frameCount++;

            // Calcular la nueva posición del modelo interpolando entre la posición inicial y final
            const newPosition = {
                x: initialModelPosition.x + (targetModelPosition.x - initialModelPosition.x) * (frameCount / animationFrames),
                y: initialModelPosition.y + (targetModelPosition.y - initialModelPosition.y) * (frameCount / animationFrames),
                z: initialModelPosition.z + (targetModelPosition.z - initialModelPosition.z) * (frameCount / animationFrames)
            };

            // Actualizar la posición del modelo
            modelo.setPosition(newPosition); // Actualiza la posición del modelo

            // Si aún no se ha alcanzado el número total de fotogramas, continuar la animación
            if (frameCount < animationFrames) {
                setTimeout(animateModel, 1000 / 60); // Llama a la función con un intervalo de tiempo equivalente a 60 fps
            }
        };

        // Iniciar la animación
        animateModel();
    }*/





    /////////////////////////////////////////////////////////////////////////////

    activarClick(){
        const canvas = this.canvasc.nativeElement as HTMLCanvasElement;
        const gl = this.canvasc.nativeElement.getContext('webgl');

        this.canvasc.nativeElement.onmouseup = function(ev) {
            var x = ev.clientX, y = ev.clientY;
            var rect = canvas.getBoundingClientRect();
            if (rect.left <= x && x < rect.right && rect.top <= y && y < rect.bottom) {
               var x_in_canvas = x - rect.left
               var y_in_canvas = rect.bottom - y;


               gl?.viewport(0, 0, canvas.width, canvas.height);

               // Limpiar el búfer de color antes de leer los píxeles
               gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

               var pixels = new Uint8Array(4);
                gl?.readPixels(x_in_canvas, y_in_canvas, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            }
        };
    }


    createColor(id): Float32Array {
        var r, g, b, a;
        var gl = this.canvasc.nativeElement.getContext("webgl");

        var red_bits   = gl?.getParameter(gl.RED_BITS);
        var green_bits = gl?.getParameter(gl.GREEN_BITS);
        var blue_bits  = gl?.getParameter(gl.BLUE_BITS);
        var alpha_bits = gl?.getParameter(gl.ALPHA_BITS);

        r = Math.floor(id / Math.pow(2,green_bits+blue_bits+alpha_bits));
        id = id - (r * Math.pow(2,green_bits+blue_bits+alpha_bits));

        g = Math.floor(id / Math.pow(2,blue_bits+alpha_bits));
        id = id - (g * Math.pow(2,blue_bits+alpha_bits));

        b = Math.floor(id / Math.pow(2,alpha_bits));
        id = id - (b * Math.pow(2,alpha_bits));

        a = id;

        return new Float32Array([ r/(Math.pow(2,red_bits)-1),
                                  g/(Math.pow(2,green_bits)-1),
                                  b/(Math.pow(2,blue_bits)-1),
                                  a/(Math.pow(2,alpha_bits)-1) ] );
      };

    crearIndices(id){
        //this.gestor.
        //console.log(((id >>  0) & 0xFF) / 0xFF);
    }


    setLuzActiva(nLuz: number, activa: boolean){
        this.lucesactivas[nLuz] = activa;

        //this.actualizarluz = true;
    }

    setCamaraActiva(nCamara: number){
        this.camactiva = nCamara;
        //this.actualizarcamara = true;
    }

    registrarLuz(nLuz: TNodo): number{
        this.luces.push(nLuz);
        return this.luces.indexOf(nLuz);
    }

    registrarCamara(nCam): number{
        this.camaras.push(nCam);

        return this.camaras.indexOf(nCam);
    }

}
