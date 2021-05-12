import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  HostListener,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Inject,
  ChangeDetectorRef
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ISlimScrollEvent, ISlimScrollOptions, SlimScrollOptions, SlimScrollEvent } from 'ngx-slimscroll';
import { DatePickerOptions, mergeDatePickerOptions, defaultOptions } from './datetime-picker-option.interface';
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  getDate,
  getMonth,
  getYear,
  isToday,
  isSameDay,
  isSameMonth,
  isSameYear,
  isBefore,
  isAfter,
  getDay,
  subDays,
  setDay,
  format,
  addMonths,
  subMonths,
  setYear,
  addYears,
  subYears
} from 'date-fns';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface Day {
  date: Date;
  day: number;
  month: number;
  year: number;
  inThisMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isSelectable: boolean;
}

@Component({
  selector: 'ngx-datetimePicker',
  templateUrl: './datetime-picker.component.html',
  styleUrls: ['./datetime-picker.component.scss'],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: DatetimePickerComponent, multi: true }]
})
export class DatetimePickerComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  @Input() options: DatePickerOptions = { ...defaultOptions };
  @Input() scrollOptions: SlimScrollOptions = new SlimScrollOptions(this.scrollBarOptions);
  @Input() isOpened: any = false;
  @Input() LocalTimeZone: Observable<Locale> = new Observable<Locale>();
  subsTimeZone: Subscription = new Subscription();

  innerValue: Date = new Date();
  hour: string = [this.prefixNumber(this.innerValue.getHours()), this.prefixNumber(this.innerValue.getMinutes())].join(':')
  displayValue = '';
  view: 'days' | 'years' = 'days';
  date: Date = new Date();
  years: { year: number; isThisYear: boolean }[] = [];
  days: Day[] = [];
  dayNames: string[] = [];
  scrollEvents = new EventEmitter<ISlimScrollEvent>();
  sub: Subscription = new Subscription();
  private doc?: Document;

  get value(): Date {
    return this.innerValue;
  }

  set value(val: Date) {
    if (this.options.enableHour) {
      val.setHours(Number(this.hour.split(':')[0]), Number(this.hour.split(':')[1]))
    }
    this.innerValue = val;
    this.updateDate()
  }

  constructor(public elementRef: ElementRef, private ref: ChangeDetectorRef, @Inject(DOCUMENT) document?: any) {
    this.doc = document as Document;
  }

  get title(): string {
    return format(this.date, this.options.formatTitle as string, { locale: this.options.locale });
  }

  private get scrollBarOptions(): ISlimScrollOptions {
    return {
      barBackground: (this.options && this.options.scrollBarColor) || '#dfe3e9',
      gridBackground: 'transparent',
      barBorderRadius: '3',
      gridBorderRadius: '3',
      barWidth: '6',
      gridWidth: '6',
      barMargin: '0',
      gridMargin: '0'
    };
  }

  ngOnInit(): void {
    this.view = 'days';
    this.date = new Date();
    this.init();
    this.subsTimeZone = this.LocalTimeZone.subscribe((_: Locale) => {
      this.options.locale = _
      this.initDayNames()
      this.updateDate()
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('options' in changes) {
      this.options = mergeDatePickerOptions(this.options);
      this.scrollOptions = new SlimScrollOptions(this.scrollBarOptions);

      if (this.sub) {
        this.sub.unsubscribe();
      }

      if (this.subsTimeZone) {
        this.subsTimeZone.unsubscribe();
      }

      if (this.options.enableKeyboard) {
        this.sub = fromEvent<KeyboardEvent>(this.doc || document, 'keyup')
          .pipe(filter(() => this.isOpened))
          .subscribe(e => {
            e.preventDefault();
            e.stopPropagation();

            switch (e.key) {
              case 'Down':
              case 'ArrowDown':
                this.prevYear();
                break;
              case 'Up':
              case 'ArrowUp':
                this.nextYear();
                break;
              case 'Left':
              case 'ArrowLeft':
                this.prevMonth();
                break;
              case 'Right':
              case 'ArrowRight':
                this.nextMonth();
                break;
              case 'Esc':
              case 'Escape':
              case 'Enter':
                this.isOpened = false;
                break;
              default:
                return;
            }
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.subsTimeZone.unsubscribe();
  }

  updateDate(): void {
    this.displayValue = format(this.innerValue, this.options.format as string, { locale: this.options.locale });
    this.onChangeCallback(this.innerValue);
  }
  updateHour(): void {
    this.innerValue.setHours(Number(this.hour.split(':')[0]), Number(this.hour.split(':')[1]))
    this.updateDate()
  }

  isTimerSelected(): boolean {
    return document.activeElement == document.getElementById('hour')
  }

  prefixNumber(pNumber: number): string {
    return pNumber.toString().length == 1 ? "0" + pNumber.toString() : pNumber.toString()
  }

  toggle(): void {
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      this.view = 'days';
      this.date = this.value;
      this.initDays();
    }
  }

  toggleView(): void {
    this.view = this.view === 'days' ? 'years' : 'days';
    if (this.view === 'years') {
      this.ref.detectChanges();
      this.scrollToYear();
    }
  }

  nextMonth(): void {
    if (!this.isTimerSelected()) {
      this.date = addMonths(this.date, 1);
      this.initDays();
    }

  }

  prevMonth(): void {
    if (!this.isTimerSelected()) {
      this.date = subMonths(this.date, 1);
      this.initDays();
    }

  }

  nextYear(): void {
    if (!this.isTimerSelected()) {
      this.date = addYears(this.date, 1);
      this.initDays();
    }

  }

  prevYear(): void {
    if (!this.isTimerSelected()) {
      this.date = subYears(this.date, 1);
      this.initDays();
    }
  }

  setDate(i: number): void {
    this.date = this.days[i].date;
    this.value = this.date;
    this.initDays();
    this.isOpened = this.options.enableHour;
  }

  setYear(i: number): void {
    this.date = setYear(this.date, this.years[i].year);
    this.initDays();
    this.initYears();
    this.view = 'days';
  }

  private scrollToYear(): void {
    const parent = this.elementRef.nativeElement.querySelector('.main-calendar-years');
    const el = this.elementRef.nativeElement.querySelector('.year-unit.is-selected');
    const y = el.offsetTop - parent.clientHeight / 2 + el.clientHeight / 2;
    const event = new SlimScrollEvent({ type: 'scrollTo', y, duration: 100 });
    this.scrollEvents.emit(event);
  }

  private init(): void {
    this.initDayNames();
    this.initDays();
    this.initYears();
  }

  private initDays(): void {
    const date = this.date || new Date();
    const [start, end] = [startOfMonth(date), endOfMonth(date)];

    this.days = eachDayOfInterval({ start, end }).map((d: Date) => this.generateDay(d));

    const tmp = getDay(start) - (this.options.firstCalendarDay as number);
    const prevDays = tmp < 0 ? 7 - (this.options.firstCalendarDay as number) : tmp;
    for (let i = 1; i <= prevDays; i++) {
      const d = subDays(start, i);
      this.days.unshift(this.generateDay(d, false));
    }
  }

  private initYears(): void {
    const range = (this.options.maxYear as number) - (this.options.minYear as number) + 1;
    this.years = Array.from(new Array(range), (_, i) => i + (this.options.minYear as number)).map(year => {
      return { year, isThisYear: year === getYear(this.date) };
    });
  }

  private initDayNames(): void {
    this.dayNames = [];
    const start = this.options.firstCalendarDay as number;
    for (let i = start; i <= 6 + start; i++) {
      const date = setDay(new Date(), i);
      this.dayNames.push(format(date, this.options.formatDays as string, { locale: this.options.locale }));
    }
  }

  private generateDay(date: Date, inThisMonth: boolean = true): Day {
    return {
      date,
      day: getDate(date),
      month: getMonth(date),
      year: getYear(date),
      inThisMonth,
      isToday: isToday(date),
      isSelected:
        isSameDay(date, this.innerValue) && isSameMonth(date, this.innerValue) && isSameYear(date, this.innerValue),
      isSelectable: this.isDateSelectable(date)
    };
  }

  private isDateSelectable(date: Date): boolean {
    if (this.options.minDate && (isAfter(this.options.minDate, date) || isSameDay(this.options.minDate, date))) {
      return false;
    }

    if (this.options.maxDate && (isBefore(this.options.maxDate, date) || isSameDay(this.options.maxDate, date))) {
      return false;
    }

    return true;
  }

  writeValue(val: Date): void {
    if (!val) {
      return;
    }
    this.innerValue = val;
    this.displayValue = format(this.innerValue, this.options.format as string, { locale: this.options.locale });
    this.init();
  }

  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  @HostListener('document:click', ['$event']) onBlur(e: MouseEvent): void {
    if (!this.isOpened) {
      return;
    }

    const input = this.elementRef.nativeElement.querySelector('.datepicker-container > input');
    if (!input || e.target === input || input.contains(e.target)) {
      return;
    }

    const container = this.elementRef.nativeElement.querySelector('.datepicker-container > .calendar-container');
    if (
      container &&
      container !== e.target &&
      !container.contains(e.target) &&
      !(e.target as HTMLElement).classList.contains('year-unit')
    ) {
      this.isOpened = (e.target as HTMLElement).classList.contains('day-unit') && this.options.enableHour;
    }
  }
}
