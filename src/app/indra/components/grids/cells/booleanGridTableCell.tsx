import React, {FunctionComponent} from 'react';
import {Icon, Checkbox} from '@material-ui/core';

interface BooleanGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
  disabled?: boolean;
}

const BooleanGridTableCell: FunctionComponent<BooleanGridTableCellProps> = React.memo((props) => {
  return (
    <div
      key={props.keyV}
      align={'center'}
      className="td"
      {...props.cell.getCellProps()}
      style={{
        ...props.cell.getCellProps().style,
        ...props.style
      }}>
      <Checkbox
        checked={props.cell.value}
        disabled={props.disabled ?? true}
        icon={<Icon style={{fontSize: 20}}>{'check_box_outline_blank'}</Icon>}
        checkedIcon={<Icon style={{fontSize: 20}}>{'check_box'}</Icon>}
        style={{padding: 0, verticalAlign: 'baseline'}}
      />
    </div>
  );
});

export default BooleanGridTableCell;
