import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

// Al incluir la ruta aquí, se importa el componente automáticamente

const routes: Routes = [

  // /login y /recovery las atiende /auth
  // /dashboard, /admin y /usuarios lo atiende /pages

  // Si incluye algo que no sea ninguna de las opciones anteriores, mando a /login
  {  path: '**', redirectTo: 'test'}

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    AuthRoutingModule,
    PagesRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
