import { Component, OnInit } from '@angular/core';
import { DashboardService } from './dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor( private dashServ : DashboardService ) {
    this.dashServ.statusInput.subscribe((status: string) => alert(status));
  }

  ngOnInit(): void {
  }

}
