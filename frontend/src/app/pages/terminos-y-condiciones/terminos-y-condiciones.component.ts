import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();


@Component({
  selector: 'app-terminos-y-condiciones',
  templateUrl: './terminos-y-condiciones.component.html',
  styleUrls: ['./terminos-y-condiciones.component.css']
})
export class TerminosYCondicionesComponent implements OnInit {

  public ngOnInit(): void{


    iniciarCustom();
  }


}
