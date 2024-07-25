// Aquí se importan y especifican los diferentes componentes
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './commons/footer/footer.component';
import { PagesModule } from './pages/pages.module';
import { AuthModule } from './auth/auth.module';
import { BaseChartDirective } from 'ng2-charts';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LineChartComponent } from './components/line-chart/line-chart.component';

import { NgxChartsModule } from '@swimlane/ngx-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';






// si quiero que otros componentes aparezcan en app.component.html,
// debo hacer el import primero en este nivel.


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,







  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    PagesModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgxChartsModule


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
