import React, { FunctionComponent } from "react";
import clsx from "clsx";
import { withStyles, WithStyles } from "@material-ui/core/styles";
import TableCell from "@material-ui/core/TableCell";
import {
  AutoSizer,
  Column,
  Table,
  TableCellRenderer,
  TableHeaderProps,
  TableRowProps,
} from "react-virtualized";
import NumberTableCell from "./NumberTableCell";
import FloatTableCell from "./FloatTableCell";
import DateTimeTableCell from "./DateTimeTableCell";
import Icon from "@material-ui/core/Icon";
import { TableRow, TextField } from "@material-ui/core";
import IconTableCell from "./IconTableCell";
import BooleanTableCell from "./BooleanTableCell";
import { styles } from "./VirtualizedTableStyles";
import { hasKey } from "./Utils";

export const SELECT_MAX_ROWS_ALL = -1,
  SELECT_MAX_ROWS_NONE = 0,
  SELECT_MAX_ROWS_ONE = 1;

export interface ColumnData {
  dataKey: string;
  label: string;
  width: number;
  datatype: string;
}

interface Row {
  index: number;
}

interface MuiVirtualizedTableProps extends WithStyles<typeof styles> {
  fixedWidth: number;
  minHeight: number;
  headerHeight: number;
  filterHeight: number;
  rowHeight: number;
  columns: ColumnData[];
  filteredData: any;
  filters: any;
  setFilter: (key: number, value: any) => void;
  selectedRows: any;
  selectedRowsChanged: boolean;
  unfilteredRowIds: any;
  toggleRow: (key: string) => void;
  onRowsScroll: (info: any) => void;
  onRowClick?: () => void;
  scrollToIndex: number | undefined;
}

