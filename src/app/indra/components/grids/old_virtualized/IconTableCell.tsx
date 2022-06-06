import React, { FunctionComponent } from "react";
import { InputProps, Icon } from "@material-ui/core";
import TableCell, { TableCellProps } from "@material-ui/core/TableCell";

interface IconTableCellProps extends TableCellProps {
  value: string;
}

const IconTableCell: FunctionComponent<IconTableCellProps> = (props) => {
  return (
    <TableCell align={"center"} style={{ textAlign: "center" }} {...props}>
      <Icon
        style={{
          fontSize: 24,
          verticalAlign: "middle",
          color: "#66cdaa",
          display: "inline-block",
          textAlign: "center",
        }}
      >
        {props.value}
      </Icon>
    </TableCell>
  );
};

export default IconTableCell;
