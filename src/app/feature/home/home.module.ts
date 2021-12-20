import { DashboardComponent } from './dashboard/dashboard.component';
import { FoodModule } from '../food/food.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { LandingComponent } from './landing/landing.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { VitalsComponent } from './vitals/vitals.component';

@NgModule({
  declarations: [
    DashboardComponent,
    LandingComponent,
    VitalsComponent,
    HomeComponent,
  ],
  imports: [
    SharedModule,
    RouterModule,
    HomeRoutingModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatCardModule,
    MatListModule,
    MatProgressBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTooltipModule,
    FoodModule,
  ],
  providers: [],
  exports: []
})
export class HomeModule {}
