/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import moment from 'moment';
import 'moment-timezone';
import 'moment/locale/cs';
import 'moment/locale/en-gb';
// import {LocaleConfig} from 'react-native-calendars';

export function formatDate(date: Date, format: string) {
  if (!date) {
    return null;
  }
  return moment(getDateTimezone(date)!).format(format);
}

export function getDateTimezone(date: Date | string) {
  if (!date) {
    return null;
  } else {
    return moment.tz(date, 'Europe/Prague');
  }
}

export function formatDateFromISO(date: string | object, format: string) {
  if (!date) {
    return null;
  }
  if (typeof date === 'object') {
    return moment(date.toString()).format(format);
  } else {
    return moment(getDateTimezone(date)!).format(format);
  }
}

export function formatDateToISO(date: Date) {
  if (date) {
    return moment(date).format('YYYY-MM-DD');
  } else {
    return 'undefined';
  }
}

export function getLocalDate(date: Date) {
  if (date) {
    return moment(date)
      .local()
      .toDate();
  } else {
    return null;
  }
}

export function compareDates(date1: Date, date2: Date) {
  if (moment(date1).isBefore(moment(date2))) {
    return -1;
  }
  if (moment(date1).isAfter(moment(date2))) {
    return 1;
  }
  return 0;
}

export function addDay(date: Date) {
  return moment(date)
    .add(1, 'd')
    .toDate();
}

export function getActualDate() {
  return moment()
    .startOf('day')
    .toDate();
}

export function getYesterdayDate() {
  return moment()
    .subtract(1, 'd')
    .startOf('day')
    .toDate();
}

export function getActualStartOfDate(date: Date | string) {
  return moment(date)
    .startOf('day')
    .toDate();
}

export function getActualEndOfDate(date: Date) {
  return moment(date)
    .endOf('day')
    .toDate();
}

export function getDate(date: string) {
  return moment(date).toDate();
}

// const monthNames_cs = [
//   'Leden',
//   'Únor',
//   'Březen',
//   'Duben',
//   'Květen',
//   'Červen',
//   'Červenec',
//   'Srpen',
//   'Září',
//   'Říjen',
//   'Listopad',
//   'Prosinec',
// ];
// const monthNamesShort_cs = ['Led', 'Úno.', 'Bře', 'Dub', 'Kvě', 'Čvn', 'Cvc', 'Srp', 'Zář.', 'Říj', 'Lis', 'Pro'];
// const dayNames_cs = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
// const dayNamesShort_cs = ['Ne', 'Po', 'Út', 'St', 'Čt', 'Pá', 'So'];

// const dayNames_en = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
// const dayNamesShort_en = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
// const monthNames_en = 'January_February_March_April_May_June_July_August_September_October_November_December'.split(
//   '_',
// );
// const monthNamesShort_en = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');

// LocaleConfig.locales.cs = {
//   monthNames: monthNames_cs,
//   monthNamesShort: monthNamesShort_cs,
//   dayNames: dayNames_cs,
//   dayNamesShort: dayNamesShort_cs,
// };

// LocaleConfig.locales.en = {
//   monthNames: monthNames_en,
//   monthNamesShort: monthNamesShort_en,
//   dayNames: dayNames_en,
//   dayNamesShort: dayNamesShort_en,
// };
