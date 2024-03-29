# Angular DateTimePickerLibrary

[![npm](https://img.shields.io/npm/v/@tchitos/datetime-picker.svg?maxAge=2592000?style=flat-square)](https://www.npmjs.com/package/@tchitos/datetime-picker)
[![npm](https://img.shields.io/npm/dm/@tchitos/datetime-picker.svg)](https://www.npmjs.com/package/@tchitos/datetime-picker)

Angular dateTime picker - This package supports Angular 16+
Checkout the [Demo](https://aminetchitooss.github.io/angular-datetime-picker/)

## Installation

1. Install package from `npm`.

```sh
npm install @tchitos/datetimePicker --save
```

2. Include DatetimePickerModule into your application.

```ts
//...
import { DatetimePickerModule } from '@tchitos/datetime-picker';

@NgModule({
  imports: [..., DatetimePickerModule]
})
export class SomeModule {}
```

And that's it, you can then use it in your component as:

```ts
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePickerOptions } from '@tchitos/datetime-picker';


options: DatePickerOptions = {
  placeholder: 'Start date',
  enableHour: true
};

formGroup: FormGroup;

constructor(private fb: FormBuilder) {
    this.formGroup = this.fb.group({
        date: [new Date() ]
    })
}
```

```html
<form [formGroup]="formGroup">
  <ngx-datetimePicker [options]="options" formControlName="date"> </ngx-datetimePicker>
</form>
```

## Options

Then you apply custom options in your template as:

```ts
today = new Date();
```

```html
<form [formGroup]="formGroup">
  <ngx-datetimePicker formControlName="date" [minDate]="today"> </ngx-datetimePicker>
</form>
```

## All the properties for `DatePickerOptions` are optional

| Name                 | Type      | Default                    | Description                                                                        |
| :--------------------| :-------- | :------------------------- | :--------------------------------------------------------------------------------- |
| `minYear`            | `number`  | `getYear(new Date()) - 20` | minimum available and selectable year                                              |
| `maxYear`            | `number`  | `getYear(new Date()) + 20` | maximum available and selectable year                                              |
| `placeholder`        | `string`  | ``                         | placeholder in case date model is null or undefined, example: 'Please pick a date' |
| `format`             | `string`  | `dd/MM/yyyy`               | date format to display in input                                                    |
| `formatTitle`        | `string`  | `LLLL yyyy`                | date format to change view                                                         |
| `formatDays`         | `string`  | `EEEEE`                    |                                                                                    |
| `firstCalendarDay`   | `number`  | `0`                        | 0 - Sunday, 1 - Monday                                                             |
| `locale`             | `Locale`  | `0`                        | date-fns locale                                                                    |
| `position`           | `string`  | `bottom`                   | date-fns locale                                                                    |
| `inputClass`         | `string`  | `datepicker-input`         | custom input CSS class to be applied                                               |
| `calendarClass`      | `string`  | `datepicker-default`       | custom datepicker calendar CSS class to be applied                                 |
| `scrollBarColor`     | `string`  | `#dfe3e9`                  | in case you customize you theme, here you define scroll bar color                  |
| `enableKeyboard`     | `boolean` | `true`                     | enable keyboard events                                                             |
| `enableHour`         | `boolean` | `false`                    | enable time picker                                                                 |

For available `format`, `formatTitle` and `formatDays` options check out [here](https://date-fns.org/docs/format).

### You can also update your options in your template as:

```ts
import { DatePickerOptions } from '@tchitos/datetime-picker';
import * as localFR from 'date-fns/locale/fr';
import * as localUS from 'date-fns/locale/en-US';

  optionUpdate: BehaviorSubject<DatePickerOptions> = new BehaviorSubject<DatePickerOptions>({});

// options sample with default values
  options: DatePickerOptions = {
      format: 'dd/MM/yyyy',
      enableHour: true//enabling the time
    };


  changeToFrench() {
    this.options = {
      ...this.options,
      format: 'dd/MM/yyyy',// french date format is day/month/year
      locale: localFR.default // changing the datepicker's language to french
    }
    this.optionUpdate.next(this.options)
  }

  changeToEnglish() {
    this.options = {
      ...this.options,
      format: 'MM/dd/yyyy', // USA date format is month/day/year
      locale: localUS.default // changing the datepicker's language to english
    }
    this.optionUpdate.next(this.options)
  }

// to enable and disable

  isDisabled = false;

  toggleDisable() {
    this.formGroup.controls.date[this.isDisabled ? 'enable' : 'disable']();
    this.isDisabled = !this.isDisabled;
  }

```

```html
<form [formGroup]="formGroup">
  <ngx-datetimePicker formControlName="date" [options]="options" [optionUpdate]="optionUpdate"> </ngx-datetimePicker>

  <h2>Change the formatv and langugae of the date picker</h2>

  <button (click)="changeToFrench()">French (France)</button>
  <button (click)="changeToEnglish()">English (USA)</button>

  <h2>Enable /disable</h2>

  <button (click)="toggleDisable()">{{ isDisabled ? "enable" : "disable" }}</button>
</form>
```

## Theme customization

This examples uses SASS as style preprocessor.

```scss
.material {
  .calendar-container {
    background-color: #493c80;
    border: 1px solid #493c80;
  }
}
```

And in your component:

```ts
import { DatepickerOptions } from "@tchitos/datetime-picker";

options: DatepickerOptions = {
  calendarClass: "material"
};
```

## Run Project

1. Clone this repository.

```sh
git clone https://github.com/aminetchitooss/angular-datetime-picker
```

2. Install dependencies

```sh
npm install
```

3. Start the demo

```sh
npm start
```

## License

MIT
