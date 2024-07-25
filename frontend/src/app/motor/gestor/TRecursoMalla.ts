    import { TModelo } from '../arbol/TModelo';
import { TRecurso } from './TRecurso';
import { TMalla } from './TMalla';
import { TNodo } from '../arbol/TNodo';
import { TCamara } from '../arbol/TCamara';

import * as glm from 'gl-matrix';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import * as OBJ from 'webgl-obj-loader';
import { TRecursoMaterial } from './TRecursoMaterial';

export class TRecursoMalla extends TRecurso {
    mallas: TMalla[];
    http: HttpClient;
    mnodo: TNodo | null;
    cnodo: TNodo | null;
    ecamara: TCamara | null;
    luces: TNodo[];
    private modelMatrix: glm.mat4;

    constructor(nombre: string, http: HttpClient) {
        super(nombre);

        this.mallas = [];
        this.http = http;
        this.mnodo = null;
        this.cnodo = null;
        this.ecamara = null;
        this.modelMatrix = glm.mat4.create();
        this.luces = [];
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

    async cargarMallaObj(fichero: string , ind: number){
        const archivoS= await this.leerJa(fichero);
        let malla = new TMalla("malla " , ind);

        var mesh: OBJ.Mesh;  
        if(archivoS){
            mesh = new OBJ.Mesh(archivoS);
            //console.log(mesh);
            malla.setVertices(mesh.vertices);
            malla.setIndices(mesh.indices);
            malla.setCoordTex(mesh.textures);
            malla.setNormales(mesh.vertexNormals);

        }else{
            console.error("No se ha podido leer el archivo");
        }
        //console.log(fichero);
        this.mallas.push(malla);
    }


    async cargarMalla(fichero: string, ind: number) {
        const archivoJSON = await this.leerJa(fichero);
        //var archivonuevo = archivoJSON?.stringify();
        let malla: TMalla; 

        if (archivoJSON != undefined) {
            //console.log('Contenido del JSON:', JSON.parse(archivoJSON).model.meshes);
            const objJSO = JSON.parse(archivoJSON);

            //Para cada malla que este en el recurso
            JSON.parse(archivoJSON).model.meshes.forEach((mesh: any, index: number) => {
                // Realizar operaciones con cada elemento del array
                //console.log(`Mesh ${index + 1}:`, mesh);

                //Crear nueva Malla
                malla = new TMalla("malla " + (index + 1), ind);

                //Almacenar vertices, normales y coords de texturas
                let vertPos = mesh.fverts + '';
                var vecPos = vertPos.split(",");
                var nuevoVer: number[] = [];

                vecPos.forEach(element => {
                    //nuevoIndice.push(mesh.vertElement.vertIndices[element]);
                });



                malla.setVertices(mesh.verts);
    

                malla.setNormales(mesh.vertElement.normals);
                mesh.vertElement.uvs.forEach((uv: number[], uvIndex: number) => {
                    //console.log(`UVs ${uvIndex + 1} de mesh ${index + 1}:`, uv);
                    
                    malla.setCoordTex(uv);
                });
                
                let vertElementInx = mesh.face.vertElementIndices + '';

                var arrayElements = vertElementInx.split(",");

                var nuevoIndice: number[] = [];

                arrayElements.forEach(element => {
                    nuevoIndice.push(mesh.vertElement.vertIndices[element]);
                });
                //console.log(arrayElements[1]);
                
                //console.log(nuevoIndice);


                //malla.setNormales(nuevoIndice);


                //Almacenar índices
                //malla.setIndices(mesh.vertElement.vertIndices)
                malla.setIndices(nuevoIndice);

                //Almacenar texturas y materiales

                //console.log(mesh.vertElement.normals);

                this.mallas.push(malla);
            });

            //console.log("Aqui el contenido de model: " + objJSO.model);
        }else{
            console.error('Error al leer el archivo json');
        }

        //implementar carga de ficheros
    }


    async cargarMalla2(fichero: string, ind: number) {
        const archivoJSON = await this.leerJa(fichero);
        //var archivonuevo = archivoJSON?.stringify();
        let malla: TMalla; 

        if (archivoJSON != undefined) {
            //console.log('Contenido del JSON:', JSON.parse(archivoJSON).model.meshes);
            const objJSO = JSON.parse(archivoJSON);
            
            //console.log(objJSO);

            if (objJSO.meshes) {
                const meshes = objJSO.meshes;

                meshes.forEach((mesh: any, index: number) => {
                    if(index == 0){
                    malla = new TMalla("malla " + (index + 1), ind);
                    
                    malla.setVertices(mesh.vertices);
                    malla.setNormales(mesh.normals);


                    if (objJSO.meshes[index].faces) {
                        const carass = objJSO.meshes[index].faces;
                        var acumulaCaras: number[] = [];
                        
                        carass.forEach((mesh: any, index: number) => {
                            //acumulaCaras.push(carass[index]);
                            acumulaCaras.push(carass[index][0]);
                            acumulaCaras.push(carass[index][1]);
                            acumulaCaras.push(carass[index][2]);
                        });

                        malla.setIndices(acumulaCaras);
                    }
                    else{
                        //console.error("No hay caras a pintar aqui");
                    }

                    this.mallas.push(malla);
                    // Y así sucesivamente...
                }
                });
            }else{
                console.error("No contiene meshes");
            }         
        
        }else{
            console.error('Error al leer el archivo json');
        }

        //implementar carga de ficheros
    }

    async cargarMalla5(fichero: string, ind: number) {
        const archivoJSON = await this.leerJa(fichero);
        //var archivonuevo = archivoJSON?.stringify();
        let malla: TMalla; 

        if (archivoJSON != undefined) {
            //console.log('Contenido del JSON:', JSON.parse(archivoJSON).model.meshes);
            const objJSO = JSON.parse(archivoJSON);


                //Crear nueva Malla
                malla = new TMalla("malla ", ind);

                //Almacenar vertices, normales y coords de texturas



                malla.setVertices(objJSO.verts);

                malla.setIndices(objJSO.indices);

                malla.setCoordTex(objJSO.texcoords);
                
                malla.setNormales(objJSO.normals);


                this.mallas.push(malla);
            

            //console.log("Aqui el contenido de model: " + objJSO.model);
        }else{
            console.error('Error al leer el archivo json');
        }

        //implementar carga de ficheros
    }

    async cargarMalla3(fichero: string, ind: number) {
        const archivoJSON = await this.leerJa(fichero);
        //console.log("EEEEEEEEEEEEEEEEEEE")
        //var archivonuevo = archivoJSON?.stringify();
        const malla = new TMalla("malla", ind);
        if (archivoJSON != undefined) {
            const lines = archivoJSON.split('\n');
            lines.forEach(line => {
                //console.log(line);
                const parts = line.trim().split(' ');
                const type = parts.shift();
                switch (type) {
                    case 'v':
                        malla.vertices.push(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
                        break;
                    case 'vt':
                        malla.coordtex.push(parseFloat(parts[0]), parseFloat(parts[1]));
                        break;
                    case 'vn':
                        malla.normales.push(parseFloat(parts[0]), parseFloat(parts[1]), parseFloat(parts[2]));
                        break;
                    case 'f':
                        parts.forEach(facePart => {
                            const indices = facePart.split('/');
                            malla.indices.push(parseInt(indices[0]) - 1);
                            malla.coordtex.push(parseFloat(parts[1]), parseFloat(parts[2]));
                            //malla.normales.push(parseFloat(parts[3]), parseFloat(parts[4]), parseFloat(parts[5]));
                        });
                        break;
                    default:
                        break;
                }
            });

            this.mallas.push(malla);
            // Y así sucesivamente...       
        
        }else{
            console.error('Error al leer el archivo json');
        }

        //implementar carga de ficheros
    }


    dibujar(canvas: ElementRef<HTMLCanvasElement>, programa): void {
        const gl = canvas.nativeElement.getContext('webgl');

        //console.log(this.mallas);

        this.mallas.forEach((element) => {
            if(this.mnodo!= null && this.cnodo!= null && this.ecamara){
                element.dibujar3(canvas, programa, this.mnodo, this.cnodo, this.ecamara);
            }else{
                console.log("No se dibuja");
            }
          });

          //gl?.clearColor(0, 0, 0, 1);
        //gl?.clear(gl.COLOR_BUFFER_BIT);
    }

    dibujar4(canvas: ElementRef<HTMLCanvasElement>, programa, mat4, modeloc ,mode): void {
        const gl = canvas.nativeElement.getContext('webgl');

        //console.log(this.mallas);

        this.mallas.forEach((element) => {
            if(this.cnodo!= null && this.ecamara){
                element.dibujar4(canvas, programa, mat4,this.cnodo, modeloc,this.ecamara, this.luces, mode);
            }else{
                //console.log("No se dibuja");
            }
          });

          //gl?.clearColor(0, 0, 0, 1);
        //gl?.clear(gl.COLOR_BUFFER_BIT);
    }

    setMnodo(nodo: TNodo){
        this.mnodo = nodo;
    }
    
    setCnodo(nodo: TNodo){
        this.cnodo = nodo;
    }

    setEcamara(camara: TCamara){
        this.ecamara = camara;
    }

    getId(): number{
        return this.mallas[0].getId();
    }

    setSeleccionado(sele){
        this.mallas.forEach((element) => {
            element.setSeleccionado(sele);
          });
    }

    setHoveado(sele){
        this.mallas.forEach((element) => {
            element.setHoveado(sele);
          });
    }

    setLuces(luces: TNodo[]){
        this.luces = luces;
    }

    getMalla(): TMalla{
        return this.mallas[0];
    }

    getModelMatrix(): glm.mat4 {
        return this.modelMatrix;
    }

    setModelMatrix(newMatrix: glm.mat4): void {
        this.modelMatrix = newMatrix;
    }

    setRecursoMaterial(mat : TRecursoMaterial){
    }
}