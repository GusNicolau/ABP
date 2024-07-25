import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { RegistryComponent } from './registry/registry.component';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { HttpClientModule } from '@angular/common/http';

// utilizar --flat para que cree .ts directamente en vez de que lo haga con carpeta

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent,
    RegistryComponent
  ],
  exports: [
    AuthLayoutComponent,
    LoginComponent,
    RecoveryComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ]
})
export class AuthModule { }
