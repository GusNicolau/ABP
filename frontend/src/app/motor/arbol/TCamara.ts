import { TEntidad } from './TEntidad';
import * as glm from 'gl-matrix';

const tipos = {
    DIRECCIONAL: 'DIRECCIONAL',
    PUNTUAL: 'PUNTUAL',
    FOCAL: 'FOCAL'
}

export class TCamara extends TEntidad {
    esPerspectiva: boolean;

    fovy: number;

    izquierda: number;
    derecha: number;
    inferior: number;
    superior: number;
    cercano: number;
    lejano: number;

    proyeccion: glm.mat4;

    zoom: number;

    constructor(esperspe: boolean, fovy: number, izq: number, drch: number, inf: number, sup: number, cerca: number, lej: number) {
        super(); // Llama al constructor de la clase padre

        this.esPerspectiva = esperspe;
        this.fovy = fovy;
        this.izquierda = izq;
        this.derecha = drch;
        this.inferior = inf;
        this.superior = sup;
        this.cercano = cerca;
        this.lejano = lej;

        this.proyeccion = glm.mat4.create();

        this.zoom = 1;
        glm.mat4.ortho(this.proyeccion, -1.0, 1.0, -1.0, 1.0, 0.1, 10.0);
    }

    setPerspectiva(izq: number, drch: number, inf: number, sup: number, cerca: number, lej: number) {
        this.esPerspectiva = true;

        this.izquierda = izq;
        this.derecha = drch;
        this.inferior = inf;
        this.superior = sup;
        this.cercano = cerca;
        this.lejano = lej;
    }

    setParalela(izq: number, drch: number, inf: number, sup: number, cerca: number, lej: number) {
        this.esPerspectiva = false;

        this.izquierda = izq;
        this.derecha = drch;
        this.inferior = inf;
        this.superior = sup;
        this.cercano = cerca;
        this.lejano = lej;
    }

    dibujar(matri: glm.mat4) {
        // Método sobrecargado de la clase padre
    }

    getProyeccion():glm.mat4 {
        const ancho = this.derecha - this.izquierda;
        const alto = this.superior - this.inferior;
        const fovy = this.fovy;//Math.atan(alto / this.cercano) * 2; // Calcula el ángulo de visión vertical
        
        //console.log(fovy);
        const aspecto = ancho / alto;

        var projectionMatrix = glm.mat4.create();
      
        if(this.esPerspectiva){
            glm.mat4.perspective(this.proyeccion, fovy, aspecto, this.cercano, this.lejano);

            projectionMatrix = this.proyeccion;
        }else{
            glm.mat4.ortho(this.proyeccion, this.izquierda, this.derecha, this.inferior, this.superior, this.cercano, this.lejano);

            projectionMatrix = this.proyeccion;
        }
        
        projectionMatrix = this.proyeccion;
        
        return projectionMatrix;
    }

    imprimirMatriz(matr: glm.mat4){
    
        console.log(matr[0].toFixed(3) + " | " + matr[4].toFixed(3) + " | " + matr[8].toFixed(3) + " | " + matr[12].toFixed(3));
        console.log(matr[1].toFixed(3) + " | " + matr[5].toFixed(3) + " | " + matr[9].toFixed(3) + " | " + matr[13].toFixed(3));
        console.log(matr[2].toFixed(3) + " | " + matr[6].toFixed(3) + " | " + matr[10].toFixed(3) + " | " + matr[14].toFixed(3));
        console.log(matr[3].toFixed(3) + " | " + matr[7].toFixed(3) + " | " + matr[11].toFixed(3) + " | " + matr[15].toFixed(3));
        /*for (let i = 0; i < matr.length; i++){
            if(i == 4 || i == 8 || i == 12){
                console.log(this.matrizTransf[i].toFixed(2));
            }

            console.log(this.matrizTransf[i]);

            if(i != 3 && i != 7 && i != 12){
                console.log(" | ");
            }
            
        }*/

    }

    getZoom(): number{
        return this.zoom;
    }

    setZoom(zoom: number){
        this.zoom = zoom;
    }
}

export default TCamara;