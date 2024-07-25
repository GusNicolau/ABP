import { Component, OnInit } from '@angular/core';

declare function iniciarCustom();

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent {

  public ngOnInit(): void{


    iniciarCustom();
  }

}
