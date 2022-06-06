import settingsService from 'app/indra/services/settings';
import {CZ, TEXT_MAX_LENGTH} from 'app/indra/utils/const';

const ZERO = 0;
const MIN_PRICE = -9999;
const MAX_PRICE = 9999;
const MIN_QUANTITY = 0.1;
const MAX_QUANTITY = 9999;
const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;

export function removeDecimals(n: string, numberOfDecimal: number): string {
  let sNumber = n;
  let pointIndex = sNumber.indexOf('.');
  if (pointIndex < 0) {
    return n;
  }
  if (numberOfDecimal <= 0) {
    return sNumber.slice(0, pointIndex);
  } else {
    return sNumber.slice(0, pointIndex + 1 + numberOfDecimal);
  }
}

export function addDecimals(n: string, numberOfDecimal: number): string {
  if (n == '') {
    return '';
  }
  return String(parseFloat(n).toFixed(numberOfDecimal));
}

// TODO ?
export function convertFloatByLocale(value: string) {
  if (settingsService.getLanguage() === CZ) {
    value = value.replace(',', '.');
  }
  return value;
}

export function validatePrice(value: string) {
  if (value.trim() === '') {
    return '';
  }

  let nValue = Number(value);
  if (nValue < MIN_PRICE || nValue > MAX_PRICE) {
    return null;
  }

  // set the mask of a number
  value = removeDecimals(value, 2);

  return value;
}

export function formatPrice(value: string) {
  if (value.trim() === '') {
    return '';
  }

  let nValue = Number(value);
  if (nValue < MIN_PRICE || nValue > MAX_PRICE) {
    return '';
  }
  value = addDecimals(value, 2);

  return value;
}

export function validateQuantity(value: string) {
  if (value.trim() === '') {
    return '';
  }

  let nValue = Number(value);
  if (nValue < ZERO || nValue > MAX_QUANTITY) {
    return null;
  }

  // set the mask of a number
  value = removeDecimals(value, 1);

  return value;
}

export function formatQuantity(value: string) {
  if (value.trim() === '') {
    return '';
  }

  let nValue = Number(value);
  if (nValue < MIN_QUANTITY || nValue > MAX_QUANTITY) {
    return '';
  }

  value = addDecimals(value, 1);

  return value;
}

export function validatePercentage(value: any) {
  let nValue = Number(value);
  if (nValue == ZERO || isNaN(nValue)) {
    return ZERO;
  }
  if (nValue < MIN_PERCENTAGE || nValue > MAX_PERCENTAGE) {
    return null;
  }

  return value;
}

export function validateComment(value: string) {
  if (value.length > TEXT_MAX_LENGTH) {
    return null;
  }

  return value;
}
