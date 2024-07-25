import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivationEnd, RouterEvent, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public breadcrums: any[] = [];
  private subs$: Subscription;

  constructor(private router: Router) {
    this.subs$ = this.cargarDatos().subscribe( data => {
      console.log(data);
      this.titulo = data?.['titulo'];
      this.breadcrums = data?.['breadcrums'];
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    console.log('Salimos de breadcrums');
    this.subs$.unsubscribe();
  }

  cargarDatos() {
    return this.router.events
    .pipe(
      filter( (event: any) => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
      map( (event: ActivationEnd) => event.snapshot.data )
    );
  }

}
