import React, { FunctionComponent } from 'react';
import { InputProps } from '@material-ui/core';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';

interface NumberTableCellProps extends TableCellProps {
  value: number;
}

const NumberTableCell: FunctionComponent<NumberTableCellProps> = props => {
  return (
    <TableCell align="right" style={{ textAlign: 'right' }} {...props}>
      {props.value}        
    </TableCell>
  );
};

export default NumberTableCell;
