// item-list.component.ts

import { Component, OnInit } from '@angular/core';
import { ExerciceService } from '../../services/exercice.service';
import { PopupService } from '../../services/popup.service';
import { UploadsService } from '../../services/uploads.service';
import { PopupActualizarService } from '../../services/popupActualizar.service';
//import * as echarts from 'echarts';

import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private exerciseService: ExerciceService,
    private popupService: PopupService,
    private popupActualizarService: PopupActualizarService,
    private uploadService: UploadsService,
    private router: Router,) { }

    usuarioAdmin: boolean = false;

    listasDeEjercicios: any[] = [];





  ngOnInit() {

    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/three');
    }



  }

  crearPrimeraLista(): void {

    this.router.navigateByUrl('dashboard/listas');
  }
}

