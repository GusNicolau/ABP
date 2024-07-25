import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor(private router: Router) { }

  // PERSONALIZAR AQUI CADA MENU PARA CADA ROL DE USUARIO DIFERENTE
  menuBasico: sidebarItem[]=[
    {titulo: 'Inicio', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Ejercicios', icono: 'mdi mdi-dumbbell', sub: false, url: '/dashboard/ejercicios'},
    {titulo: 'Listas', icono: 'mdi mdi-format-list-bulleted', sub: false, url: '/dashboard/listas'},
    {titulo: 'Modelo 3D', icono: 'mdi mdi-arrow-right-drop-circle', sub: false, url: '/three'},
    {titulo: 'Web Corporativa', icono: 'mdi mdi-home', sub: false, url: '/corp'}
  ];
  menuAdmin: sidebarItem[]=[
    {titulo: 'Dashboard', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Gestión de Ejercicios', icono: 'mdi mdi-dumbbell', sub: true, subMenu: [
      {titulo: 'Nuevo Ejercicio', icono: 'mdi mdi-playlist-plus', url: '/dashboard/nuevoEjercicio'},
      {titulo: 'Ver Ejercicios', icono: 'mdi mdi-format-list-bulleted', url: '/dashboard/ejercicios'},
    ]},
    {titulo: 'Gestión de Usuarios', icono: 'mdi mdi-account-circle', sub: true, subMenu: [
      {titulo: 'Nuevo Usuario', icono: 'mdi mdi-account-plus', url: '/dashboard/nuevoUsuario'},
      {titulo: 'Ver Usuarios', icono: 'mdi mdi-account-multiple-outline', url: '/dashboard/usuarios'},
    ]},
    {titulo: 'Modelo 3D', icono: 'mdi mdi-arrow-right-drop-circle', sub: false, url: '/three'},
    {titulo: 'Web Corporativa', icono: 'mdi mdi-home', sub: false, url: '/corp'}
  ];
  menuPremium: sidebarItem[]=[
    {titulo: 'Inicio Premium', icono: 'mdi mdi-view-dashboard', sub: false, url: '/dashboard'},
    {titulo: 'Ejercicios', icono: 'mdi mdi-blur-radial', sub: false, url: '/dashboard/ejercicios'},
    {titulo: 'Contacto', icono: 'mdi mdi-contact-mail', sub: false, url: '/dashboard/contacto'},
    {titulo: 'Otro', icono: 'mdi mdi-multiplication', sub: false, url: 'dashboard/otro'},
    {titulo: 'Submenu', icono: 'mdi mdi-arrow-down', sub: true, subMenu: [
      {titulo: 'Opcion 1', icono: 'mdi mdi-nuemric-1-box-outline', url: '/dashboard/uno'},
      {titulo: 'Opcion 2', icono: 'mdi mdi-nuemric-2-box-outline', url: '/dashboard/dos'},
    ]},
  ];

  navigateTo(url: string): void {
    if (url.startsWith('http')) {
      window.location.href = url; // Redirigir a una URL externa
    } else {
      this.router.navigateByUrl(url); // Utilizar el enrutador de Angular para URL internas
    }
  }




  getmenu() {
    const rol = localStorage.getItem('rol');
    switch (rol) {
      case 'ROL_ADMIN':
        return this.menuAdmin;
      case 'ROL_BASICO':
        return this.menuBasico;
      case 'ROL_PREMIUM':
        return this.menuPremium;
    }
    return [];
  }

}
