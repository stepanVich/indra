import styled from 'styled-components';
import {CSSProperties} from 'react';
import {DEFAULT_FONT_FAMILY, DEFAULT_FONT_SIZE, INPUT_FONT_SIZE, SELECTION_FONT_SIZE} from 'app/indra/utils/const';

export const HeadingStyleWrapper = {
  display: 'table',
  width: '100%',
  padding: 5,
  marginTop: 0,
  boxSizing: 'border-box',
  backgroundColor: 'rgba(0, 0, 0, 0.05)'
} as CSSProperties;

export const HeadingStyle = {
  display: 'table-cell',
  textAlign: 'left',
  verticalAlign: 'middle',
  fontWeight: 'bold',
  fontSize: 14
} as CSSProperties;

export const TableStyles = styled.div`
  display: block;
  height: 100%;

  .table {
    box-sizing: border-box;
    border-spacing: 0;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0.26);
    display: flex;
    flex-direction: column;
    height: 100%;

    .thead {
      overflow-y: auto;
      overflow-x: hidden;
      flex: 0;
    }

    .tbody {
      overflow-y: scroll;
      overflow-x: hidden;
      flex: 1;
      height: 100%;
    }

    .tr {
      minheight: initial;
      border-bottom: 1px solid rgba(0, 0, 0, 0.26);
    }

    .th,
    .td {
      margin: 0;
      padding: 6px 16px;
      line-height: 20px;

      position: relative;
      flex-direction: column;

      border-right: 1px solid #00000042;
      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        ${'' /* width: 17px; */}
        width: 5px;
        height: 100%;
        position: absolute;
        ${'' /* right: -9px; */}
        right: -3px;
        top: 0;
        z-index: 1;
        touch-action: none;
        ${'' /* prevents from scrolling while dragging on touch devices */}
      }

      .resizerIcon {
        display: inline-block;
        vertical-align: middle;
        margin: 0 -4px;
        &.isResizing {
          color: #3d3d3d;
        }
      }

      .resizerDelimiter {
        display: inline-block;
        vertical-align: middle;
        width: 5px;
        height: 100%;
        margin: 0;
        transform: translateX(0%);
        background: #00000042;
        background: transparent;

        &.isResizing {
          background: #3d3d3d;
          background: transparent;
        }
      }
    }

    .th {
      padding: 3px;
      overflow: hidden;
    }

    .td {
      padding: 3px;
    }

    .MuiInput-underline:before,
    .MuiInput-underline:after {
      display: none;
    }

    .MuiInput-input {
      padding: 0;
    }

    .MuiSelect-select:focus {
      background: transparent;
    }
  }
`;

export const InputStyle = {
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: INPUT_FONT_SIZE,
  width: '100%',
  height: 22,
  margin: 0,
  padding: 0,
  boxSizing: 'border-box',
  border: '1px solid rgba(0, 0, 0, 0.26)',
  borderRadius: 3,
  backgroundColor: '#fcfcfc'
} as CSSProperties;

export const SelectStyle = {
  width: '100%',
  height: 22,
  margin: 0,
  padding: 0,
  border: '1px solid rgba(0, 0, 0, 0.26)',
  borderRadius: 3,
  backgroundColor: '#fcfcfc',
  fontSize: SELECTION_FONT_SIZE,
  overflow: 'hidden'
} as CSSProperties;

export const MenuItemStyle = {
  width: '100%',
  height: '100%',
  fontSize: DEFAULT_FONT_SIZE
} as CSSProperties;

export const CheckboxStyle = {
  width: 20,
  height: 20,
  padding: 0,
  verticalAlign: 'middle'
} as CSSProperties;

export const IconStyle = {
  fontSize: 20,
  verticalAlign: 'middle'
} as CSSProperties;

export const ButtonStyle = {
  padding: '6px 16px',
  borderRadius: 3,
  backgroundColor: '#b2e6d4',
  cursor: 'pointer'
} as CSSProperties;
