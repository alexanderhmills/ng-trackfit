import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementListComponent } from './measurement-list/measurement-list.component';
import { MeasurementCreateEditComponent } from './measurement-create-edit/measurement-create-edit.component';
import { MeasurementService } from '../_services/measurement.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MeasurementListComponent,
    MeasurementCreateEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    AngularMaterialModule,
    ReactiveFormsModule
  ],
  providers: [MeasurementService]
})
export class MeasurementModule { }
