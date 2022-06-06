import React, {
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import Paginator from "./Paginator";
import {
  ColumnData,
  SELECT_MAX_ROWS_NONE,
  SELECT_MAX_ROWS_ONE,
  VirtualizedTable,
} from "./VirtualizedTable";
import { hasKey } from "./Utils";

interface VirtualizedTableExtendedProps {
  headerHeight: number;
  filterHeight: number;
  rowHeight: number;
  minRows: number;
  columns: ColumnData[];
  data: any;
  rowSelection: number;
}

export const VirtualizedTableExtended: FunctionComponent<VirtualizedTableExtendedProps> = React.memo(
  (props) => {
    console.log("Extended VirtualizedTable rerendered");

    const [filteredData, setFilteredData] = useState<any>(props.data);
    const [filters, setFilters] = useState<any>({});
    const [selectedRows, setSelectedRows] = useState<any>({});
    const [selectedRowsChanged, setSelectedRowsChanged] = useState<boolean>(
      false
    );
    const [unfilteredRowIds, setUnfilteredRowIds] = useState<any>({});

    //const paginatorRef = React.createRef<typeof Paginator>();
    const [perPage, setPerPage] = useState<number>(5);
    const [pageRange, setPageRange] = useState<number>(3);
    //let currentPage: number = 1;
    const [currentPage, setCurrentPage] = useState<number>(1);

    const onRowsScroll = (info: any) => {
      const page: number = Math.ceil(info.stopIndex / perPage);
      if (page !== currentPage) {
        console.log("index: " + info.stopIndex);
        console.log("page: " + page);
        setCurrentPage(page);
      }
    };
    const [scrollToIndex, setScrollToIndex] = useState<number | undefined>(
      undefined
    );
    const onPageChange = (index: number | undefined) => {
      setScrollToIndex(index);
    };

    const setFilter = (key: number, value: any) => {
      let filterTemp = filters;
      filterTemp[key] = value;
      setFilters(filterTemp);

      filterData();
    };

    const filterData = () => {
      let unfilteredTemp = unfilteredRowIds;
      let selectedTemp = selectedRows;

      let filteredRowIndex = 0;
      const filteredData = props.data.filter((row: any, rowKey: any) => {
        let found = true;
        let mapValue = row.forEach((value: any, key: any) => {
          if (
            filters[key] != null &&
            !value.toString().includes(filters[key])
          ) {
            found = false;
            return;
          }
        });

        if (found) {
          unfilteredTemp[filteredRowIndex++ + "-0"] = rowKey;
        } else {
          delete selectedTemp[rowKey];
        }

        return found;
      });
      setFilteredData(filteredData);

      setUnfilteredRowIds(unfilteredTemp);
      setSelectedRows(selectedTemp);
    };

    useEffect(() => {
      filterData();
    }, []);

    const toggleRow = (key: string) => {
      if (props.rowSelection === SELECT_MAX_ROWS_NONE) {
        return;
      }

      let selectedTemp = selectedRows;
      if (hasKey(selectedTemp, key)) {
        delete selectedTemp[key];
      } else {
        if (
          props.rowSelection >= SELECT_MAX_ROWS_ONE &&
          selectedTemp != {} &&
          selectedTemp != null &&
          Object.keys(selectedTemp).length >= props.rowSelection
        ) {
          if (props.rowSelection == SELECT_MAX_ROWS_ONE) {
            selectedTemp = {};
          } else {
            return;
          }
        }
        selectedTemp[key] = true;
      }
      setSelectedRows(selectedTemp);
      setSelectedRowsChanged(!selectedRowsChanged);
    };

    let fixedWidth = 24 + 2 * 16;
    props.columns.forEach((column: ColumnData) => {
      fixedWidth += column.width + 2 * 16;
    });

    return (
      <>
        <div style={{ flex: 0 }}>
          <Paginator
            perPage={perPage}
            pageRange={pageRange}
            currentPage={currentPage}
            rowCount={props.data.length}
            filteredRowCount={filteredData.length}
            selectedRowCount={Object.keys(selectedRows).length}
            onPageChange={onPageChange}
          />
        </div>

        <div style={{ width: fixedWidth, height: "100%", flex: 1 }}>
          <VirtualizedTable
            fixedWidth={fixedWidth}
            minHeight={
              props.headerHeight +
              props.filterHeight +
              props.rowHeight * props.minRows
            }
            headerHeight={props.headerHeight}
            filterHeight={props.filterHeight}
            rowHeight={props.rowHeight}
            columns={props.columns}
            filteredData={filteredData}
            filters={filters}
            setFilter={setFilter}
            selectedRows={selectedRows}
            selectedRowsChanged={selectedRowsChanged}
            unfilteredRowIds={unfilteredRowIds}
            toggleRow={toggleRow}
            onRowsScroll={onRowsScroll}
            scrollToIndex={scrollToIndex}
          />
        </div>
      </>
    );
  }
);

export default VirtualizedTableExtended;
