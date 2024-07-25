import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class NoauthGuard implements CanActivate {

  constructor(private usuarioService: UsuarioService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usuarioService.validarNoToken().pipe(
      tap( resp => {
        if(!resp) {
          this.router.navigateByUrl('/dashboard');
        }
      })
    );
  }

}

