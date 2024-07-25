import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listas',
  templateUrl: './listas.component.html',
  styleUrls: ['./listas.component.css']
})
export class ListasComponent {

  constructor(
    private router: Router){}

    usuarioAdmin: boolean = false;

    ngOnInit() {

      if(localStorage.getItem('rol') == 'ROL_ADMIN'){

        this.usuarioAdmin = true;

      }
      else{
        this.router.navigateByUrl('/test');
      }



    }

}
