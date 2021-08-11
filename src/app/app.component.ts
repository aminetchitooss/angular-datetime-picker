import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as localFR from 'date-fns/locale/fr';
import * as localUS from 'date-fns/locale/en-US';
import { DatePickerOptions } from '@tchitos/datetime-picker';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as pkg from '../../projects/tchitos/datetime-picker/package.json';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  show = true;
  version = pkg.version;
  formGroup: FormGroup;
  today = new Date();
  options1: DatePickerOptions = {
    placeholder: 'Start date',
    enableHour: true
  };
  optionUpdate1: BehaviorSubject<DatePickerOptions> = new BehaviorSubject<DatePickerOptions>({});

  options2: DatePickerOptions = {
    format: 'LLLL do yyyy',
    placeholder: 'End date'
  };
  optionUpdate2: BehaviorSubject<DatePickerOptions> = new BehaviorSubject<DatePickerOptions>({});

  constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
      date1: [null, [Validators.required]],
      date2: [new Date(), Validators.required]
    });
  }

  toFrench() {
    this.options2 = {
      ...this.options2,
      locale: localFR.default
    };
    this.optionUpdate2.next(this.options2);
    this.options1 = {
      ...this.options1,
      format: 'dd/MM/yyyy',
      locale: localFR.default
    };
    this.optionUpdate1.next(this.options1);
  }

  toEnglish() {
    this.options2 = {
      ...this.options2,
      locale: localUS.default
    };
    this.optionUpdate2.next(this.options2);
    this.options1 = {
      ...this.options1,
      format: 'MM/dd/yyyy',
      locale: localUS.default
    };
    this.optionUpdate1.next(this.options1);
  }

  isDisabled = false;

  toggleDisable() {
    this.formGroup.controls.date1[this.isDisabled ? 'enable' : 'disable']();
    this.isDisabled = !this.isDisabled;
  }
}
