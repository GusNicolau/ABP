import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AfterViewInit } from '@angular/core';

import { TNodo } from '../../motor/arbol/TNodo';
import { TEntidad } from '../../motor/arbol/TEntidad';
import { TCamara } from '../../motor/arbol/TCamara';
import { TLuz } from '../../motor/arbol/TLuz';
import { TModelo } from '../../motor/arbol/TModelo';
import { TRecursoMaterial } from '../../motor/gestor/TRecursoMaterial';
import { TRecurso } from '../../motor/gestor/TRecurso';
import { TRecursoMalla } from '../../motor/gestor/TRecursoMalla';
import { TRecursoShader } from '../../motor/gestor/TRecursoShader';
import { TRecursoTextura } from '../../motor/gestor/TRecursoTextura';

import { TMotorTAG} from '../../motor/TMotorTAG';


import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


import * as glm from 'gl-matrix';
import { TGestorRecurso } from 'src/app/motor/gestor/TGestorRecurso';
import { ExerciceService } from 'src/app/services/exercice.service';
import { UsuarioService } from '../../services/usuario.service';


declare function iniciarCustom();

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [ExerciceService] // Agrega ExerciceService como un proveedor

})
export class TestComponent implements OnInit {

  @ViewChild('rendererCanvas', {static: true}) public rendererCanvas !: ElementRef<HTMLCanvasElement>;


  constructor(private http: HttpClient, private exerciceService: ExerciceService, private usuarioService: UsuarioService) { }
    
  

