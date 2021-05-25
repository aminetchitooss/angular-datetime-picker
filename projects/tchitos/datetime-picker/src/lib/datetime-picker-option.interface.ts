import { getYear, Locale } from 'date-fns';
import locale from 'date-fns/locale/fr';

export interface DatePickerOptions {
  minYear?: number;
  maxYear?: number;
  placeholder?: string;
  format?: string;
  formatTitle?: string;
  formatDays?: string;
  firstCalendarDay?: number;
  locale?: Locale;
  position?: 'left' | 'right' | 'bottom' | 'top';
  inputClass?: string;
  calendarClass?: string;
  scrollBarColor?: string;
  enableKeyboard?: boolean;
  enableHour?: boolean;
}

export function mergeDatePickerOptions(opts: DatePickerOptions): DatePickerOptions {
  return { ...defaultOptions, ...opts };
}

export const defaultOptions: DatePickerOptions = {
  minYear: getYear(new Date()) - 20,
  maxYear: getYear(new Date()) + 20,
  placeholder: '',
  format: 'dd/MM/yyyy',
  formatTitle: 'LLLL yyyy',
  formatDays: 'EEEEE',
  firstCalendarDay: 0,
  locale,
  position: 'bottom',
  inputClass: 'datepicker-input',
  calendarClass: 'datepicker-default',
  scrollBarColor: '#dfe3e9',
  enableKeyboard: true,
  enableHour: false
};
