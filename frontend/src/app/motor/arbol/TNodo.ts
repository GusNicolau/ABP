import * as glm from 'gl-matrix';
import { TEntidad } from './TEntidad';
import { TModelo } from './TModelo';
import { ElementRef } from '@angular/core';
import TCamara from './TCamara';
import { TAnimacion } from './TAnimacion';

export class TNodo {
    nombre: string;
    entidad: TEntidad | null;
    hijos: TNodo[];
    padre: TNodo | null;

    traslacion: glm.vec3;
    rotacion: glm.vec3;
    actualizarMatriz: boolean;
    escalado: glm.vec3;

    matrizTransf: glm.mat4;

    constructor(nom: string) {
        this.nombre = nom;
        this.entidad = null;
        this.hijos = [];
        this.padre = null;

        this.traslacion = glm.vec3.create();
        glm.vec3.set(this.traslacion, 0, 0, 0);
        this.rotacion = glm.vec3.create();
        glm.vec3.set(this.rotacion, 0, 0, 0);
        this.actualizarMatriz = false;
        this.escalado = glm.vec3.create();
        glm.vec3.set(this.escalado, 1, 1, 1);

        this.matrizTransf = glm.mat4.create();
        glm.mat4.set(this.matrizTransf,
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1    
        );
    }

    addHijo(nodo: TNodo) {
        this.hijos.push(nodo);

        nodo.setPadre(this);
    }

    remHijo(nodo: TNodo) {
        const indice = this.hijos.indexOf(nodo);
        if (indice !== -1) {
            this.hijos.splice(indice, 1);
        }
    }

    async recorrer(matrizAcum: glm.mat4) {
        //console.log("Mi nombre es " + this.nombre);
        if (this.actualizarMatriz) {
            glm.mat4.multiply(this.matrizTransf, matrizAcum, this.calcularMatriz());
            this.actualizarMatriz = false;
            //console.log("Mi nombre es " + this.nombre + " y mi matriz es:");       
            //this.imprimirMatriz(this.matrizTransf);     
        }else{
            //console.log("Mi nombre es " + this.nombre + "y no actualizo la matriz fasle");
        }
            //this.entidad.dibujar();

            this.hijos.forEach((i) => i.recorrer(this.matrizTransf));
            //console.log("He terminado: " + this.nombre);
            //let transposedMatrix: glm.mat4 = glm.mat4.create();
            //glm.mat4.transpose(transposedMatrix,this.getMatrizTransf());
            //this.imprimirMatriz();
            
            //console.log("TRASPUESTA");
            //this.imprimirMatriz(transposedMatrix);  
        
    }

    async recorrerAnimaciones(matrizAcum: glm.mat4, elegid: TAnimacion) {
        //console.log("Mi nombre es " + this.nombre);
        if (this.actualizarMatriz) {
            glm.mat4.multiply(this.matrizTransf, matrizAcum, this.calcularMatriz());
            this.actualizarMatriz = false;
            //console.log("Mi nombre es " + this.nombre + " y mi matriz es:");       
            //this.imprimirMatriz(this.matrizTransf);     
        }else{
            //console.log("Mi nombre es " + this.nombre + "y no actualizo la matriz fasle");
        }
            //this.entidad.dibujar();

            if(this.entidad!= null && this.entidad instanceof TAnimacion){
                //console.log("Voy a dibujar " + this.nombre);
                if(this.entidad != elegid){
                    this.entidad.setSeleccionada(false);
                }else{
                    this.entidad.setSeleccionada(true);

                }
                
            }else{
                //console.log("NO Voy a dibujar " + this.nombre);
            }
            this.hijos.forEach((i) => i.recorrerAnimaciones(this.matrizTransf, elegid));

            //console.log("He terminado: " + this.nombre);
            //let transposedMatrix: glm.mat4 = glm.mat4.create();
            //glm.mat4.transpose(transposedMatrix,this.getMatrizTransf());
            //this.imprimirMatriz();
            
            //console.log("TRASPUESTA");
            //this.imprimirMatriz(transposedMatrix);  
        
    }