  async ngOnInit(): Promise<void> {
    iniciarCustom();

    const canvas = this.rendererCanvas;
    const gesto = new TGestorRecurso(this.http, canvas);
    const recmalla = await gesto.getRecursoMalla("modelosPruebas/boxito.json", 13);



    /*-------------------------------------------------------------------------------------------------*/
    /*---------------------------------------- PRUEBAS TNodo ------------------------------------------*/
    /*-------------------------------------------------------------------------------------------------*/

    //************ Creacion, añadir y eliminar hijos e padre, añadir y eliminar entidades ************//
    const objeto1: TNodo = new TNodo("adios");
    const objeto2: TNodo = new TNodo("hei");
    const objeto3: TNodo = new TNodo("nada");
    const objeto4: TNodo = new TNodo("va");

    objeto1.addHijo(objeto2);
    objeto1.addHijo(objeto3);
    objeto1.addHijo(objeto4);

    objeto1.remHijo(objeto2);

    //console.log(objeto1);

    objeto1.getHijos().forEach(element => {
        //console.log(element.getPadre()?.getNombre());
    });

    const luz: TLuz = new TLuz(glm.vec3.fromValues(1,1,1), glm.vec3.fromValues(1,1,1));
    const camara: TCamara = new TCamara(false, 45,  1, 1, 1, 1, 1, 1);

    objeto3.setEntidad(luz);
    objeto4.setEntidad(camara);
    //console.log(objeto3.getEntidad());
    //console.log(objeto4.getEntidad());
    
    //arbol completo
    //----Crear la estructura del árbol ---
    const nEscena = new TNodo("escena"); 
    const nLuz= new TNodo("luz");
    const nCam= new TNodo("camara");
    const nGrupoCoche= new TNodo("grupoCoche");
    const nChasis= new TNodo("chasis");
    const nRueda1 = new TNodo("rueda1");
    const nRueda2 = new TNodo("rueda2");
    const nRueda3 = new TNodo("rueda3");
    const nRueda4 = new TNodo("rueda4");
    nEscena.addHijo(nLuz);
    nEscena.addHijo(nCam); 
    nEscena.addHijo(nGrupoCoche);
    nGrupoCoche.addHijo(nChasis);
    nGrupoCoche.addHijo(nRueda1);
    nGrupoCoche.addHijo(nRueda2);
    nGrupoCoche.addHijo(nRueda3);
    nGrupoCoche.addHijo(nRueda4); 
    //----Añadir entidades a los nodos ---
    const eLuz = new TLuz(glm.vec3.fromValues(1,1,1), glm.vec3.fromValues(1,1,1));
    const eCam = new TCamara(false, 45, 1, 1, 1, 1, 1, 1);

    var eMallaChasis: TModelo;
    var eMallaRueda1: TModelo;
    var eMallaRueda2: TModelo;
    var eMallaRueda3: TModelo;
    var eMallaRueda4: TModelo;
    if(recmalla instanceof TRecursoMalla){
      eMallaChasis= new TModelo(recmalla);
      eMallaRueda1 = new TModelo(recmalla);
      eMallaRueda2 = new TModelo(recmalla);
      eMallaRueda3 = new TModelo(recmalla);
      eMallaRueda4 = new TModelo(recmalla);

      nChasis.setEntidad(eMallaChasis);
      nRueda1.setEntidad(eMallaRueda1);
      nRueda2.setEntidad(eMallaRueda2);
      nRueda3.setEntidad(eMallaRueda3);
      nRueda4.setEntidad(eMallaRueda4);
    }
    nLuz.setEntidad(eLuz);
    nCam.setEntidad(eCam);

    //const intervalId = setInterval(mostrarNodo, 1);

    //----Aplicar transformaciones a los nodos ---
    nLuz.setTraslacion(glm.vec3.fromValues(0, 100, 0));
    nCam.setRotacion(glm.vec3.fromValues(80, 0, 0));
    //nCam.trasladar(glm.vec3.fromValues(0, 0, 200));
    nChasis.setRotacion(glm.vec3.fromValues(60,0,0));
    nGrupoCoche.setEscalado(glm.vec3.fromValues(2, 2, 2));
    //---Recorrer el árbol(dibujarlo) ---
    nEscena.recorrer(glm.mat4.create());
    //setTimeout(imprimirNodo, 2000);

    //console.log("VEMOS LAS DIFERENTES MATRICES DE TRANSFORMACIÓN");
    //nGrupoCoche.imprimirMatriz();
    //console.log(nLuz.getMatrizTransf());




    //************ Rotaciones, escalados, traslaciones y matrices usadas ************//
    const nodo = new TNodo("nEscena"); 
    const ncamara = new TNodo("nCamara");
    const nmodelo = new TNodo("nModelo");
    nodo.addHijo(ncamara);
    nodo.addHijo(nmodelo);

    const eCamara = new TCamara(true, 45, -1, 1, -1, 1, 0.1, 100.0);
    

    var eMalla: TModelo;

    if(recmalla instanceof TRecursoMalla){
      eMalla = new TModelo(recmalla);
      nmodelo.setEntidad(eMalla);

    }

    ncamara.setEntidad(eCamara);

    //nodo.setRotacion(glm.vec3.fromValues(45, 0, 0));
    const matriz = nodo.getMatrizTransf();

    //console.log("Vemos la matriz de rotación");
    //console.log(matriz);

    const vrot = glm.vec3.fromValues(180, 0, 0);
    const miden = glm.mat4.create();
    //console.log(nodo.rotate(vrot, miden));

    //operaciones varias sobre una matriz de un node
   /* const nodom = new TNodo("nodom"); 
    nodom.rotar(glm.vec3.fromValues(45, 90, 30));
    nodom.imprimirMatriz(nodom.getMatrizTransf());
    console.log("--------------------------------------------------------");
    nodom.escalar(glm.vec3.fromValues(2.5, 1, 0.8));
    nodom.imprimirMatriz(nodom.getMatrizTransf());
    console.log("--------------------------------------------------------");
    nodom.trasladar(glm.vec3.fromValues(20, 67, 0));
    nodom.imprimirMatriz(nodom.getMatrizTransf());
    */

    /*-------------------------------------------------------------------------------------------------*/
    /*---------------------------------------- WEBGL PRUEBAS ------------------------------------------*/
    /*-------------------------------------------------------------------------------------------------*/
    /*
    const canva = this.rendererCanvas.nativeElement;
    const gl = canva.getContext('webgl');
    //gl?.clearColor(1, 0, 0, 1);
    //gl?.clear(gl.COLOR_BUFFER_BIT);

    gl?.enable(gl.DEPTH_TEST); // Habilitar prueba de profundidad
    gl?.depthFunc(gl.LEQUAL); // Objetos cercanos opacan objetos lejanos
    gl?.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Limpiar el buffer de color asi como el de profundidad
  

    const gestor = new TGestorRecurso(this.http, this.rendererCanvas);
    //gestor.getRecursoShader("Programa"); 
    //gestor.getRecursoShader("Programa"); 
    const rshader = gestor.getRecursoShader("Programa");

    const rmalla = await gestor.getRecursoMalla("malla.json");


    await gestor.hacerShader();

    

    if(rmalla instanceof TRecursoMalla){
      rmalla.setMnodo(nmodelo);
    }
    if(rmalla instanceof TRecursoMalla){
      ncamara.setRotacion(glm.vec3.fromValues(0, 0, 0));
      ncamara.setTraslacion(glm.vec3.fromValues(-1, 0, 2));
      ncamara.setActualizarMatriz(true);

      rmalla.setCnodo(ncamara);
    }
    if(rmalla instanceof TRecursoMalla){
      rmalla.setEcamara(eCamara);
    }

    nmodelo.setRotacion(glm.vec3.fromValues(0,0,90));
    nmodelo.setRotacion(glm.vec3.fromValues(0,0,45));
    nmodelo.rotar(glm.vec3.fromValues(0,0,45));

    nodo.recorrer(glm.mat4.create());
    

    console.log(rmalla);
    
    
    //const recurso = await gestor.getRecursoShader("Programa");

    await gestor.dibujarMalla();

    */
    /*------------------------------------------------------------------------------------------------*/
    /*---------------------------------------- Interfaz / API ----------------------------------------*/
    /*------------------------------------------------------------------------------------------------*/
    
    const canva = this.rendererCanvas.nativeElement;
    const gl = canva.getContext('webgl');
    //gl?.clearColor(1, 0, 0, 1);
    //gl?.clear(gl.COLOR_BUFFER_BIT);

    
    const MotorTAG: TMotorTAG = new TMotorTAG(this.http, this.rendererCanvas, this.exerciceService, this.usuarioService);

    //creamos cámara y luz como hijos de la raíz

    const camp: TNodo = MotorTAG.crearCamara(null, glm.vec3.fromValues(0,1,1.2), glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(1,1,1), true, 45, 0, canva.width, 0, canva.height, 0.1, 100.0);
    var nmCamara = MotorTAG.registrarCamara(camp);
    MotorTAG.setCamaraActiva(nmCamara);

    const luzp: TNodo = MotorTAG.crearLuz(null, glm.vec3.fromValues(-1.2, 2.0, 3.6), glm.vec3.fromValues(20,0,0), glm.vec3.fromValues(1,1,1), glm.vec3.fromValues(0.71,0.71,0.71), glm.vec3.fromValues(1, 1, 0));
    var nmLuz = MotorTAG.registrarLuz(luzp);
    MotorTAG.setLuzActiva(nmLuz, true);

    const luzs: TNodo = MotorTAG.crearLuz(null, glm.vec3.fromValues(1.2, 2.0, -3.6), glm.vec3.fromValues(20,0,0), glm.vec3.fromValues(1,1,1), glm.vec3.fromValues(0.71,0.71,0.71), glm.vec3.fromValues(1, 1, 0));
    var nmLuz = MotorTAG.registrarLuz(luzp);
    MotorTAG.setLuzActiva(nmLuz, true);
    //crear nodo intermedio, y dos nodos hijos con mallas



    const cuerpo: TNodo = await MotorTAG.crearNodo(null, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1));
    //const box: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(1, 3.5, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(0.4,0.4,0.4), "modelosPruebas/ef_box.obj", 2);
    //MotorTAG.crearMaterial(box, "materiales/cubo_texturizado.mtl")
   //MotorTAG.crearTextura(box, "asdasdasas");