const MuiVirtualizedTable: FunctionComponent<MuiVirtualizedTableProps> = React.memo(
  (props) => {
    console.log("Base VirtualizedTable rerendered");

    const getRowClassName = ({ index }: Row) => {
      return clsx(props.classes.tableRow, props.classes.flexContainer, {
        [props.classes.tableRowHover]: index !== -1 && props.onRowClick != null,
      });
    };

    const HeaderCell = (props: any) => {
      return (
        <TableCell
          key={props.columnIndex}
          width={props.width}
          component="div"
          className={clsx(
            classes.tableCell,
            classes.flexContainer,
            classes.noClick
          )}
          variant="head"
          style={{
            width: props.width,
            height: headerHeight,
            backgroundColor: "#b2e6d4",
          }}
        >
          {props.children}
        </TableCell>
      );
    };

    const zeroHeaderColumn = (columnIndex: number, width: number) => {
      if (columnIndex !== 0) {
        return;
      }

      return (
        <div>
          <HeaderCell columnIndex={-1} width={width}>
            <div></div>
          </HeaderCell>
          <TableCell
            key={"filter_" + columnIndex}
            width={width}
            component="div"
            className={clsx(
              classes.tableCell,
              classes.flexContainer,
              classes.noClick
            )}
            variant="head"
            style={{
              width: width,
              height: filterHeight,
              padding: 16,
              backgroundColor: "#eaeaea",
            }}
          >
            <Icon
              style={{
                fontSize: 24,
                verticalAlign: "middle",
                color: "#66cdaa",
                display: "inline-block",
                textAlign: "center",
              }}
            >
              {"search"}
            </Icon>
          </TableCell>
        </div>
      );
    };

    const HeaderRenderer = ({
      label,
      columnIndex,
    }: TableHeaderProps & { columnIndex: number }) => {
      console.log("HeaderRenderer rerendered");

      const width: number = props.columns[columnIndex]["width"] + 2 * 16;
      const datatype: string = props.columns[columnIndex]["datatype"];

      return (
        <>
          {zeroHeaderColumn(columnIndex, 24 + 2 * 16)}
          <div>
            <HeaderCell columnIndex={columnIndex} width={width}>
              <div>{label}</div>
            </HeaderCell>
            <TableCell
              key={"filter_" + columnIndex}
              width={width}
              component="div"
              className={clsx(
                classes.tableCell,
                classes.flexContainer,
                classes.noClick
              )}
              variant="head"
              style={{
                width: width,
                height: filterHeight,
                padding: 16,
                backgroundColor: "#eaeaea",
              }}
            >
              {!["boolean", "icon"].includes(datatype.toLowerCase()) && (
                <div>
                  <TextField
                    name={"filter_" + columnIndex}
                    style={{
                      width: width - 2 * 16,
                      display: "inline-block",
                      backgroundColor: "#f5f5f5",
                    }}
                    value={props.filters[columnIndex] ?? ""}
                    onChange={(e: any) => {
                      props.setFilter(columnIndex, e.target.value);
                    }}
                  />
                </div>
              )}
            </TableCell>
          </div>
        </>
      );
    };

    //const MemoizedHeaderRenderer = React.memo(HeaderRenderer);

    const cellRenderer: TableCellRenderer = ({ cellData, columnIndex }) => {
      return (
        <TableCell
          component="div"
          className={clsx(
            props.classes.tableCell,
            props.classes.flexContainer,
            {
              [classes.noClick]: props.onRowClick == null,
            }
          )}
          variant="body"
          style={{ height: props.rowHeight }}
        >
          {cellData}
        </TableCell>
      );
    };

    const tableCell = (
      value: any,
      key: any,
      datatype: string,
      width: number,
      disabled?: boolean,
      style?: any
    ) => {
      switch (datatype.toLowerCase()) {
        case "number":
          return (
            <NumberTableCell
              key={key}
              width={width}
              value={value}
              style={style}
            />
          );
        case "float":
          return (
            <FloatTableCell
              key={key}
              width={width}
              value={value}
              style={style}
            />
          );
        case "datetime":
          return (
            <DateTimeTableCell
              key={key}
              width={width}
              value={value}
              style={style}
            />
          );
        case "boolean":
          return (
            <BooleanTableCell
              key={key}
              width={width}
              value={value}
              disabled={disabled}
              style={style}
            />
          );
        case "icon":
          return (
            <IconTableCell
              key={key}
              width={width}
              value={value}
              style={style}
            />
          );
        default:
          return (
            <TableCell key={key} width={width} style={style}>
              {value}
            </TableCell>
          );
      }
    };

    const zeroColumn = (value: any, key: any, width: number) => {
      if (key != 0) {
        return;
      }

      return tableCell(value, -1, "Boolean", width, false, {
        paddingLeft: 0,
        paddingRight: 0,
      });
    };

    const rowRenderer = (rowProps: TableRowProps) => {
      const isSelected = hasKey(
        props.selectedRows,
        props.unfilteredRowIds[rowProps.key]
      );

      return (
        <TableRow
          key={rowProps.key}
          style={{
            ...rowProps.style,
            ...(isSelected
              ? { backgroundColor: "#d9f3ea" }
              : rowProps.index % 8 >= 4
              ? { backgroundColor: "#ffefd5" }
              : { backgroundColor: "#fafafa" }),
          }}
          onClick={(e: any) => {
            if (hasKey(props.unfilteredRowIds, rowProps.key)) {
              props.toggleRow(props.unfilteredRowIds[rowProps.key]);
            }
          }}
        >
          {rowProps.rowData.map((value: any, key: any) => {
            const width = props.columns[key]["width"];
            const datatype = props.columns[key]["datatype"];
            return (
              <>
                {zeroColumn(isSelected, key, 24 + 2 * 16)}
                {tableCell(value, key, datatype, width)}
              </>
            );
          })}
        </TableRow>
      );
    };

    const {
      classes,
      columns,
      rowHeight,
      headerHeight,
      filterHeight,
      ...tableProps
    } = props;

    return (
      <AutoSizer style={{ width: "100%", height: "100%" }}>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            rowHeight={rowHeight!}
            rowCount={props.filteredData.length}
            rowGetter={({ index }) => props.filteredData[index]}
            gridStyle={{
              direction: "inherit",
            }}
            headerStyle={{ display: "flex" }}
            headerHeight={headerHeight + filterHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={getRowClassName}
            rowRenderer={rowRenderer}
            onRowsRendered={props.onRowsScroll}
            scrollToIndex={props.scrollToIndex}
            scrollToAlignment={"start"}
            data={props.selectedRowsChanged}
            style={{ minHeight: props.minHeight }}
          >
            {columns.map(({ dataKey, ...other }, index) => {
              return (
                <Column
                  key={dataKey}
                  headerRenderer={(headerProps) =>
                    HeaderRenderer({
                      ...headerProps,
                      columnIndex: index,
                    })
                  }
                  className={classes.flexContainer}
                  cellRenderer={cellRenderer}
                  dataKey={dataKey}
                  {...other}
                />
              );
            })}
          </Table>
        )}
      </AutoSizer>
    );
  }
);

export const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);
