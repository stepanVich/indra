import React, {useState, useEffect, FunctionComponent} from 'react';
import {
  useTable,
  useResizeColumns,
  useFlexLayout,
  useRowSelect,
  useFilters,
  useGlobalFilter,
  useSortBy,
  usePagination,
  useColumnOrder,
  SortingRule
} from 'react-table';
import {Icon, Checkbox} from '@material-ui/core';
import {IconStyle, CheckboxStyle, HeadingStyle, HeadingStyleWrapper} from 'app/indra/components/grids/gridStyles';
import {
  DefaultColumnFilter,
  fuzzyTextFilterFn,
  textStartsWith,
  textWildcard,
  textEquals,
  numberEquals,
  checkbox
} from 'app/indra/components/grids/gridFiltration';
import {AdaptiveListWithDetector} from 'app/indra/components/grids/adaptiveList';
import GridPagination from 'app/indra/components/grids/gridPagination';
import {formatDateToISO} from 'app/indra/utils/dateTime';
import {GridColumn, GridDefinition, SettingsType} from 'app/indra/components/layouts/layoutController';
import {useTranslation} from 'react-i18next';

export interface ColumnData {
  accessor: string;
  Header: string;
  width: number;
  style: any;
  datatype: string;
  output?: string;

  Filter: any;
  filter: string;
  disableFilters: boolean;
  disableGlobalFilter: boolean;
  disableSortBy: boolean;

  isVisible?: boolean;
  isSorted?: boolean;
  order?: number;
}

export const DATATYPE_BOOLEAN = 'boolean',
  DATATYPE_DATE = 'date',
  DATATYPE_DATETIME = 'datetime',
  DATATYPE_FLOAT = 'float',
  DATATYPE_ICON = 'icon',
  DATATYPE_NUMBER = 'number',
  DATATYPE_TIME = 'time',
  DATATYPE_STRING = 'string';

export const SELECTION_COLUMN = 'selection';

export const SELECT_MAX_ROWS_ALL = -1,
  SELECT_MAX_ROWS_NONE = 0,
  SELECT_MAX_ROWS_ONE = 1;

const headerProps = (props: any, {column}: any) => getStyles(props, column.align);

const getStyles = (props: any, align = 'left') => [
  props,
  {
    style: {
      justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
      alignItems: 'center',
      display: 'flex'
    }
  }
];