    const humano: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/CuerpoCorrectoBuenos.obj", 1);
   // const humano: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla/AnimacionNew1.obj", 1);

    cuerpo.setNombre("CUERPOOOO");
    const ehumano= humano.getEntidad();
    if(ehumano instanceof TModelo){
      ehumano.getRecursoMalla()?.mallas.forEach(element => {
        element.setColor(MotorTAG.calcularCoeficientesUniforme(glm.vec3.fromValues(220,192,172)));
      });
    }



    //const box: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(1, 3.5, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(0.4,0.4,0.4), "cuerpoCompleto/Cuerpo_base.json");
    const Abdominales: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Abdominales.obj", 2 * 10000);
    const Antebrazos: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Antebrazos.obj", 3 * 10000);
    const Biceps: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Biceps.obj", 4 * 10000);
    const Cuadriceps: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Cuadriceps.obj", 5 * 10000);
    //const CuerpoSin2: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/CuerpoSin2.obj", 6);
    const Espalda: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Espalda.obj", 7 * 10000);
    const Gemelos: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Gemelos.obj", 8 * 10000);
    const Gluteos: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Gluteos.obj", 9 * 10000);
    const Hombros: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Hombros.obj", 10 * 10000);
    const Isquiotibiables: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Isquiotables.obj", 11 * 10000);
    const Oblicuos: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Oblicuos.obj", 12 * 10000);
    const Pectorales: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Pectoral.obj", 13 * 10000);
    const Triceps: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "cuerpoCompletoObj/Triceps.obj", 14 * 10000);

