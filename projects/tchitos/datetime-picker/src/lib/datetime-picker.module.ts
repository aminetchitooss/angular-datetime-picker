import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { DatetimePickerComponent } from './datetime-picker.component';



@NgModule({
  declarations: [
    DatetimePickerComponent
  ],
  imports: [
    CommonModule, FormsModule, NgSlimScrollModule
  ],
  exports: [
    DatetimePickerComponent
  ]
})
export class DatetimePickerModule { }