const GridTable: FunctionComponent<any> = React.memo(
  ({
    columns,
    data,
    headerHeight,
    rowHeight,
    minRows,
    pageSizesCount,
    allRowsCount,
    setSelectedData,
    rowSelection,
    rowStyling,
    showCheckboxes,
    resized,
    resizedOffset,
    hideParams,
    paramsMinimalized,
    paramsHeight,
    showModal,
    setShowModal,
    hideFilters,
    hidePagination,
    gridId,
    writeSettings,
    columnSettings
  }: any) => {
    console.log('--------------render GridTable: ' + gridId);

    const {t} = useTranslation();

    const defaultColumn = React.useMemo(
      () => ({
        // When using the useFlexLayout:
        minWidth: 56, // minWidth is only used as a limit for resizing
        width: 100, // width is used for both the flex-basis and flex-grow
        maxWidth: 500, // maxWidth is only used as a limit for resizing
        Filter: DefaultColumnFilter
      }),
      []
    );

    const filterTypes = React.useMemo(
      () => ({
        fuzzyText: fuzzyTextFilterFn,

        textStartsWith: textStartsWith,
        textWildcard: textWildcard,
        textEquals: textEquals,
        numberEquals: numberEquals,
        checkbox: checkbox
      }),
      []
    );

    const columnOrder: string[] = [];
    const hiddenColumns: string[] = [];
    const sortBy: SortingRule<any>[] = [];
    if (columnSettings) {
      columnSettings.forEach((columnSetting: GridColumn) => {
        columnOrder.push(columnSetting.id);
        if (!columnSetting.isVisible) {
          hiddenColumns.push(columnSetting.id);
        }
        if (columnSetting.isSorted) {
          sortBy.push({id: columnSetting.id, desc: columnSetting.isSortedDesc});
        }
      });
    }

    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      totalColumnsWidth,
      prepareRow,
      // selectedFlatRows,
      state,
      visibleColumns,
      preGlobalFilteredRows,
      setGlobalFilter,
      allColumns,
      setColumnOrder,
      //page,
      //canPreviousPage,
      //canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      //nextPage,
      //previousPage,
      setPageSize,
      state: {pageIndex, pageSize}
    } = useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
        defaultFilterMethod: {
          fuzzyTextFilterFn
        },
        initialState: {
          pageIndex: 0,
          pageSize: minRows,
          columnOrder: columnOrder,
          hiddenColumns: hiddenColumns,
          sortBy: sortBy
        }
        //manualPagination: true,
      },
      useResizeColumns,
      useColumnOrder,
      useFlexLayout,
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination,
      useRowSelect,
      (hooks) => {
        // hooks.allColumns.push((columns) => [
        //   // Let's make a column for selection
        //   {
        //     id: SELECTION_COLUMN,
        //     disableResizing: true,
        //     width: 56,
        //     padding: "6px 16px",
        //     // The header can use the table's getToggleAllRowsSelectedProps method
        //     // to render a checkbox
        //     Header: ({ getToggleAllRowsSelectedProps }: any) => (
        //       <IndeterminateCheckbox
        //         {...getToggleAllRowsSelectedProps()}
        //         style={{
        //           top: "50%",
        //           marginTop: -20,
        //         }} /* TODO maybe */
        //       />
        //     ),
        //     // The cell can use the individual row's getToggleRowSelectedProps method
        //     // to the render a checkbox
        //     Cell: ({ row }: any) => (
        //       <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
        //     ),
        //   },
        //   ...columns,
        // ]);
        // hooks.useInstanceBeforeDimensions.push(({ headerGroups }) => {
        //   // fix the parent group of the selection button to not be resizable
        //   const selectionGroupHeader: any = headerGroups[0].headers[0];
        //   selectionGroupHeader.canResize = false;
        // });
      }
    );

    const [selectionChanged, setSelectionChanged] = useState<string | undefined>(undefined);

    const toggleSelected = (index: number, rowData: any) => {
      if (rowSelection === SELECT_MAX_ROWS_NONE) {
        return;
      }

      const actualRow: any = rows[index];

      // if only one row can be selected - reset other rows
      if (rowSelection == SELECT_MAX_ROWS_ONE && !actualRow.isSelected) {
        rows.forEach((row: any) => {
          if (row !== rows[index]) {
            row.isSelected = false;
          }
        });
      }

      actualRow.isSelected = !actualRow.isSelected;
      setSelectionChanged(index + (actualRow.isSelected ? 't' : 'f'));

      // collect all columns into 1 array
      let newColumns = collectAllColumns(columns, []);

      let outputDataList: any = [];
      rows.forEach((row: any) => {
        // if some row is selected  - collect all columns with defined output attribute and send output
        if (row.isSelected) {
          let outputDataRow: any = [];
          row.original.map((cellValue: any, key: any) => {
            if (newColumns.length >= key && newColumns[key]) {
              const output = newColumns[key].output;
              if (output) {
                let value = cellValue;
                if (newColumns[key].datatype.toLowerCase() === DATATYPE_DATE) {
                  value = cellValue ? formatDateToISO(cellValue) : null;
                }

                outputDataRow.push({
                  key: output,
                  value: value
                });
              }
            }
          });
          outputDataList.push(outputDataRow);
        }
      });

      // if multiple rows selected - send array output
      if (outputDataList.length > 0) {
        setSelectedData(outputDataList.length === 1 ? outputDataList[0] : outputDataList);
      }
    };

    const [pageIndexByScroll, setPageIndexByScroll] = useState<any>(pageIndex);
    const [canPrevPageByScroll, setCanPrevPageByScroll] = useState<any>(pageIndex > 0);
    const [canNextPageByScroll, setCanNextPageByScroll] = useState<any>(pageCount > 0 && pageIndex < pageCount - 1);

    const setPaginationValues = (page: number) => {
      setPageIndexByScroll(page);
      setCanPrevPageByScroll(page > 0);
      setCanNextPageByScroll(pageCount > 0 && page < pageCount - 1);
    };

    useEffect(() => {
      setPaginationValues(pageIndex);
    }, [pageSize, pageCount]);

    const [scrollsByPaginator, setScrollsByPaginator] = useState<number>(0);

    const onRowsScroll = (e: any) => {
      if (scrollsByPaginator !== 1) {
        let newPageByScroll: any = Math.round(e.scrollOffset / rowHeight / pageSize);
        const lastPageOffset = rows.length * rowHeight - pageSize * rowHeight;
        if (e.scrollOffset >= lastPageOffset) {
          newPageByScroll = pageCount - 1;
        }
        newPageByScroll = limitNewPage(newPageByScroll);
        setPaginationValues(newPageByScroll);
      }
      if (scrollsByPaginator > 0) {
        setScrollsByPaginator(scrollsByPaginator - 1);
      }
    };

    const gotoPageByPaginator = (newPage: number) => {
      setScrollsByPaginator(2);
      newPage = limitNewPage(newPage);
      setPaginationValues(newPage);
      gotoPage(newPage);
    };

    const limitNewPage = (newPage: number) => {
      return newPage >= 0 ? (newPage >= pageCount ? pageCount - 1 : newPage) : 0;
    };

    const shiftColumn = (id: string, upOrDown: boolean) => {
      const columns = allColumns.map((d) => d.id);
      const i1 = columns.indexOf(id);
      const i2 = upOrDown ? i1 + 1 : i1 - 1;

      const firstIndex = showCheckboxes ? 1 : 0;
      if (i2 >= firstIndex && i2 < columns.length) {
        const tmp = columns[i1];
        columns[i1] = columns[i2];
        columns[i2] = tmp;
        setColumnOrder(columns);
        setSave(true);
      }
    };

    const [save, setSave] = useState<boolean>(false);

    useEffect(() => {
      if (save) {
        saveGridSettings();
      }
      setSave(false);
    }, [save]);

    const saveGridSettings = () => {
      const columns: GridColumn[] = [];
      allColumns.forEach((column: any, key: any) => {
        if (column.id !== SELECTION_COLUMN) {
          columns.push({
            id: column.id,
            isVisible: column.isVisible,
            isSorted: column.isSorted,
            isSortedDesc: column.isSortedDesc,
            width: column.width
          });
        }
      });

      const gridDefinition: GridDefinition = {
        gridId: gridId,
        columns: columns
      };

      console.log('saveGridSettings');
      console.log(gridDefinition);

      writeSettings({type: SettingsType.GRID_DEF, data: [gridDefinition]});
    };

    const headerRef = React.createRef<any>();
    const [actualHeaderHeight, setActualHeaderHeight] = useState<number | undefined>(undefined);

    useEffect(() => {
      setActualHeaderHeight(headerRef.current.getBoundingClientRect().height);
    });

    return (
      <>
        <div
          style={{
            width: '100%',
            height: '100%',
            padding: 16,
            ...(actualHeaderHeight !== undefined ? {paddingTop: actualHeaderHeight - 6} : {}),
            boxSizing: 'border-box',
            textAlign: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            position: 'absolute',
            zIndex: 2,
            ...(showModal ? {display: 'flex', alignItems: 'start', justifyContent: 'center'} : {display: 'none'}),
            overflow: 'auto'
          }}
          onClick={() => {
            setShowModal(false);
          }}>
          <div
            style={{
              //maxWidth: '100%',
              //maxHeight: '100%',
              boxSizing: 'border-box',
              textAlign: 'left',
              display: 'contents'
            }}
            onClick={(e: any) => {
              e.stopPropagation();
            }}>
            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                minWidth: 300,
                maxWidth: '100%',
                maxHeight: '100%',
                border: '1px solid rgba(0, 0, 0, 0.13)',
                borderRadius: 3,
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative'
              }}>
              <div
                style={{
                  flex: 0,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  //width: '100%',
                  boxSizing: 'border-box',
                  padding: '6px 16px',
                  border: '0px solid rgba(0, 0, 0, 0.13)',
                  borderWidth: '3px 0px 0px',
                  backgroundColor: '#eaeaea'
                }}>
                <div style={{flex: 1}}>
                  <span>{t('indra:grid.options.title')}</span>
                </div>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'right'
                  }}>
                  <Icon
                    style={{verticalAlign: 'middle', color: '#3d3d3d', cursor: 'pointer'}}
                    onClick={() => {
                      setShowModal(false);
                    }}>
                    {'close'}
                  </Icon>
                </div>
              </div>

              <div
                style={{
                  flex: 1,
                  padding: 16,
                  border: '0px solid rgba(0, 0, 0, 0.13)',
                  borderWidth: '0px 0px 3px',
                  backgroundColor: 'rgb(177, 217, 255)',
                  overflowY: 'auto',

                  borderRightWidth: 3, // fix scrollbar
                  borderRightColor: 'transparent', // fix scrollbar
                  paddingRight: 13 // fix scrollbar
                }}>
                <div
                  style={{
                    height: '100%',
                    boxSizing: 'border-box',
                    overflowY: 'auto'
                  }}>
                  {allColumns.map(
                    (column: any) =>
                      column.id !== SELECTION_COLUMN && (
                        <div key={column.id}>
                          <label>
                            <Checkbox
                              icon={<Icon style={IconStyle}>{'check_box_outline_blank'}</Icon>}
                              checkedIcon={<Icon style={IconStyle}>{'check_box'}</Icon>}
                              {...column.getToggleHiddenProps()}
                              onChange={(e: any) => {
                                const originalOnChange = column.getToggleHiddenProps().onChange;
                                if (originalOnChange != null) {
                                  originalOnChange(e);
                                }
                                setSave(true);
                              }}
                              style={CheckboxStyle}
                            />{' '}
                            {column.Header}
                          </label>
                          &nbsp;&nbsp;&nbsp;
                          <Icon
                            style={{
                              ...IconStyle,
                              ...{
                                margin: '0px -0px',
                                color: 'rgba(0, 0, 0, 0.26)',
                                cursor: 'pointer'
                              }
                            }}
                            onClick={() => shiftColumn(column.id, true)}>
                            {'expand_more'}
                          </Icon>
                          <Icon
                            style={{
                              ...IconStyle,
                              ...{
                                margin: '0px -0px',
                                color: 'rgba(0, 0, 0, 0.26)',
                                cursor: 'pointer'
                              }
                            }}
                            onClick={() => shiftColumn(column.id, false)}>
                            {'expand_less'}
                          </Icon>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {!hideParams && (
          <div style={{flex: 0, marginTop: 1, border: '1px solid gray', borderRadius: 2}}>
            <div style={HeadingStyleWrapper}>
              <h3 style={HeadingStyle}>Tabulka</h3>
              <div style={{flex: 1, textAlign: 'right'}}>
                <Icon
                  style={{verticalAlign: 'middle', color: '#3d3d3d', cursor: 'pointer'}}
                  onClick={() => {
                    setShowModal(true);
                  }}>
                  {'more_horiz'}
                </Icon>
              </div>
            </div>
          </div>
        )}

        <div
          {...getTableProps()}
          className="table"
          style={{
            flex: 1,
            width: totalColumnsWidth + 17 + 2, // TODO maybe, I don't like it
            maxWidth: '100%',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            position: 'relative'
          }}>
          {/* <div
        style={{
          flex: 0,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          boxSizing: "border-box",
          padding: "6px 16px",
          border: "0px solid rgba(0, 0, 0, 0.13)",
          borderWidth: "3px 0px 0px",
          backgroundColor: "#eaeaea",
        }}
      >
        <div style={{ flex: 1 }}>
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
          />
        </div>
        <div style={{ flex: 1, textAlign: "right" }}>
          <Icon
            style={{ verticalAlign: "middle", color: "#3d3d3d" }}
            onClick={() => {
              setShowModal(true);
            }}
          >
            {"more_horiz"}
          </Icon>
        </div>
      </div> */}

          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              overflowX: 'auto',
              overflowY: 'hidden' // because of modal
            }}>
            <div
              ref={headerRef}
              style={{
                flex: 0,
                width: totalColumnsWidth + 17,
                backgroundColor: '#477DC5',
                borderRadius: 3,
                boxShadow: '0 3px 5px 2px rgba(48, 38, 64, .3)'
              }}>
              {headerGroups.map((headerGroup: any, trKey: any) => {
                return (
                  <div
                    key={trKey}
                    className="tr"
                    {...headerGroup.getHeaderGroupProps({
                      style: {
                        flex: 0,
                        width: totalColumnsWidth + 17,
                        //paddingRight: 17, // TODO maybe, it's from example
                        wordBreak: 'break-word',
                        overflowX: 'visible'
                      }
                    })}>
                    {headerGroup.headers.map((column: any, thKey: any) => (
                      <div
                        key={thKey}
                        className="th"
                        {...column.getHeaderProps(headerProps)}
                        style={{
                          ...column.getHeaderProps(headerProps).style,
                          textAlign: 'center',
                          ...(thKey === headerGroup.headers.length - 1 && column.totalWidth !== undefined
                            ? {
                                width: column.totalWidth + 17
                              }
                            : {})
                        }}>
                        <div
                          style={{
                            flex: 1,
                            display: 'flex',
                            //...(column.id === SELECTION_COLUMN ? {width: '100%'} : {}),
                            width: '100%',
                            // height:
                            //   column.id === SELECTION_COLUMN ? "100%" : headerHeight,
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden'
                          }}>
                          <span
                            {...column.getHeaderProps(column.getSortByToggleProps())}
                            onClick={(e: any) => {
                              const originalOnClick = column.getHeaderProps(column.getSortByToggleProps()).onClick;
                              if (originalOnClick != null) {
                                originalOnClick(e);
                              }
                              setSave(true);
                            }}
                            style={{
                              color: 'white',
                              ...(trKey === headerGroups.length - 1 &&
                              column.id !== SELECTION_COLUMN &&
                              !column.disableSortBy
                                ? {cursor: 'pointer'}
                                : {})
                            }}>
                            {column.render('Header')}
                            {trKey === headerGroups.length - 1 &&
                              column.id !== SELECTION_COLUMN &&
                              !column.disableSortBy && (
                                <span style={{opacity: column.isSorted ? 1 : 0.5}}>
                                  &nbsp;{column.isSorted ? (column.isSortedDesc ? '⭣' : '⭡') : '⭥'}
                                </span>
                              )}
                          </span>
                        </div>

                        {!hideFilters && column.id !== SELECTION_COLUMN && !column.disableFilters && (
                          <span
                            style={{
                              width: '100%',
                              marginTop: 3
                            }}>
                            {column.render('Filter')}
                          </span>
                        )}

                        {column.canResize /*&& thKey < Object.keys(headerGroup.headers).length - 1*/ && (
                          <div
                            {...column.getResizerProps()}
                            onMouseUp={() => {
                              setSave(true);
                            }}
                            onTouchEnd={() => {
                              setSave(true);
                            }}
                            className={`resizer`}>
                            {/*
                            <Icon
                              className={`resizerIcon ${column.isResizing ? 'isResizing' : ''}`}
                              style={{
                                fontSize: 16,
                                color: column.isResizing ? '#3d3d3d' : '#00000042'
                              }}>
                              {'arrow_left'}
                            </Icon>
                            */}
                            <div className={`resizerDelimiter ${column.isResizing ? 'isResizing' : ''}`}></div>
                            {/*
                            <Icon
                              className={`resizerIcon ${column.isResizing ? 'isResizing' : ''}`}
                              style={{
                                fontSize: 16,
                                color: column.isResizing ? '#3d3d3d' : '#00000042'
                              }}>
                              {'arrow_right'}
                            </Icon>
                            */}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>

            <div
              {...getTableBodyProps()}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
              <AdaptiveListWithDetector
                rows={rows}
                selectionChanged={selectionChanged}
                rowStyling={rowStyling}
                totalColumnsWidth={totalColumnsWidth + 17}
                rowHeight={rowHeight}
                minRows={minRows}
                pageSize={pageSize}
                setPageSize={setPageSize}
                prepareRow={prepareRow}
                toggleSelected={toggleSelected}
                scrollToItem={/*Math.round(*/ pageIndex * pageSize /*)*/}
                onRowsScroll={onRowsScroll}
                resized={resized}
                resizedOffset={resizedOffset}
                paramsMinimalized={paramsMinimalized}
                paramsHeight={paramsHeight}
              />
            </div>
          </div>
          {!hidePagination && (
            <div
              style={{
                flex: 0,
                //width: "100%",
                padding: '6px 16px',
                border: '0px solid rgba(0, 0, 0, 0.13)',
                borderWidth: '0px 0px 3px',
                backgroundColor: '#eaeaea'
              }}>
              <GridPagination
                canPreviousPage={canPrevPageByScroll}
                canNextPage={canNextPageByScroll}
                pageOptions={pageOptions}
                pageCount={pageCount}
                gotoPage={gotoPageByPaginator}
                pageIndex={pageIndexByScroll}
                pageSize={pageSize}
                minRows={minRows}
                pageSizesCount={pageSizesCount}
                rowCount={allRowsCount}
                filteredRowCount={rows.length}
              />
            </div>
          )}
        </div>
      </>
    );
  }
);

function collectAllColumns(columns: any[], newColumns: any[]) {
  columns.forEach((innerColumn: any) => {
    if (innerColumn.columns) {
      newColumns = collectAllColumns(innerColumn.columns, newColumns);
    } else {
      newColumns.push(innerColumn);
    }
  });
  return newColumns;
}

export default GridTable;
