import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as localFR from 'date-fns/locale/fr';
import * as localUS from 'date-fns/locale/en-US';
import { DatePickerOptions } from '@tchitos/datetime-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  formGroup: FormGroup
  localTimeZone: BehaviorSubject<Locale> = new BehaviorSubject<Locale>(localFR.default);

  options: DatePickerOptions = {
    format: 'dd/MM/yyyy',
    enableHour: true
  };

  options2: DatePickerOptions = {
    calendarClass: 'material',
    scrollBarColor: '#ffffff',
    format: 'LLLL do yyyy'
  };

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      date1: [new Date(), [Validators.required]],
      date2: [new Date(), Validators.required]
    })
  }

  toEn() {
    this.options2.format = 'MM/dd/yyyy';
    this.localTimeZone.next(localUS.default)
  }
  
  toFr() {
    this.options2.format = 'dd/MM/yyyy';
    this.localTimeZone.next(localFR.default)
  }

}
