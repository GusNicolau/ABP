import { TEntidad } from './TEntidad';
import { TRecursoMalla } from '../gestor/TRecursoMalla';
import { TRecursoMaterial } from '../gestor/TRecursoMaterial';
import { TMalla } from '../gestor/TMalla';

import * as glm from 'gl-matrix';
import { ElementRef } from '@angular/core';
import { TModelo } from './TModelo';

export class TAnimacion extends TEntidad {
    mallas: TRecursoMalla [];
    seleccionada: boolean;


    constructor(mallap : TRecursoMalla[]) {
        super();
        this.mallas = mallap;
        this.seleccionada = false;
    }

    cargarModelo(fichero: string) {
        //hacer proceso de carga
    }

    getRecursoAnimacion(ind: number){
        return this.mallas[ind];
    }

    dibujar(matri: glm.mat4, canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, modo: number, ind: number){
        // Método sobrecargado de la clase padre
        //console.log("Me han mandado dibujar");
        //console.log(this.malla);

           this.mallas[ind].dibujar4(canvas, programa,matri, null,modo);

    }

    setSeleccionada (valor: boolean){
        this.seleccionada = valor;
    }
    getSeleccionada(): boolean{
        return this.seleccionada;
    }
/*
    getRecursoMalla(): TRecursoMalla | null{
        return this.malla;
    }
    */
}  
