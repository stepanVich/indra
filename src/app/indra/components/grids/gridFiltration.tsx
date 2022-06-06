import React from 'react';
import {useAsyncDebounce} from 'react-table';
import matchSorter from 'match-sorter';
import {Icon, Checkbox, Select, MenuItem} from '@material-ui/core';
import {DATATYPE_ICON} from 'app/indra/components/grids/gridTable';
import {InputStyle, SelectStyle, MenuItemStyle, IconStyle, CheckboxStyle} from 'app/indra/components/grids/gridStyles';
import {useTranslation} from 'react-i18next';

// Define a default UI for filtering
export function GlobalFilter({preGlobalFilteredRows, globalFilter, setGlobalFilter}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <>
      <span style={{verticalAlign: 'baseline'}}>Globální vyhledávání:&nbsp; </span>
      <input
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        //placeholder={`Mezi ${count} záznamy...`}
        style={{...InputStyle, ...{width: 150}}}
      />
    </>
  );
}

// Define a default UI for filtering
export function DefaultColumnFilter({column: {filterValue, preFilteredRows, setFilter}}: any) {
  const {t} = useTranslation();
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      //placeholder={`Search ${count} records...`}
      placeholder={t(`indra:grid.filtration.search`)}
      style={{
        ...InputStyle,
        ...{alignSelf: 'center'}
      }}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
export function SelectColumnFilter({column: {filterValue, setFilter, preFilteredRows, id, datatype}}: any) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options: any = new Set();
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <Select
      value={undefined}
      displayEmpty
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      style={{
        ...SelectStyle,
        ...{alignSelf: 'center'}
      }}>
      <MenuItem value={undefined} style={MenuItemStyle}>
        <span style={{padding: 2, verticalAlign: 'middle'}}>{'Vše'}</span>
      </MenuItem>
      {options.map((option, i) => (
        <MenuItem key={i} value={option} style={MenuItemStyle}>
          {datatype.toLowerCase() === DATATYPE_ICON ? (
            <Icon style={IconStyle}>{option}</Icon>
          ) : (
            <span style={{padding: 2, verticalAlign: 'middle'}}>{option}</span>
          )}
        </MenuItem>
      ))}
    </Select>
  );
}

// This is a custom filter UI that uses a
// slider to set the filter value between a column's
// min and max values
export function SliderColumnFilter({column: {filterValue, setFilter, preFilteredRows, id}}: any) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

// This is a custom UI for our 'between' or number range
// filter. It uses two number boxes and filters rows to
// ones that have values between the two
export function NumberRangeColumnFilter({column: {filterValue = [], preFilteredRows, setFilter, id}}: any) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row: any) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <div
      style={{
        display: 'flex'
      }}>
      <input
        value={filterValue[0] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: '70px',
          marginRight: '0.5rem'
        }}
      />
      to
      <input
        value={filterValue[1] || ''}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: '70px',
          marginLeft: '0.5rem'
        }}
      />
    </div>
  );
}

export function CheckboxColumnFilter({column: {filterValue, preFilteredRows, setFilter}}: any) {
  return (
    <Checkbox
      checked={filterValue === undefined ? false : filterValue}
      icon={
        <Icon style={IconStyle}>
          {filterValue === undefined ? 'indeterminate_check_box' : 'check_box_outline_blank'}
        </Icon>
      }
      checkedIcon={<Icon style={IconStyle}>{'check_box'}</Icon>}
      onChange={(e) => {
        setFilter(filterValue ? undefined : filterValue === false ? true : false);
      }}
      style={CheckboxStyle}
    />
  );
}

export function DateColumnFilter({column: {filterValue, preFilteredRows, setFilter}}: any) {
  return (
    <input
      type="date"
      value={filterValue || undefined}
      defaultValue={undefined}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      style={InputStyle}
    />
  );
}

export function fuzzyTextFilterFn(rows: any, id: any, filterValue: any) {
  return matchSorter(rows, filterValue, {
    keys: [(row: any) => row.values[id]],
    threshold: matchSorter.rankings.WORD_STARTS_WITH
  });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val: any) => !val;

// Define a custom filter filter function!
export function filterGreaterThan(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue >= filterValue;
  });
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = (val: any) => typeof val !== 'number';

export function textStartsWith(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue !== undefined ? String(rowValue).toLowerCase().startsWith(String(filterValue).toLowerCase()) : true;
  });
}

export function textWildcard(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue !== undefined
      ? new RegExp(
          '^' +
            String(filterValue)
              .replace(/([.*+?^=!:${}()|\\[\]\\/\\])/g, '\\$1')
              .toLowerCase()
              .replace(/\\[*]/g, '.*')
        ).exec(String(rowValue).toLowerCase())
      : true;
  });
}

export function textEquals(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue !== undefined ? String(rowValue) === String(filterValue) : true;
  });
}

export function numberEquals(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return rowValue == filterValue;
  });
}

export function checkbox(rows: any, id: any, filterValue: any) {
  return rows.filter((row: any) => {
    const rowValue = row.values[id];
    return filterValue === undefined ? true : rowValue === filterValue;
  });
}
