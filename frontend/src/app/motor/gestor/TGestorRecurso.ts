import * as glm from 'gl-matrix';
import { TRecurso } from './TRecurso';
import { TRecursoMalla } from './TRecursoMalla';
import { TRecursoMaterial } from './TRecursoMaterial';
import { TRecursoShader } from './TRecursoShader';
import { TRecursoTextura } from './TRecursoTextura';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';

export class TGestorRecurso {
    recursos: (TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura)[];

    http: HttpClient;
    canvas: ElementRef<HTMLCanvasElement>;
    programaGL: WebGLProgram | null;

    constructor(http: HttpClient, canvas: ElementRef<HTMLCanvasElement>) {
        this.recursos = [];

        this.http = http;
        this.canvas = canvas;
        this.programaGL = null;

        //console.log("1: Crear gestor recursos");
    }

    async getRecursoMalla(nombre: string, ind: number): Promise<TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null> {
        let rec: TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null = this.buscarRecursoMalla(nombre);
        if (rec == null) {
            rec = new TRecursoMalla(nombre, this.http);
            await rec.cargarMallaObj(nombre, ind);
            this.recursos.push(rec);
        }
        //console.log("3: Crear recurso Malla");
        return rec;
    }

    async getRecursoMalla2(nombre: string): Promise<TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null> {
        let rec: TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null = this.buscarRecursoMalla(nombre);
        if (rec == null) {
            //console.log("NOOOOO Encontrada");
            rec = new TRecursoMalla(nombre, this.http);
            await rec.cargarMallaObj(nombre, -1);
            this.recursos.push(rec);
        }else{
            //console.log("Encontrada");
        }
        //console.log("3: Crear recurso Malla");
        return rec;
    }

    async getRecursoMaterial(nombre: string): Promise<TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null> {
        let rec: TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null = this.buscarRecursoMaterial(nombre);
        if (rec == null) {
            rec = new TRecursoMaterial(nombre, this.http);
            await rec.cargarMaterial(nombre);
            this.recursos.push(rec);
        }
        return rec;
    }

    getRecursoShader(nombre: string): TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null {
        let rec: TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null = this.buscarRecursoShader(nombre);
        if (rec == null) {

            rec = new TRecursoShader(nombre, this.http, this.canvas);
            rec.cargarFichero(nombre);
            this.recursos.push(rec);
        }
        //console.log("2: Crear recurso shader");
        return rec;
    }

    async getRecursoTextura(nombre: string): Promise<TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null> {
        let rec: TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null = this.bucarRecursoTextura(nombre);
        if (rec == null) {
            rec = new TRecursoTextura(nombre, this.canvas);
            await rec.cargarTextura(nombre);
            this.recursos.push(rec);
        }
        return rec;
    }

    buscarRecursoMalla(nombre: string): TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null{
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() == nombre && this.recursos[i] instanceof TRecursoMalla) {
                return this.recursos[i];
            }
        }
        return null;
    }

    buscarRecursoMaterial(nombre: string): TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null{
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() == nombre && this.recursos[i] instanceof TRecursoMaterial) {
                return this.recursos[i];
            }
        }
        return null;
    }

    buscarRecursoShader(nombre: string): TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null{
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() == nombre && this.recursos[i] instanceof TRecursoShader) {
                return this.recursos[i];
            }
        }
        return null;
    }

    bucarRecursoTextura(nombre: string): TRecursoMalla | TRecursoMaterial | TRecursoShader | TRecursoTextura | null{
        for (let i = 0; i < this.recursos.length; i++) {
            if (this.recursos[i].getNombre() == nombre && this.recursos[i] instanceof TRecursoTextura) {
                return this.recursos[i];
            }
        }
        return null;
    }

    async dibujarMalla(){
        // Filtrar solo los elementos que son mallas
        let mallas: TRecursoMalla[] = this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoMalla;
        }) as TRecursoMalla[];

        //console.log(this.recursos);

        for (const malla of mallas) {
            /// Realizar la operación deseada con cada malla
            //console.log(`Operación realizada en la malla: ${malla.getNombre()}`);
            await malla.dibujar(this.canvas, this.programaGL);
            //console.log(this.programaGL);
        }
    }

    async hacerShader(){
        //console.log("Se empieza la funcion hacerShader");

        // Filtrar solo los elementos que son shader
        let shaders: TRecursoShader[] = await this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoShader;
        }) as TRecursoShader[];

        //console.log(this.recursos);

        // Aplicar la operación deseada a cada malla
/*
        if(this.recursos[0] instanceof TRecursoShader){
            this.programaGL =  await this.recursos[0].setShader();

            console.log(this.programaGL);
        }
*/
        for (const shader of shaders) {
            // Realizar la operación deseada con cada malla
            //console.log(`Operación realizada en la malla: ${malla.getNombre()}`);
            this.programaGL = await shader.setShader2();
            //console.log(this.programaGL);
        }

        //console.log("Se termina la funcion hacerShader");
    }
    
    seleccionaMalla(ind: number){
        let mallas: TRecursoMalla[] = this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoMalla;
        }) as TRecursoMalla[];

        //console.log(this.recursos);

        for (const malla of mallas) {
            if(malla.getId() == ind){
                malla.setSeleccionado(true);
            }
        }
    }

    hoveaMalla(ind: number){
        let mallas: TRecursoMalla[] = this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoMalla;
        }) as TRecursoMalla[];

        //console.log(this.recursos);

        for (const malla of mallas) {
            if(malla.getId() == ind){
                malla.setHoveado(true);
            }
        }
    }

    deseleccionaMalla(ind: number){
        console.log("se ha llamado");
        let mallas: TRecursoMalla[] = this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoMalla;
        }) as TRecursoMalla[];

        //console.log(this.recursos);

        for (const malla of mallas) {
            if(malla.getId() == ind){
                malla.setSeleccionado(false);
            }
        }
    }

    deshoveaMalla(ind: number){
        let mallas: TRecursoMalla[] = this.recursos.filter((elemento: any) => {
            return elemento instanceof TRecursoMalla;
        }) as TRecursoMalla[];

        //console.log(this.recursos);

        for (const malla of mallas) {
            if(malla.getId() == ind){
                malla.setHoveado(false);
            }
        }
    }

}