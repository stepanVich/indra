import React, {FunctionComponent} from 'react';
import {Icon} from '@material-ui/core';
import {IconStyle} from 'app/indra/components/grids/gridStyles';

interface IconGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
}

const IconGridTableCell: FunctionComponent<IconGridTableCellProps> = React.memo((props) => {
  return (
    <div
      key={props.keyV}
      align={'center'}
      className="td"
      {...props.cell.getCellProps()}
      style={{
        ...props.cell.getCellProps().style,
        ...{textAlign: 'center'},
        ...props.style
      }}>
      <Icon
        style={{
          ...IconStyle,
          ...{
            color: '#66cdaa',
            textAlign: 'center'
          }
        }}>
        {props.cell.value}
      </Icon>
    </div>
  );
});

export default IconGridTableCell;
