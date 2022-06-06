import React, {FunctionComponent} from 'react';
import {formatNumber} from 'app/indra/utils/number';

interface NumberGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
}

const NumberGridTableCell: FunctionComponent<NumberGridTableCellProps> = React.memo((props) => {
  return (
    <div
      key={props.keyV}
      align="right"
      className="td"
      {...props.cell.getCellProps()}
      style={{
        ...props.cell.getCellProps().style,
        ...{textAlign: 'right'},
        ...props.style
      }}>
      {formatNumber(props.cell.value, props.cell.column.dataFormat ?? '0,0.00')}
    </div>
  );
});

export default NumberGridTableCell;