    async recorrerDibujar(matrizAcum: glm.mat4, canvas: ElementRef<HTMLCanvasElement>, programa: WebGLProgram, camara, luces:TNodo[] ,mode: number, animacion: number) {
        if(this.nombre == "CUERPOOOO"){
            //this.imprimirMatriz();
        }
        if (this.actualizarMatriz) {

            glm.mat4.multiply(this.matrizTransf, matrizAcum, await this.calcularMatriz());
            this.actualizarMatriz = false;   

        }
        if(this.nombre == "CUERPOOOO"){
            //console.log(this.hijos);
        }
            this.hijos.forEach((i) => i.recorrerDibujar(this.matrizTransf, canvas, programa, camara, luces ,mode, animacion));

        if(animacion == -1){//no hay animacion, pintamos todo el modelo
            if(this.entidad!= null && this.entidad instanceof TModelo){
                //console.log("Voy a dibujar " + this.nombre);
                this.entidad.getRecursoMalla()?.setCnodo(camara);
                this.entidad.getRecursoMalla()?.setEcamara(camara.getEntidad());
                this.entidad.getRecursoMalla()?.setLuces(luces);

                this.entidad.dibujar(this.matrizTransf, canvas, programa, mode);

                
            }else{
                //console.log("NO Voy a dibujar " + this.nombre);
            }
        }else{
            //hay animacion, pintamos solo los modelos animados
            if(this.entidad!= null && this.entidad instanceof TAnimacion){
                if(this.entidad.getSeleccionada() == true){
                //console.log("Voy a dibujar " + this.nombre);
                this.entidad.getRecursoAnimacion(animacion)?.setCnodo(camara);
                this.entidad.getRecursoAnimacion(animacion)?.setEcamara(camara.getEntidad());
                this.entidad.getRecursoAnimacion(animacion)?.setLuces(luces);

                this.entidad.dibujar(this.matrizTransf, canvas, programa, mode, animacion);
                }
                
            }else{
                //console.log("NO Voy a dibujar " + this.nombre);
            }
        }

    }

    actualizaHijos(){
        this.hijos.forEach((i) => i.actualizarMatriz = true);
    }

    calcularMatriz(): glm.mat4 {
        const mattra: glm.mat4 = glm.mat4.create();
        var matrot: glm.mat4 = glm.mat4.create();
        const matesc: glm.mat4 = glm.mat4.create();
        const matrizAux: glm.mat4 = glm.mat4.create();

        glm.mat4.fromTranslation(mattra, this.traslacion);
        matrot = this.rotate(this.rotacion, matrot);
        glm.mat4.fromScaling(matesc, this.escalado);

        glm.mat4.multiply(matrizAux, matesc, matrot);
        glm.mat4.multiply(matrizAux, matrizAux, mattra);
        
        return matrizAux;
    }

    setNombre(nom: string) {
        this.nombre = nom;
    }

    getNombre(): string {
        return this.nombre;
    }

    setEntidad(enti: TEntidad) {
        this.entidad = enti;
    }

    getEntidad(): TEntidad | null{
        return this.entidad;
    }

    getHijos(): TNodo[] {
        return this.hijos;
    }

    setPadre(nodo: TNodo) {
        this.padre = nodo;
    }

    getPadre(): TNodo | null {
        return this.padre;
    }

    setTraslacion(trasla: glm.vec3) {
        this.traslacion = trasla;
        this.actualizarMatriz = true;
    }

    setRotacion(rota: glm.vec3) {
        this.rotacion = rota;
        this.actualizarMatriz = true;
    }

    setEscalado(esca: glm.vec3) {
        this.escalado = esca;
        this.actualizarMatriz = true;
    }

    trasladar(trasla: glm.vec3) {
        const mattra: glm.mat4 = glm.mat4.create();

        glm.mat4.fromTranslation(mattra, trasla);

        //glm.mat4.multiply(this.matrizTransf, mattra, this.matrizTransf);
        //glm.mat4.multiply(this.matrizTransf, this.matrizTransf, mattra);

        glm.mat4.translate(this.matrizTransf, this.matrizTransf, trasla);


    }

    gradosARadianes(grados: number): number {
        return grados * (Math.PI / 180);
    }

    rotate(rota: glm.vec3, aplica: glm.mat4): glm.mat4{
        //const aux = glm.mat4.create();
        const matrizRotacionX = glm.mat4.create();
        glm.mat4.fromXRotation(matrizRotacionX, this.gradosARadianes(rota[0]));

        const matrizRotacionY = glm.mat4.create();
        glm.mat4.fromYRotation(matrizRotacionY, this.gradosARadianes(rota[1]));
        //console.log("ESTOYYY ROTANDO EN EL EJE Y la  " + this.nombre + " ,UN TOTAL DE :" + this.gradosARadianes(rota[1]));

        const matrizRotacionZ = glm.mat4.create();
        glm.mat4.fromZRotation(matrizRotacionZ, this.gradosARadianes(rota[2]));

        // Multiplicar las matrices de rotación individualmente
        glm.mat4.multiply(aplica, aplica, matrizRotacionX);
        glm.mat4.multiply(aplica, aplica, matrizRotacionY);
        glm.mat4.multiply(aplica, aplica, matrizRotacionZ);
        
        for (let i = 0; i < aplica.length; i++) {
            aplica[i] = Number(aplica[i].toFixed(5));

        }

        return aplica;
    }

