import Numeral from 'numeral';

export const ZERO_VALUE = 'ZERO';
export const NULL_VALUE = 'NULL';

export function formatNumber(value: number, dataFormat: string) {
  const numeral = Numeral(value);

  return numeral.format(dataFormat);
}

export function numeralSetLanguage(language: string) {
  Numeral.locale(language);
  Numeral.nullFormat(NULL_VALUE);
  Numeral.zeroFormat(ZERO_VALUE);
}
