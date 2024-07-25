// exercice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExerciceService {

  constructor(private http: HttpClient) { }

  getItems(): Observable<any[]> {
    // Llamada a la api para obtener lista ejercicios
    return this.http.get<any[]>(`${environment.base_url}/items`);
  }

  // Lo utilizamos para comprobar ejercicios con ese filtro
  buscador(filtro: any): Observable<any[]> {
    // Llamada a la api para obtener lista ejercicios FILTRADA (POR TITULO DE MOMENTO)
    console.log(`${environment.base_url}/items/filtrado`, { params: filtro });
    return this.http.get<any[]>(`${environment.base_url}/items/filtrado`, { params: filtro });
  }

  // Lo utilizamos para comprobar que no existe ya un ejercicio al crearlo
  getEjercicio(titulo: any): Observable <boolean>{

    return this.http.get<any>(`${environment.base_url}/items/${titulo}`).pipe(
      map(response => response.existe),
      catchError(error => {
        console.error('Error al buscar ejercicio:', error);
        return of(false); // Devuelve false en caso de error
      })
    );
  };



  postItems( formData: any ) {
    return this.http.post(`${environment.base_url}/items`, formData, this.cabeceras);
  }

  putItems(formData: any, id: any) {

    return this.http.put(`${environment.base_url}/items/`+ id, formData, this.cabeceras);

  }

  deleteItems(id: any) {
    return this.http.delete(`${environment.base_url}/items/`+ id, this.cabeceras);
  }

  get cabeceras(){
    return{
      headers: {

        'x-token': this.token
      }
    };


  }
  get token(): string {
    return localStorage.getItem('token') || '';
  }

}
