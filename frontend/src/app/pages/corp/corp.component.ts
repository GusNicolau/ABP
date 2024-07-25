import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-corp',
  templateUrl: './corp.component.html',
  styleUrls: ['./corp.component.css']
})
export class CorpComponent implements OnInit{

  ngOnInit(): void {
    window.location.href= 'https://tecnicfit.ovh/noname7'
  }

}
