import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { SidebarComponent } from '../commons/sidebar/sidebar.component';
import { NavbarComponent } from '../commons/navbar/navbar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { BreadcrumbComponent } from '../commons/breadcrumb/breadcrumb.component';
import { ProgressbarComponent } from './../components/progressbar/progressbar.component';
import { ContactoComponent } from './contacto/contacto.component';
import { EjerciciosComponent } from './ejercicios/ejercicios.component';
import { PlanesComponent } from './planes/planes.component';
import { PopupCourseComponent } from '../components/popup-course/popup-course.component';
import { PopupActComponent } from '../components/popup-act/popup-act.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { TestComponent } from './test/test.component';
import { ThreeComponent } from './three/three.component';
import { NuevoEjercicioComponent } from './nuevo-ejercicio/nuevo-ejercicio.component';
import { NuevouUsuarioComponent } from './nuevou-usuario/nuevou-usuario.component';
import { PopupUsuarioComponent } from './../components/popup-usuario/popup-usuario.component';
import { PopupActUsuarioComponent } from './../components/popup-act-usuario/popup-act-usuario.component';
import { CorpComponent } from './corp/corp.component';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotService } from './chatbot/chatbot.service';
import { ListasComponent } from './listas/listas.component';
import { LoginButtonComponent } from '../components/login-button/login-button.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { BaseChartDirective } from 'ng2-charts';
import { LineChartComponent } from '../components/line-chart/line-chart.component';
import { PieChartComponent } from '../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../components/bar-chart/bar-chart.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { PrivacyPopupComponent } from '../components/privacy-popup/privacy-popup.component';
import { TerminosYCondicionesComponent } from './terminos-y-condiciones/terminos-y-condiciones.component';


@NgModule({

  schemas:[CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AdminLayoutComponent,
    SidebarComponent,
    NavbarComponent,
    DashboardComponent,
    UsuariosComponent,
    BreadcrumbComponent,
    ProgressbarComponent,
    ContactoComponent,
    EjerciciosComponent,
    PlanesComponent,
    PopupCourseComponent,
    PopupActComponent,
    TestComponent,
    ThreeComponent,
    NuevoEjercicioComponent,
    NuevouUsuarioComponent,
    PopupActUsuarioComponent,
    PopupUsuarioComponent,
    CorpComponent,
    ChatbotComponent,
    ListasComponent,
    LoginButtonComponent,
    PrivacyComponent,
    LineChartComponent,
    PieChartComponent,
    BarChartComponent,
    PrivacyPopupComponent,
    TerminosYCondicionesComponent,
    
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    FormsModule,
    NgxChartsModule
  ],
  exports: [ChatbotComponent],
  providers: [ChatbotService]

})
export class PagesModule { }
