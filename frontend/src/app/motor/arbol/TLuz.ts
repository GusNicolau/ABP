import { TEntidad } from './TEntidad';
import * as glm from 'gl-matrix';

const tipos = {
    DIRECCIONAL: 'DIRECCIONAL',
    PUNTUAL: 'PUNTUAL',
    FOCAL: 'FOCAL'
}

export class TLuz extends TEntidad {
    intensidad: glm.vec3;
    tipoLuz: string;
    direccion: glm.vec3;

    constructor(intensidad: glm.vec3, direccion: glm.vec3) {
        super(); // Llama al constructor de la clase padre

        this.intensidad = intensidad;
        this.tipoLuz = tipos.DIRECCIONAL;
        this.direccion = [1, 0, 0];
    }

    setIntensidad(intensi: glm.vec3) {
        this.intensidad = intensi;
    }

    getIntensidad(): glm.vec3 {
        return this.intensidad;
    }

    setTipoLuz(tipo: string) {
        this.tipoLuz = tipo;
        ////??????????
    }

    getTipoLuz(): string {
        return this.tipoLuz;
    }

    dibujar(matri: glm.mat4) {
        // Método sobrecargado de la clase padre
    }
}