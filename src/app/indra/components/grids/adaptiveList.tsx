import React, {useState, useEffect, useCallback, FunctionComponent} from 'react';
import {FixedSizeList} from 'react-window';
import {withResizeDetector} from 'react-resize-detector';
import {makeStyles} from '@material-ui/core';
import {
  SELECTION_COLUMN,
  DATATYPE_NUMBER,
  DATATYPE_DATETIME,
  DATATYPE_BOOLEAN,
  DATATYPE_ICON,
  DATATYPE_DATE
} from 'app/indra/components/grids/gridTable';
import BooleanGridTableCell from 'app/indra/components/grids/cells/booleanGridTableCell';
import NumberGridTableCell from 'app/indra/components/grids/cells/numberGridTableCell';
import DateTimeGridTableCell from 'app/indra/components/grids/cells/dateTimeGridTableCell';
import IconGridTableCell from 'app/indra/components/grids/cells/iconGridTableCell';
import DefaultGridTableCell from 'app/indra/components/grids/cells/defaultGridTableCell';
import DateGridTableCell from 'app/indra/components/grids/cells/dateGridTableCell';

const containerStyles = {
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

// interface AdaptiveListProps {
//   rows: any[];
//   selectionChanged: boolean;
//   totalColumnsWidth: number;
//   rowHeight: number;
//   minRows: number;
//   pageSize: number;
//   setPageSize: any;
//   prepareRow: any;
//   selectedFlatRows: any;
//   toggleSelected: any;
//   scrollToItem: any;
//   onRowsScroll: any;
//   style: any;
// }

const useStyles = makeStyles({
  hoveredRow: {
    backgroundColor: '#fafafa',
    '&:hover': {
      backgroundColor: '#FCD658'
    }
  }
});

const AdaptiveList: FunctionComponent<any> = (props) => {
  const {
    rows,
    rowStyling,
    totalColumnsWidth,
    rowHeight,
    minRows,
    pageSize,
    setPageSize,
    prepareRow,
    toggleSelected,
    scrollToItem,
    onRowsScroll,
    resized,
    resizedOffset,
    paramsMinimalized,
    paramsHeight,
    style
  } = props;

  const RenderRow = React.useCallback(
    ({index, style}) => {
      const classes = useStyles();
      const row = rows[index];
      prepareRow(row);

      const lastRowItem = row['original'].slice(-1)[0];
      const rowSpecificStyle = lastRowItem != null && lastRowItem.style != null ? lastRowItem.style : {};

      let rowStyle = {};
      Object.keys(rowStyling).map((key: any) => {
        const columnValue = row.original[key];
        rowStyle = {...rowStyle, ...rowStyling[key][columnValue]};
      });

      return (
        <div
          style={{
            ...(row.getRowProps({style}).style ?? {})
          }}
          className="tr"
          onClick={() => {
            toggleSelected(index, row.original);
          }}>
          <div
            style={{
              width: '100%',
              //height: "100%",
              display: 'flex',
              borderBottom: '1px solid rgba(0, 0, 0, 0.26)',
              // backgroundColor: "#fafafa",
              ...rowStyle,
              ...rowSpecificStyle,
              ...(row.isSelected ? {backgroundColor: '#FFB23F'} : {})
            }}
            className={classes.hoveredRow}>
            {row.cells.map((cell: any, key: any) => {
              if (cell.column.id === SELECTION_COLUMN) {
                cell.value = row.isSelected;
                return <BooleanGridTableCell key={key} keyV={key} cell={cell} disabled={false} />;
              }

              const datatype = cell.column.datatype;
              switch (datatype.toLowerCase()) {
                case DATATYPE_NUMBER:
                  return <NumberGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} />;
                case DATATYPE_DATE:
                  return <DateGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} />;
                case DATATYPE_DATETIME:
                  return <DateTimeGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} />;
                case DATATYPE_BOOLEAN:
                  return (
                    <BooleanGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} disabled={true} />
                  );
                case DATATYPE_ICON:
                  return <IconGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} />;
                default:
                  return <DefaultGridTableCell key={key} keyV={key} cell={cell} style={cell.column.style} />;
              }
            })}
          </div>
        </div>
      );
    },
    [prepareRow, rows]
  );

  const [flexHeight, setFlexHeight] = useState<number>(0);

  /*
  const onResize = useCallback(() => {
    //console.log("window.innerHeight: " + window.innerHeight);
    setForcedPageSize(undefined);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    //console.log("props.height: " + props.height);
    resizeFunction(props.height);
  }, [props.height]);

  const resizeFunction = (value: number) => {
    if (value != null) {
      const height = value;
      setFlexHeight(height);

      const resizedHeight = props.pageSize != null ? props.pageSize * rowHeight : height;
      const pageSize = resizedHeight / rowHeight;

      setForcedPageSize(pageSize);
    }
  };
  */

  const fixedSizeListRef = React.createRef<any>();
  const fixedSizeListWrapperRef = React.createRef<any>();
  const [prevWrapperHeight, setPrevWrapperHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (fixedSizeListRef.current != null) {
      fixedSizeListRef.current.scrollTo(scrollToItem * rowHeight);
    }
  }, [scrollToItem]);

  useEffect(() => {
    if (pageSize != null) {
      setPageSize(pageSize);
    }
  }, [pageSize]);

  useEffect(() => {
    if (!paramsMinimalized) {
      if (paramsHeight !== undefined) {
        handleResize(-paramsHeight);
      } else {
        setFlexHeight(minRows * rowHeight);
      }
    } else {
      handleResize(0);
    }
  }, [paramsMinimalized]);

  useEffect(() => {
    handleResize(0);
  }, [rows.length]);

  useEffect(() => {
    handleResize(resizedOffset);
  }, [resized]);

  const handleResize = (resizedOffset: number) => {
    let newHeight = undefined;
    if (fixedSizeListWrapperRef.current != null) {
      newHeight = fixedSizeListWrapperRef.current.getBoundingClientRect().height;
    }
    if (prevWrapperHeight != null) {
      newHeight = prevWrapperHeight;
    }
    if (newHeight) {
      if (resizedOffset) {
        newHeight += resizedOffset;
      }
      setPrevWrapperHeight(newHeight);
      setFlexHeight(newHeight);
      handlePageSize(newHeight);
    }
  };

  const handlePageSize = (newHeight: number) => {
    if (rowHeight > 0 && rows.length > 0) {
      let pageSize = newHeight / rowHeight;
      //pageSize = rows.length / Math.ceil(rows.length / pageSize);
      setPageSize(pageSize);
    }
  };

  return (
    <div
      ref={fixedSizeListWrapperRef}
      style={{
        ...containerStyles,
        ...{alignItems: 'initial', width: totalColumnsWidth}
      }}>
      <FixedSizeList
        ref={fixedSizeListRef}
        width={totalColumnsWidth}
        height={pageSize != null && rows.length ? pageSize * rowHeight : flexHeight}
        itemCount={rows.length}
        itemSize={rowHeight}
        onScroll={onRowsScroll}
        style={{
          width: totalColumnsWidth,
          minHeight: minRows * rowHeight,
          overflowX: 'hidden',
          overflowY: 'scroll',
          ...style
        }}>
        {RenderRow}
      </FixedSizeList>
    </div>
  );
};

export const AdaptiveListWithDetector = withResizeDetector(AdaptiveList);
