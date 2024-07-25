import * as glm from 'gl-matrix';

export abstract class TRecurso {
    private nombre: string; //el path o ruta absoluta

    constructor(nombre: string) {
        this.nombre = nombre;
    }

    getNombre(): string {
        return this.nombre;
    }

    setNombre(nuevoNombre: string) {
        this.nombre = nuevoNombre;
    }

}