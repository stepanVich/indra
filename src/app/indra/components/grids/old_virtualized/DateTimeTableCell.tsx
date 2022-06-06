import React, { FunctionComponent } from 'react';
import { InputProps } from '@material-ui/core';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';

interface DateTimeTableCellProps extends TableCellProps {
  value: string;
}

const DateTimeTableCell: FunctionComponent<DateTimeTableCellProps> = props => {
  return (
    <TableCell {...props}>
      {props.value}   
    </TableCell>
  );
};

export default DateTimeTableCell;
