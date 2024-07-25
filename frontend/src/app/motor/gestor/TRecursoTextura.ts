import { ElementRef } from '@angular/core';
import { TRecurso } from './TRecurso';
import * as glm from 'gl-matrix';

export class TRecursoTextura extends TRecurso {
    id: number;
    imagenTextura: HTMLImageElement;
    canvas: ElementRef<HTMLCanvasElement>;
    texture: WebGLTexture | null;


    constructor(nombre: string, canvas: ElementRef<HTMLCanvasElement>) {
        super(nombre);
        
        this.id = 1;
        this.imagenTextura = new Image();

        this.canvas = canvas;

        this.texture = null;
    }


    cargarTextura(fcihero: string): void {

        const gl = this.canvas.nativeElement.getContext('webgl');

        if(gl != undefined){
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            
            // Fill the texture with a 1x1 blue pixel.
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                            new Uint8Array([0, 0, 255, 255]));


            // Asynchronously load an image
            const recte:TRecursoTextura = this;
            this.imagenTextura = new Image();
            this.imagenTextura.src = "/assets/images/f-textu.png";
            this.imagenTextura.addEventListener('load', function() {
                // Now that the image has loaded make copy it to the texture.
                gl.bindTexture(gl.TEXTURE_2D, recte.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, recte.imagenTextura);
                gl.generateMipmap(gl.TEXTURE_2D);

                console.log(recte.texture);
                console.log(recte.texture);

                console.log(recte.texture);

                console.log(recte.texture);

                
            });
        }
    }
}