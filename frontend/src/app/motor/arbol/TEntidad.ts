import { ElementRef } from '@angular/core';
import * as glm from 'gl-matrix';

export abstract class TEntidad {
    constructor() {
      if (new.target === TEntidad) {
        throw new Error('No es posible instanciar una clase abstracta');
      }
    }
  
    abstract dibujar(matri: glm.mat4, canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, modo: number, ind: number): void;
}