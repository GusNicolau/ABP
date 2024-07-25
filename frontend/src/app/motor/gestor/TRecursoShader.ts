import { TRecurso } from './TRecurso';
import * as glm from 'gl-matrix';
import { TestComponent } from '../../pages/test/test.component';
import { ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class TRecursoShader extends TRecurso {
    id: number;

    vShader: string;
    fShader: string;
    http: HttpClient;
    canvas: ElementRef<HTMLCanvasElement>;

    view_matrix: glm.mat4;
    projection_matrix: glm.mat4;

    constructor(nombre: string, http: HttpClient, canvas: ElementRef<HTMLCanvasElement>) {
        
        super(nombre);

        this.id = 0;
        
        this.vShader = "";
        this.fShader = "";
        this.http = http;
        this.canvas = canvas;

        this.view_matrix = glm.mat4.create();
        this.projection_matrix = glm.mat4.create(); 

    }

    cargarFichero(nombre: string): void {
        //impllementar carga de ficheros
    }

    leerArchivo(rutaArchivo: string): Observable<string> {
        return this.http.get(rutaArchivo, { responseType: 'text' });
    }

    async leerVertex(): Promise<string | undefined> {
        try {
            const archivo = await this.leerArchivo('assets/files/VertexShader.glsl').toPromise();
          
          //console.log('Contenido del vertex shader:', archivo);
      
          //definirVertex();
          return archivo;
        } catch (error) {
          console.error('Error al leer el vertex shader:', error);
            return undefined;
        }
    }

    async leerFragment(): Promise<string | undefined> {
        try {
            const archivo = await this.leerArchivo('assets/files/FragmentShader.glsl').toPromise();
          
          //console.log('Contenido del vertex shader:', archivo);
      
          //definirVertex();
          return archivo;
        } catch (error) {
          console.error('Error al leer el vertex shader:', error);
            return undefined;
        }
    }

    async setShader(): Promise<WebGLProgram | null>{
        var returd: WebGLProgram | null;

        const gl = this.canvas.nativeElement.getContext('webgl');

        var vShaderId: WebGLShader | null, fShaderId: WebGLShader | null, programId: WebGLShader | null;
        var vShaderCode: string | undefined, fShaderCode: string | undefined;

        if (!gl) {
            console.error('El navegador no soporta WebGL');
            returd = null;
        } else {
            console.log('Contexto WebGL creado exitosamente');
        
            //Crear los shader
            vShaderId = gl.createShader(gl.VERTEX_SHADER);        console.log(gl?.getError());
            fShaderId = gl.createShader(gl.FRAGMENT_SHADER);        console.log(gl?.getError());

            vShaderCode = await this.leerVertex();
            fShaderCode = await this.leerFragment();

            if(vShaderId && gl&& vShaderCode){
                gl.shaderSource(vShaderId, vShaderCode);        console.log(gl?.getError());
            }else{
                console.error('Error al definir el vertex shader');
            }

            if(fShaderId && gl && fShaderCode){
                gl.shaderSource(fShaderId, fShaderCode);        console.log(gl?.getError());
            }else{
                console.error('Error al definir el fragment shader');
            }

            //Compilar los shaders
            if(vShaderId && fShaderId){
                gl.compileShader(vShaderId);        console.log(gl?.getError());

                if (!gl.getShaderParameter(vShaderId, gl.COMPILE_STATUS)) {        console.log(gl?.getError());
                    alert(
                      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(vShaderId),
                    );
                    //gl.deleteShader(vShaderId);
                    return null;
                  }

                gl.compileShader(fShaderId);        console.log(gl?.getError());
            }else{
                console.error('Error al compilar el shader');
            }

            //Crear programa
            programId = gl.createProgram();        console.log(gl?.getError());
            if(programId && fShaderId && vShaderId){
                gl.attachShader(programId, vShaderId);        console.log(gl?.getError());
                gl.attachShader(programId, fShaderId);        console.log(gl?.getError());
                gl.linkProgram(programId);        console.log(gl?.getError());

                //console.log(result);

                await borrarShaders();
            }else{
                console.error('Error al crear el programa');
            }

            async function borrarShaders(){
                gl?.deleteShader(vShaderId);        console.log(gl?.getError());
                gl?.deleteShader(fShaderId);        console.log(gl?.getError());
                return true;
            }

            //gl.useProgram(programId);
            returd = programId;
            console.log(programId);
            //console.log(programId);
        }
        return returd;
    }
    
    setViewMatrix(mat: glm.mat4){
        this.view_matrix = mat;
    }

    setProjectionMatrix(mat: glm.mat4){
        this.projection_matrix = mat
    }

/////////////// ////// //////// ///////// /////////
    async setShader2(): Promise<WebGLProgram | null>{
        var returd: WebGLProgram | null;

        const gl = this.canvas.nativeElement.getContext('webgl');

        var vShaderId: WebGLShader | null, fShaderId: WebGLShader | null, programId: WebGLShader | null;
        var vShaderCode: string | undefined, fShaderCode: string | undefined;

        if (!gl) {
            console.error('El navegador no soporta WebGL');
            returd = null;
        } else {
            console.log('Contexto WebGL creado exitosamente');
        
            vShaderCode = await this.leerVertex();
            fShaderCode = await this.leerFragment();

            const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vShaderCode);
            const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fShaderCode);

              // Create the shader program

            programId = gl.createProgram();
            if (!programId) {
                // Manejar el error, por ejemplo, lanzar una alerta o registrar un mensaje de error
                console.error('Error initializing shader program');
            } else {
                // Continuar con el uso del programa de shaders
                gl.attachShader(programId, vertexShader);
                gl.attachShader(programId, fragmentShader);
                gl.linkProgram(programId);

                if (!gl.getProgramParameter(programId, gl.LINK_STATUS)) {
                    alert(
                      "Unable to initialize the shader program: " +
                        gl.getProgramInfoLog(programId),
                    );
                    return null;
                  }
            }

            returd = programId;
        }
        return returd;
    }


    loadShader(gl, type, source) {
        const shader = gl.createShader(type);
      
        // Send the source to the shader object
      
        gl.shaderSource(shader, source);
      
        // Compile the shader program
      
        gl.compileShader(shader);
      
        // See if it compiled successfully
      
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          alert(
            "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader),
          );
          gl.deleteShader(shader);
          return null;
        }
      
        return shader;
    }




    // leerArchivo(rutaArchivo: string): Observable<string> {
    //     return this.http.get(rutaArchivo, { responseType: 'text' });
    //   }
    
}