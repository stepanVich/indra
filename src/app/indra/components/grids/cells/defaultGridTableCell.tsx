import React, {FunctionComponent} from 'react';

interface DefaultGridTableCellProps {
  cell: any;
  keyV: number;
  style?: any;
}

const DefaultGridTableCell: FunctionComponent<DefaultGridTableCellProps> = React.memo((props) => {
  return (
    <div
      key={props.keyV}
      className="td"
      {...props.cell.getCellProps()}
      style={{
        ...props.cell.getCellProps().style,
        ...props.style
      }}>
      {props.cell.render('Cell')}
    </div>
  );
});

export default DefaultGridTableCell;
