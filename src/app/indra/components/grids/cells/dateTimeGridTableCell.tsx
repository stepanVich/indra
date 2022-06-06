import {formatDateFromISO} from 'app/indra/utils/dateTime';
import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';

interface DateTimeGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
}

const DateTimeGridTableCell: FunctionComponent<DateTimeGridTableCellProps> = React.memo((props) => {
  const {t} = useTranslation();

  return (
    <div
      key={props.keyV}
      className="td"
      {...props.cell.getCellProps()}
      style={{...props.cell.getCellProps().style, ...props.style}}>
      {formatDateFromISO(props.cell.value, t('indra:format.dateTime.moment'))}
    </div>
  );
});

export default DateTimeGridTableCell;
