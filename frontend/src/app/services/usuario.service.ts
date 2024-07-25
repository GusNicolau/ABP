import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginForm } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { tap, map, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor( private http: HttpClient, private router: Router) { }

  registry( formData: any) {

    //console.log('Registro desde el Usuario.service:', formData);

    return this.http.post(`${environment.base_url}/usuarios`, formData).pipe
      (tap( (res:any) => {

        console.log(res);
        localStorage.setItem('token', res['token']);
        localStorage.setItem('rol', formData['rol']);

      })
    );

  }

  login( formData: any ) {

    //console.log('Login desde el Usuario.service:', formData);

    return this.http.post(`${environment.base_url}/login`, formData).pipe(
      tap( (res:any) => {
        if(res.usuarioBD.rol != 'ROL_BASICO'){

          localStorage.setItem('token', res['token']);
          localStorage.setItem('rol', formData['rol']);
        }

      })
    );

  }

  searcher(filtro: any): Observable<any[]> {
    // Llamada a la api para obtener lista usuarios FILTRADA (POR NOMBRE DE MOMENTO)
    return this.http.get<any[]>(`${environment.base_url}/usuarios/filtrado/` + filtro.nombre, this.cabeceras);
  }

  logout() {
    this.limpiarLocalStorage();
    this.router.navigateByUrl('/login');
  }

  logoutPublic() {
    this.limpiarLocalStorage();

  }

  getUsuarios(): Observable<any[]> {
    // Llamada a la api para obtener lista ejercicios
    return this.http.get<any[]>(`${environment.base_url}/usuarios`, this.cabeceras);
  }

  getFavoritos(id: any): Observable<any[]> {
    // Llamada a la api para obtener lista ejercicios
    return this.http.get<any[]>(`${environment.base_url}/usuarios/` + id, this.cabeceras);
  }



  putUsuarios(formData: any, id: any) {

    return this.http.put(`${environment.base_url}/usuarios/`+ id, formData, this.cabeceras);

  }

  putFavoritos(formData: any, id: any) {

    return this.http.put(`${environment.base_url}/usuarios/`+ id, formData, this.cabeceras);

  }

  putContra(formData: any, id: any) {

    return this.http.put(`${environment.base_url}/usuarios/psw/`+ id, formData, this.cabeceras);

  }

  deleteUsuarios(id: any) {
    return this.http.delete(`${environment.base_url}/usuarios/`+ id, this.cabeceras);
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {

    const token = localStorage.getItem('token') || '';
    if(token === '') {
      this.limpiarLocalStorage();
      return of(incorrecto);
    }
    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (res:any) => {
        localStorage.setItem('token', res['token']);
        localStorage.setItem('rol', res['rol']);
        console.log('Token renovado');
      }),
      map( res => {
        return correcto;
      }),
      catchError( err => {
        console.warn(err);
        this.limpiarLocalStorage();
        return of(incorrecto);
      })
    )
  }

  validarToken(): Observable<boolean> {
    return this.validar(true, false);
    //Borrar fragmento de codigo cuando se compruebe que funciona
    /*const token = localStorage.getItem('token') || '';
    if(token === '') {
      return of(false);
    }
    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (res:any) => {
        localStorage.setItem('token', res['token']);
        console.log('Token renovado');
      }),
      map( resp => {
        return true;
      }),
      catchError( err => {
        console.warn(err);
        localStorage.removeItem('token');
        return of(false);
      })
    )*/
  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);
    //Borrar fragmento de codigo cuando se compruebe que funciona
    /*const token = localStorage.getItem('token') || '';
    if(token === '') {
      return of(true);
    }
    return this.http.get(`${environment.base_url}/login/token`, {
      headers: {
        'x-token': token
      }
    }).pipe(
      tap( (res:any) => {
        localStorage.setItem('token', res['token']);
      }),
      map( res => {
        return false;
      }),
      catchError( err => {
        console.warn(err);
        localStorage.removeItem('token');
        return of(true);
      })
    )*/
  }

  limpiarLocalStorage() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('uid');
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