/*
    const box: TNodo = await MotorTAG.crearModelo(cuerpo , glm.vec3.fromValues(1, 3.5, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(0.4,0.4,0.4), "modelosPruebas/boxito.json");
*/
    //const mallap: TNodo = await MotorTAG.crearModelo(null, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(90,0,0), glm.vec3.fromValues(1,1,1), "esferas.JD");
    //const mallap2: TNodo = await MotorTAG.crearModelo(null, glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(30,0,0), glm.vec3.fromValues(1,1,1), "monigote.json");

    MotorTAG.activarRotacion(cuerpo, MotorTAG.getCurrentAngle());
   MotorTAG.activarZoom();

   //console.log(MotorTAG.createColor(2));
    await MotorTAG.dibujarEscena();

    await MotorTAG.activarClick2();
    MotorTAG.crearIndices(256);

    //await MotorTAG.crearAnimacion(cuerpo,glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/fondos/AnimacionNew");
    //await MotorTAG.crearAnimacion(cuerpo,glm.vec3.fromValues(0, 0, 0), glm.vec3.fromValues(0,0,0), glm.vec3.fromValues(1,1,1), "animaciones/sentadilla/Sentadilla");

    //MotorTAG.activarAnimacion();

    //await MotorTAG.dibujarEscena();

    //console.log(MotorTAG.calcularCoeficientesUniforme(glm.vec3.fromValues(34, 0, 255)));

    await MotorTAG.activarHover2();
  
    


    
    //-------------//

    function imprimirNodo() {
      console.log('Han pasado 200 milisegundos');
      console.log("MOSTRAMOS LA MATRIZ DE ESCENA");
      console.log(nLuz.getTraslacion());
      //nEscena.imprimirMatriz(nLuz.getMatrizTransf());

    } 

    function mostrarNodo(){
      console.log("******************************Mostramos el nodo****************************");
      nLuz.imprimirMatriz();
      console.log("****************************************************************************");

    }
  }

  ngAfterViewInit() {
    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    const canvas = this.rendererCanvas.nativeElement;
    canvas.width = window.innerWidth; // Ancho igual al ancho de la ventana
    canvas.height = window.innerHeight; // Alto igual al alto de la ventana
  }

  leerArchivo(rutaArchivo: string): Observable<string> {
    return this.http.get(rutaArchivo, { responseType: 'text' });
  }

  cargarVertexShader(shaderSource: string) {
    // Usa shaderSource en glShaderSource
    //console.log('Contenido del vertex shader:', shaderSource);
  }



}
