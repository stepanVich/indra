import React, { FunctionComponent } from "react";
import { InputProps, Checkbox } from "@material-ui/core";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";

interface BooleanTableCellProps extends TableCellProps {
  value: boolean;
  disabled?: boolean;
}

const BooleanTableCell: FunctionComponent<BooleanTableCellProps> = (props) => {
  return (
    <TableCell
      align={"center"}
      style={{ textAlign: "center" }}
      {...props}
    >
      <Checkbox checked={props.value} disabled={props.disabled ?? true} />
    </TableCell>
  );
};

export default BooleanTableCell;
