import {FunctionComponent} from 'react';
import React from 'react';
import {Icon} from '@material-ui/core';
import {InputStyle, SelectStyle, IconStyle} from 'app/indra/components/grids/gridStyles';
import {useTranslation} from 'react-i18next';

interface GridPaginationProps {
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: any;
  pageCount: number;
  gotoPage: any;
  pageIndex: number;
  pageSize: number;
  minRows: number;
  pageSizesCount: number;
  rowCount: number;
  filteredRowCount: number;
}

const GridPagination: FunctionComponent<GridPaginationProps> = React.memo((props) => {
  const {
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    pageIndex,
    pageSize,
    minRows,
    pageSizesCount,
    rowCount,
    filteredRowCount
  } = props;

  const {t} = useTranslation();

  const pageSizes = [];
  //pageSizes.push(undefined);
  for (let i = 0; i < pageSizesCount; i++) {
    pageSizes.push((i + 1) * minRows);
  }

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <span style={{flex: 1}}>
        {rowCount - filteredRowCount === 0
          ? t('indra:grid.pagination.rowCount').replace('%p1%', rowCount.toString())
          : t('indra:grid.pagination.rowCountFiltered')
              .replace('%p1%', rowCount.toString())
              .replace('%p2%', filteredRowCount.toString())}
      </span>

      <span style={{marginLeft: 32}}>
        <button
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
          style={{
            border: 0,
            color: !canPreviousPage ? 'rgba(0, 0, 0, 0.26)' : '#3d3d3d',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            verticalAlign: 'middle'
          }}>
          <Icon style={IconStyle}>{'first_page'}</Icon>
        </button>
        <button
          onClick={() => gotoPage(pageIndex - 1)}
          disabled={!canPreviousPage}
          style={{
            border: 0,
            color: !canPreviousPage ? 'rgba(0, 0, 0, 0.26)' : '#3d3d3d',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            verticalAlign: 'middle',
            marginLeft: 6
          }}>
          <Icon>{'chevron_left'}</Icon>
        </button>
        <span style={{margin: '0px 16px', verticalAlign: 'middle'}}>
          {t('indra:grid.pagination.page')}&nbsp;
          <b>{pageCount > 0 ? pageIndex + 1 : 0}</b>&nbsp;{t('indra:grid.pagination.pageOf')}&nbsp;
          <b>{pageCount}</b>
        </span>
        <button
          onClick={() => gotoPage(pageIndex + 1)}
          disabled={!canNextPage}
          style={{
            border: 0,
            color: !canNextPage ? 'rgba(0, 0, 0, 0.26)' : '#3d3d3d',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            verticalAlign: 'middle',
            marginRight: 6
          }}>
          <Icon>{'chevron_right'}</Icon>
        </button>
        <button
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
          style={{
            border: 0,
            color: !canNextPage ? 'rgba(0, 0, 0, 0.26)' : '#3d3d3d',
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            verticalAlign: 'middle'
          }}>
          <Icon style={IconStyle}>{'last_page'}</Icon>
        </button>
      </span>

      <span style={{marginLeft: 32, verticalAlign: 'middle'}}>
        {t('indra:grid.pagination.goToPage')}&nbsp;{' '}
        <input
          type="number"
          defaultValue={pageIndex + 1}
          onChange={(e) => {
            let page = e.target.value ? Number(e.target.value) - 1 : 0;
            gotoPage(page);
          }}
          style={{
            ...InputStyle,
            ...{width: 100}
          }}
        />
      </span>

      {/*
        <span style={{ marginLeft: 32, verticalAlign: "middle" }}>
          <select
            value={pageSize}
            onChange={(e) => {
              if (e.target.value != null) {
                const pageSize = Number(e.target.value);
                setForcedPageSize(pageSize);
              }
            }}
            style={SelectStyle}
          >
            {pageSizes.map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Zobraz {pageSize} řádků
              </option>
            ))}
          </select>
        </span>
      */}
    </div>
  );
});

export default GridPagination;
