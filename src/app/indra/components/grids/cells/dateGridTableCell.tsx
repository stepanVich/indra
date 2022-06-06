import React, {FunctionComponent} from 'react';
import {formatDateFromISO} from 'app/indra/utils/dateTime';
import {useTranslation} from 'react-i18next';

interface DateGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
}

const DateGridTableCell: FunctionComponent<DateGridTableCellProps> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <div
      key={props.keyV}
      className="td"
      {...props.cell.getCellProps()}
      style={{...props.cell.getCellProps().style, ...props.style}}>
      {formatDateFromISO(props.cell.value, t('indra:format.date.moment'))}
    </div>
  );
});

export default DateGridTableCell;
