import React, { FunctionComponent } from 'react';
import { InputProps } from '@material-ui/core';
import TableCell, { TableCellProps } from '@material-ui/core/TableCell';

interface FloatTableCellProps extends TableCellProps {
  value: number;
}

const FloatTableCell: FunctionComponent<FloatTableCellProps> = props => {
  const formatter = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,      
    maximumFractionDigits: 2,
  });

  return (
    <TableCell align="right" style={{ textAlign: 'right' }} {...props}>
      {formatter.format(props.value)}        
    </TableCell>
  );
};

export default FloatTableCell;
