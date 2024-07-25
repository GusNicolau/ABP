import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecoveryComponent } from './recovery/recovery.component';
import { RegistryComponent } from './registry/registry.component';
import { LoginComponent } from './login/login.component';
import { AuthLayoutComponent } from './../layouts/auth-layout/auth-layout.component';
import { NoauthGuard } from '../guards/noauth.guard';

const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent, canActivate: [NoauthGuard],
    children: [
      { path: '', component: LoginComponent}
    ]
  },
  /*{ path: 'recovery', component: AuthLayoutComponent, canActivate: [NoauthGuard],
  children: [
    { path: '', component: RecoveryComponent}
  ]
  },
  { path: 'registry', component: AuthLayoutComponent, canActivate: [NoauthGuard],
  children: [
    { path: '', component: RegistryComponent}
  ]
  }*/
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
