import { Component, OnInit } from '@angular/core';
import { multi } from '../../components/line-chart/data';

declare function iniciarCustom();
declare function iniciarSidebarmenu();

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit {

  
  ngOnInit(): void {
    iniciarCustom();
    iniciarSidebarmenu();
  }

  
 

}
