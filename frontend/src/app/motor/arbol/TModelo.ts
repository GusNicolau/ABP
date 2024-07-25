import { TEntidad } from './TEntidad';
import { TRecursoMalla } from '../gestor/TRecursoMalla';
import { TRecursoMaterial } from '../gestor/TRecursoMaterial';

import * as glm from 'gl-matrix';
import { ElementRef } from '@angular/core';
import { ThemeService } from 'ng2-charts';
import { TRecursoTextura } from '../gestor/TRecursoTextura';

export class TModelo extends TEntidad {
    malla: TRecursoMalla | null;

    material: TRecursoMaterial | null;

    textura: TRecursoTextura | null;


    constructor(mallap : TRecursoMalla) {
        super();
        this.malla = mallap;
        this.material = null;
        
        this.textura = null;
    }

    cargarModelo(fichero: string) {
        //hacer proceso de carga
    }

    dibujar(matri: glm.mat4, canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, modo: number ){
        // Método sobrecargado de la clase padre
        //console.log("Me han mandado dibujar");
        //console.log(this.malla);
        if(this.malla){
            this.malla.dibujar4(canvas, programa, matri, this, modo);
        }else{
            console.error("esta malla no es dibujable");
        }

    }

    getRecursoMalla(): TRecursoMalla | null{
        return this.malla;
    }


    getTextura(): TRecursoTextura | null{
        return this.textura;
    }

    setTextura(materia1: TRecursoTextura){
        this.textura = materia1;
    }



    getMaterial(): TRecursoMaterial | null{
        return this.material;
    }

    setMaterial(materia1: TRecursoMaterial){
        this.material = materia1;
    }

    setPosition(newPosition: { x: number, y: number, z: number }): void {
        // Verifica si la malla existe antes de actualizar la posición
        if (this.malla) {
            // Obtener la matriz de modelo actual
            const currentModelMatrix = this.malla.getModelMatrix();
    
            // Crear una nueva matriz de modelo con la nueva posición
            const newModelMatrix = glm.mat4.create();
            glm.mat4.translate(newModelMatrix, newModelMatrix, [newPosition.x, newPosition.y, newPosition.z]);
    
            // Aplicar la nueva matriz de modelo a la malla
            glm.mat4.copy(currentModelMatrix, newModelMatrix);
            this.malla.setModelMatrix(currentModelMatrix); // Actualiza la matriz de modelo de la malla
        }
    }


}  
