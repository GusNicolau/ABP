import { Observable } from 'rxjs';
import { TRecurso } from './TRecurso';
import * as glm from 'gl-matrix';
import { HttpClient } from '@angular/common/http';

import * as OBJ from 'webgl-obj-loader';


export class TRecursoMaterial extends TRecurso {
    ka: glm.vec3;
    kd: glm.vec3;
    ks: glm.vec3;

    ns: number;
    d: number;

    http: HttpClient;

    mapaKa: [number, number];
    mapaKd: [number, number];
    mapaKs: [number, number];
    
    constructor(nombre: string, http: HttpClient) {
        super(nombre);
        
        this.ka = glm.vec3.fromValues(0.0, 0.0, 0.0);
        this.kd = glm.vec3.fromValues(0.0, 0.0, 0.0);
        this.ks = glm.vec3.fromValues(0.0, 0.0, 0.0);

        this.ns = 0;
        this.d = 0;

        this.http = http;
        
        this.mapaKa = [0, 0];
        this.mapaKd = [0, 0];
        this.mapaKs = [0, 0];
    }

    leerArchivo(rutaArchivo: string): Observable<string> {
        return this.http.get(rutaArchivo, { responseType: 'text' });
    }

    async leerJa(fichero: string): Promise<string | undefined> {
        try {
            const archivo = await this.leerArchivo('assets/files/' + fichero).toPromise();
          
          //console.log('Contenido del JSON:', archivo);
      
          //definirVertex();
          return archivo;
        } catch (error) {
          console.error('Error al leer el json:', error);
            return undefined;
        }
    }


    async cargarMaterial(fichero: string): Promise<void> {
        const archivoS2= await this.leerJa(fichero);

        var mtl: OBJ.MaterialLibrary;
        if(archivoS2 != undefined){
            mtl = new OBJ.MaterialLibrary(archivoS2);  

            this.ka = mtl.materials["Material"].ambient;
            this.kd = mtl.materials["Material"].diffuse;
            this.ks = mtl.materials["Material"].specular;

            this.ns = mtl.materials["Material"].specularExponent;
            this.d = mtl.materials["Material"].dissolve;
            console.log(this);
        }

        //impllementar carga de ficheros
    }

    getKa():glm.vec3{
        return this.ka;
    }
    getKd():glm.vec3{
        return this.kd;
    }
    getKs():glm.vec3{
        return this.ks;
    }
    getNs():number{
        return this.ns;
    }
    getD():number{
        return this.d;
    }
}