import { SidebarService } from 'src/app/services/sidebar.service';
import { sidebarItem } from './../../interfaces/sidebar.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menu: sidebarItem[]=[];
  constructor(private sidebar: SidebarService) {
  }

  ngOnInit(): void {
    this.menu = this.sidebar.getmenu();
    console.log(this.menu);
  }

}
