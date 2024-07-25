import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { authGuard } from '../guards/auth.guard';

import { AdminLayoutComponent } from './../layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ContactoComponent } from './contacto/contacto.component';
import { PlanesComponent } from './planes/planes.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { TestComponent } from './test/test.component';
import { ThreeComponent } from './three/three.component';
import { NuevoEjercicioComponent } from './nuevo-ejercicio/nuevo-ejercicio.component';
import { NuevouUsuarioComponent } from './nuevou-usuario/nuevou-usuario.component';
import { CorpComponent } from './corp/corp.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ListasComponent } from './listas/listas.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { TerminosYCondicionesComponent } from './terminos-y-condiciones/terminos-y-condiciones.component';

const routes: Routes = [
  //{ path: 'three', component: ThreeComponent, data: {titulo: 'Three', breadcrums: [{titulo: 'Three', url: '/three'}]},},
  { path: 'test', component: TestComponent, data: { titulo: 'Test', breadcrums: [{ titulo: 'Test', url: '/test' }] }, },
  { path: 'privacy', component: PrivacyComponent, data: {titulo: 'Privacy', breadcrums: [{titulo: 'Privacy', url: '/privacy'}]},},
  { path: 'terminos', component: TerminosYCondicionesComponent, data: {titulo: 'Terminos', breadcrums: [{titulo: 'Terminos', url: '/terminos'}]},},
  { path: 'corp', component: CorpComponent, data: {titulo: 'Corp', breadcrums: [{titulo: 'Corp', url: '/corp'}]},},
  { path: 'dashboard', component: AdminLayoutComponent, canActivate: [authGuard],
    children: [
      { path: '', component: DashboardComponent, data: { titulo: 'Dashboard', breadcrums: [] }, },
      { path: 'nuevoUsuario', component: NuevouUsuarioComponent, data: { titulo: 'Nuevo Usuario', breadcrums: [{ titulo: 'Nuevo Usuario', url: '/dashboard/nuevoUsuario' }] }, },
      { path: 'usuarios', component: UsuariosComponent, data: { titulo: 'Usuarios', breadcrums: [{ titulo: 'usuarios', url: '/dashboard/usuarios' }] }, },
      { path: 'nuevoEjercicio', component: NuevoEjercicioComponent, data: { titulo: 'Nuevo Ejercicio', breadcrums: [{ titulo: 'Nuevo Ejercicio', url: '/dashboard/nuevoEjercicio' }] }, },
      { path: 'ejercicios', component: EjerciciosComponent, data: { titulo: 'Ejercicios', breadcrums: [{ titulo: 'Ejercicios', url: '/dashboard/ejercicios' }] }, },
      //{ path: 'three', component: ThreeComponent, data: { titulo: 'Three', breadcrums: [{ titulo: 'Three', url: '/dashboard/three' }] }, },
      { path: 'listas', component: ListasComponent, data: { titulo: 'Listas', breadcrums: [{ titulo: 'Listas', url: '/dashboard/listas' }] }, },
      { path: '**', redirectTo: '' }

    ]
  },
  { path: 'chatbot', component: ChatbotComponent, data: { titulo: 'Chatbot', breadcrums: [{ titulo: 'Chatbot', url: '/chatbot' }] }, }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
