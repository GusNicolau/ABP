// exercice.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadsService {

  constructor(private http: HttpClient) { }

  uploadPhoto(file: File) {
    const formData = new FormData();
    formData.append('photo', file);

  }

  getFoto(): Observable<any[]> {
    
    return this.http.get<any[]>(`${environment.base_url}/upload/foto/prueba`);
  }

  postFoto( archivo: any ) {

    const formData = new FormData();
    formData.append('archivo', archivo);
    console.log(formData);
    return this.http.post(`${environment.base_url}/upload/foto/prueba`, formData, this.cabeceras);
  }

  deleteFoto(nombre: any){
    
    return this.http.delete(`${environment.base_url}/upload/foto/${nombre}`, this.cabeceras);
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
