import {Grid as GridCore, Icon, InputProps} from '@material-ui/core';
import {exampleRows1} from 'app/indra/components/grids/exampleData';
import {
  CheckboxColumnFilter,
  DateColumnFilter,
  DefaultColumnFilter,
  SelectColumnFilter
} from 'app/indra/components/grids/gridFiltration';
import GridParams, {GridParam} from 'app/indra/components/grids/gridParams';
import {HeadingStyle, HeadingStyleWrapper, IconStyle, TableStyles} from 'app/indra/components/grids/gridStyles';
import GridTable, {
  DATATYPE_BOOLEAN,
  DATATYPE_DATE,
  DATATYPE_FLOAT,
  DATATYPE_ICON,
  DATATYPE_NUMBER,
  SELECT_MAX_ROWS_NONE
} from 'app/indra/components/grids/gridTable';
import {GridColumn} from 'app/indra/components/layouts/layoutController';
import {PanelCommunication, PanelProp} from 'app/indra/components/panels/panelController';
import fetchService from 'app/indra/services/fetch';
import React, {FunctionComponent, useCallback, useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

const DEFAULT_COLUMN_WIDTH = 100;

interface GridProps extends PanelProp {
  gridId: number;
}

async function getGridDefinition(gridId: number) {
  const json: any = await fetchService.get(process.env.REACT_APP_API_URL_INDRA + '/grid/getGrid/' + gridId);

  return json;
}

async function getReportData(gridId: number, gridParameters: GridParam[]) {
  console.log('Get Data for ' + gridId);

  const parameters: any = [];
  gridParameters.forEach((gridParam: GridParam) => {
    parameters.push({
      name: gridParam.dbParamName,
      value: gridParam.value
    });
  });

  const reportData = {
    gridId: gridId,
    parameters: parameters
  };

  try {
    const json: any = await fetchService.post(process.env.REACT_APP_API_URL_INDRA + '/report/getData', reportData);

    return json;
  } catch (e) {
    console.log('Error: ' + JSON.stringify(e));
  }
  return [];
}

const getGridData = () => {
  return exampleRows1;
};

const Grid: FunctionComponent<GridProps> = React.memo((props) => {
  const translation: any = useTranslation();
  const {t} = translation;

  const [grid, setGrid] = useState<any>({});
  const [data, setData] = useState<any>([] /*getGridData()*/);
  const [gridParameters, setGridParameters] = useState<any>(null);

  const setSelectedData = useCallback((data: any) => {
    if (props.sendDefaultOutput) {
      props.sendDefaultOutput(data, props.panel, props.communication, props.setCommunication);
    }
  }, []);

  const gridName: string = Object.entries(grid).length === 0 && grid.constructor === Object ? '' : grid.gridName;
  const [gridParams, setGridParams] = useState<any[]>([]);
  const [gridColumns, setGridColumns] = useState<any[]>([]);

  const [columnSettings, setColumnSettings] = useState<GridColumn[] | undefined>(undefined);

  useEffect(() => {
    if (props.panel && props.panel.definition && props.panel.definition.columns) {
      setColumnSettings(props.panel.definition.columns);
    }
  }, [props.panel]);

  const dbTranslate = (header: any) => {
    if (header && header.includes('%')) {
      const n = header.indexOf('%');
      const m = header.indexOf('%', n + 1);

      const translation = header.substring(n + 1, m);
      return header.replace('%' + translation + '%', t('indra:' + translation));
    }

    return header;
  };

  const prepareColumn = (column: any, isGroupMember: boolean) => {
    const datatype = column['datatype'].toLowerCase();
    const accessor = column['order'].toString();

    let columnWidth = column['width'] || DEFAULT_COLUMN_WIDTH;
    if (columnSettings) {
      columnSettings.forEach((columnSetting: GridColumn) => {
        if (columnSetting.id === accessor) {
          columnWidth = columnSetting.width;
          return;
        }
      });
    }

    return {
      isGroupMember: isGroupMember,

      accessor: accessor,
      Header: dbTranslate(column['labelCode']),
      width: columnWidth,
      datatype: column['datatype'],
      dataFormat: column['dataFormat'],
      output: column['output'],

      Filter: [DATATYPE_BOOLEAN].includes(datatype)
        ? CheckboxColumnFilter
        : [DATATYPE_ICON].includes(datatype)
        ? SelectColumnFilter
        : [DATATYPE_DATE].includes(datatype)
        ? DateColumnFilter
        : DefaultColumnFilter,
      filter: [DATATYPE_FLOAT, DATATYPE_NUMBER].includes(datatype)
        ? 'numberEquals'
        : [DATATYPE_BOOLEAN].includes(datatype)
        ? 'checkbox'
        : [DATATYPE_ICON].includes(datatype)
        ? 'textEquals'
        : 'textWildcard',
      disableFilters: false /*[DATATYPE_ICON].includes(datatype)*/,
      disableGlobalFilter: [DATATYPE_BOOLEAN, DATATYPE_ICON].includes(datatype),
      disableSortBy: [DATATYPE_BOOLEAN].includes(datatype),
      style: column['style']
    };
  };

  const prepareHeadersAndColumns = (gridColumns: any[]) => {
    if (gridColumns == null) {
      return [];
    }

    const headersAndColumns: any = [];
    gridColumns.map((headerOrColumn: any, headerKey: number) => {
      if (headerOrColumn.hidden === true) {
        return;
      }

      const columns: any = [];
      if ('Header' in headerOrColumn) {
        headerOrColumn['columns'].forEach((column: any) => {
          columns.push(prepareColumn(column, true));
        });

        headersAndColumns.push({Header: dbTranslate(headerOrColumn['Header']), columns: columns, isGroup: true});
      } else {
        headersAndColumns.push(prepareColumn(headerOrColumn, false));
      }
    });

    return headersAndColumns;
  };

  const [headerHeight] = useState<number>(24 + 1);
  const [rowHeight] = useState<number>(26 + 1);
  const [minRows] = useState<number>(2);
  const [pageSizesCount] = useState<number>(5);

  useEffect(() => {
    if (gridParameters) {
      const fetchDataAsync = async () => {
        setData(await getReportData(props.gridId, gridParameters));
      };
      fetchDataAsync();
    }
  }, [gridParameters]);

  useEffect(() => {
    const fetchDataAsync = async () => {
      setGrid(await getGridDefinition(props.gridId));
    };
    fetchDataAsync();
  }, []);

  const [rowSelection, setRowSelection] = useState<number>(SELECT_MAX_ROWS_NONE);
  const [showCheckboxes, setShowCheckboxes] = useState<boolean>(true);
  const [hideParams, setHideParams] = useState<boolean | undefined>(undefined);
  const [hideFilters, setHideFilters] = useState<boolean>(true);
  const [hidePagination, setHidePagination] = useState<boolean>(true);
  const [rowStyling, setRowStyling] = useState<any>(undefined);

  useEffect(() => {
    const gridParamsDefault: any[] =
      Object.entries(grid).length === 0 && grid.constructor === Object ? [] : JSON.parse(grid.params);
    const gridColumnsDefault: any[] =
      Object.entries(grid).length === 0 && grid.constructor === Object ? [] : JSON.parse(grid.columns);

    const rowSelectionDefault: number =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? SELECT_MAX_ROWS_NONE
        : JSON.parse(grid.definition).Grid.rowSelection ?? SELECT_MAX_ROWS_NONE;
    const showCheckboxesDefault: boolean =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? false
        : JSON.parse(grid.definition).Grid.showCheckboxes ?? false;
    const hideParamsDefault: boolean =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? true
        : JSON.parse(grid.definition).Grid.hideParams ?? false;
    const hideFiltersDefault: boolean =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? true
        : JSON.parse(grid.definition).Grid.hideFilters ?? false;
    const hidePaginationDefault: boolean =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? true
        : JSON.parse(grid.definition).Grid.hidePagination ?? false;
    const rowStylingDefault: boolean =
      Object.entries(grid).length === 0 && grid.constructor === Object
        ? true
        : JSON.parse(grid.definition).Grid.rowStyling ?? false;

    setGridParams(gridParamsDefault);
    setGridColumns(prepareHeadersAndColumns(gridColumnsDefault));

    setRowSelection(rowSelectionDefault);
    setShowCheckboxes(showCheckboxesDefault);
    setHideParams(hideParamsDefault);
    setHideFilters(hideFiltersDefault);
    setHidePagination(hidePaginationDefault);
    setRowStyling(rowStylingDefault);

    if (hideParams && hideParamsDefault) {
      const fetchDataAsync = async () => {
        setData(await getReportData(props.gridId, gridParameters ?? []));
      };
      fetchDataAsync();
    }
  }, [grid]);

  useEffect(() => {
    const gridColumnsDefault: any[] =
      Object.entries(grid).length === 0 && grid.constructor === Object ? [] : JSON.parse(grid.columns);

    setGridColumns(prepareHeadersAndColumns(gridColumnsDefault));
  }, [translation.i18n.language]);

  const [paramsMinimalized, setParamsMinimalized] = useState<boolean>(false);
  const paramsRef = React.createRef<any>();
  const [paramsHeight, setParamsHeight] = useState<number | undefined>(undefined);

  const iconName = paramsMinimalized ? 'expand_more' : 'expand_less';
  const [showModal, setShowModal] = useState<boolean>(false);

  const [resized, setResized] = useState<boolean>(false);
  const [resizedOffset, setResizedOffset] = useState<number>();
  const gridRef = React.createRef<any>();
  const [prevGridHeight, setPrevGridHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (gridRef.current != null) {
      const actualGridHeight = gridRef.current.getBoundingClientRect().height;
      setPrevGridHeight(actualGridHeight);
    }
  });

  useEffect(() => {
    if (gridRef.current != null) {
      const actualGridHeight = gridRef.current.getBoundingClientRect().height;
      if (prevGridHeight != null) {
        const offset = actualGridHeight - prevGridHeight;
        if (offset) {
          setResized(!resized);
          setResizedOffset(offset);
        }
      }
    }
  }, [props.layoutChanged]);

  if (grid.columns === null) {
    return <div>{t('indra:grid.error.columns')}</div>;
  }

  if (gridColumns.length === 0) {
    return <div>{t('indra:grid.loading')}</div>;
  }

  return (
    <div
      ref={gridRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}>
      <GridName gridName={gridName} hideParams={hideParams} setShowModal={setShowModal} {...props} />

      {hideParams ? (
        <GridParams gridParams={gridParams} setGridParameters={setGridParameters} {...props} hideParams={hideParams} />
      ) : (
        <div style={{flex: 0, marginTop: 1, marginBottom: 1, border: '1px solid gray', borderRadius: 2}}>
          <div
            onClick={() => {
              if (!paramsMinimalized) {
                if (paramsRef.current != null) {
                  let height = paramsRef.current.offsetHeight;
                  setParamsHeight(height);
                }
              }
              setParamsMinimalized(!paramsMinimalized);
            }}
            style={{...HeadingStyleWrapper, cursor: 'pointer'}}>
            <h3 style={HeadingStyle}>Parametry</h3>
            <span style={{display: 'table-cell', textAlign: 'right'}}>
              <Icon style={IconStyle}>{iconName}</Icon>
            </span>
          </div>

          <div ref={paramsRef} style={{padding: 5, ...(paramsMinimalized ? {display: 'none'} : {})}}>
            <GridParams
              gridParams={gridParams}
              setGridParameters={setGridParameters}
              {...props}
              hideParams={hideParams}
            />
          </div>
        </div>
      )}

      <div
        style={{
          flex: 1,
          overflow: 'auto' // because of modal
        }}>
        <TableStyles style={{display: 'flex', flexDirection: 'column', height: '100%', position: 'relative'}}>
          <GridTable
            columns={gridColumns}
            data={data}
            headerHeight={headerHeight}
            rowHeight={rowHeight}
            minRows={minRows}
            pageSizesCount={pageSizesCount}
            allRowsCount={data.length}
            setSelectedData={setSelectedData}
            rowSelection={rowSelection}
            rowStyling={rowStyling}
            showCheckboxes={showCheckboxes}
            resized={resized}
            resizedOffset={resizedOffset}
            hideParams={hideParams}
            paramsMinimalized={paramsMinimalized}
            paramsHeight={paramsHeight}
            showModal={showModal}
            setShowModal={setShowModal}
            hideFilters={hideFilters}
            hidePagination={hidePagination}
            gridId={props.gridId}
            writeSettings={props.writeSettings}
            columnSettings={columnSettings}
          />
        </TableStyles>
      </div>
    </div>
  );
});