    rotar(rota: glm.vec3) {
        //const aux = glm.mat4.create();
        const matrizRotacionX = glm.mat4.create();
        glm.mat4.fromXRotation(matrizRotacionX, this.gradosARadianes(rota[0]));

        const matrizRotacionY = glm.mat4.create();
        glm.mat4.fromYRotation(matrizRotacionY, this.gradosARadianes(rota[1]));

        const matrizRotacionZ = glm.mat4.create();
        glm.mat4.fromZRotation(matrizRotacionZ, this.gradosARadianes(rota[2]));

        // Multiplicar las matrices de rotación individualmente
        glm.mat4.multiply(this.matrizTransf, this.matrizTransf, matrizRotacionX);
        glm.mat4.multiply(this.matrizTransf, this.matrizTransf, matrizRotacionY);
        glm.mat4.multiply(this.matrizTransf, this.matrizTransf, matrizRotacionZ);

        for (let i = 0; i < this.matrizTransf.length; i++) {
            this.matrizTransf[i] = Number(this.matrizTransf[i].toFixed(5));

        }

    }

    escalar(esca: glm.vec3) {
        const matesc: glm.mat4 = glm.mat4.create();

        glm.mat4.fromScaling(matesc, esca);

        glm.mat4.multiply(this.matrizTransf, matesc, this.matrizTransf);
    }

    getTraslacion(): glm.vec3 {
        return this.traslacion;
    }

    getRotacion(): glm.vec3 {
        return this.rotacion;
    }

    getEscalado(): glm.vec3 {
        return this.escalado;
    }

    setMatrizTransf(matri: glm.mat4) {
        this.matrizTransf = matri;
    }

    getMatrizTransf(): glm.mat4 {
        return this.matrizTransf;
    }

    imprimirMatriz(): void {
        //glm.mat4.invert(this.matrizTransf, this.matrizTransf);
        console.log(this.matrizTransf[0].toFixed(3) + " | " + this.matrizTransf[4].toFixed(3) + " | " + this.matrizTransf[8].toFixed(3) + " | " + this.matrizTransf[12].toFixed(3));
        console.log(this.matrizTransf[1].toFixed(3) + " | " + this.matrizTransf[5].toFixed(3) + " | " + this.matrizTransf[9].toFixed(3) + " | " + this.matrizTransf[13].toFixed(3));
        console.log(this.matrizTransf[2].toFixed(3) + " | " + this.matrizTransf[6].toFixed(3) + " | " + this.matrizTransf[10].toFixed(3) + " | " + this.matrizTransf[14].toFixed(3));
        console.log(this.matrizTransf[3].toFixed(3) + " | " + this.matrizTransf[7].toFixed(3) + " | " + this.matrizTransf[11].toFixed(3) + " | " + this.matrizTransf[15].toFixed(3));
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

    setActualizarMatriz(obtenido: boolean){
        this.actualizarMatriz = obtenido;
    }

    getMatrizVist(): glm.mat4 {
        var vista: glm.mat4;
        vista =  glm.mat4.create();

        let matrizActual = this.getMatrizTransf();
        var camara;

        if(this.entidad instanceof TCamara){
            camara = this.entidad;
        }

        //console.log("CLARO QUE ENTOROSSDSSS");
        const zoomScale = 1 / camara.getZoom();

        //console.log("calculo con ZOOM: " +  camara.getZoom() + "    y zoomScale: " + zoomScale);

        //var matrizEscalado = glm.mat4.create();
        //glm.mat4.fromScaling(matrizEscalado, glm.vec3.fromValues(zoomScale, zoomScale, 1));
        
        //console.log("Mi matriz ahora es: " + this.getMatrizTransf());
        var matrizEnviar = glm.mat4.create();
        glm.mat4.scale(matrizEnviar, this.getMatrizTransf(), glm.vec3.fromValues(zoomScale, zoomScale, 1));
        //console.log("Mi matriz ahora es: " + this.getMatrizTransf());
        //console.log("MI ZOOOOOOOOM ES:   " + this.entidad.getZoom());
    
        //console.log("MATRIZ DE CAMARA:  : " + matrizEnviar );

        glm.mat4.invert(vista, matrizEnviar);

        return vista;
    }
}
