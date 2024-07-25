import { Component, ViewChild, ElementRef } from '@angular/core';
import { ThreeService } from './three.service';
import { Router } from '@angular/router';



declare function iniciarCustom();

@Component({
  selector: 'app-pages-three',
  templateUrl: './three.component.html',
  styleUrls: ['./three.component.css']
})
export class ThreeComponent {
// el decorador viewchild permite acceder a un elemento del DOM HTML y obtener una referencia
  // a esta etiqueta para hacer cosas con el.
  @ViewChild('rendererCanvas', {static: true}) public rendererCanvas !: ElementRef<HTMLCanvasElement>;

  public constructor(private engServ: ThreeService, private router: Router) {

  }

  usuarioAdmin: boolean = false;

  public ngOnInit(): void {
    iniciarCustom();
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();

    if(localStorage.getItem('rol') == 'ROL_ADMIN'){

      this.usuarioAdmin = true;

    }
    else{
      this.router.navigateByUrl('/test');
    }

  }
}