interface GridNameProps extends InputProps {
  gridName: string;
  hideParams: boolean | undefined;
  setShowModal: (showModal: boolean) => void;
  communication?: PanelCommunication[];
}

const GridName: FunctionComponent<GridNameProps> = React.memo((props) => {
  const translation: any = useTranslation();
  const {t} = translation;

  const dbTranslate = (header: any) => {
    if (header && header.includes('%')) {
      const n = header.indexOf('%');
      const m = header.indexOf('%', n + 1);

      const translation = header.substring(n + 1, m);
      return header.replace('%' + translation + '%', t('indra:' + translation));
    }

    return header;
  };

  const [header, setHeader] = useState<string>(dbTranslate(props.gridName));

  useEffect(() => {
    const gridName = dbTranslate(props.gridName);

    let replaced = false;
    if (gridName && gridName.includes('@')) {
      const n = gridName.indexOf('@');
      const m = gridName.indexOf('@', n + 1);

      const replacedString = gridName.substring(n + 1, m);

      if (props.communication) {
        if (n > 0 && m > 0 && replacedString.length > 0) {
          props.communication.forEach((com: any) => {
            com.data.forEach((data: any) => {
              if (data.key === replacedString) {
                setHeader(gridName.replace('@' + replacedString + '@', ' - ' + data.value));
                replaced = true;
              }
            });
          });
        }
      }
      if (!replaced) {
        setHeader(gridName.replace('@' + replacedString + '@', ''));
      }
    } else {
      setHeader(gridName);
    }
  }, [props.communication, translation.i18n.language]);

  return (
    <GridCore
      container
      alignItems="center"
      style={{
        flex: 0,
        display: 'flex',
        background: 'linear-gradient(45deg, rgb(16 189 224 / 30%), rgb(16 189 224 / 70%))',
        fontWeight: 'bold',
        fontSize: 13,
        minHeight: 25,
        paddingRight: 10,
        paddingLeft: 40
      }}>
      {header}
      {props.hideParams && (
        <div style={{flex: 1, textAlign: 'right'}}>
          <Icon
            style={{verticalAlign: 'middle', color: '#3d3d3d', cursor: 'pointer'}}
            onClick={() => {
              props.setShowModal(true);
            }}>
            {'more_horiz'}
          </Icon>
        </div>
      )}
    </GridCore>
  );
});

export default Grid;
