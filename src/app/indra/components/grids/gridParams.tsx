import {Button, Checkbox, Icon, makeStyles, TextField} from '@material-ui/core';
import {CheckboxStyle, IconStyle, InputStyle, SelectStyle} from 'app/indra/components/grids/gridStyles';
import React, {FunctionComponent, useState, useEffect} from 'react';
import {PanelCommunication} from 'app/indra/components/panels/panelController';
import {
  DATATYPE_NUMBER,
  DATATYPE_FLOAT,
  DATATYPE_DATE,
  DATATYPE_TIME,
  DATATYPE_DATETIME,
  DATATYPE_BOOLEAN
} from 'app/indra/components/grids/gridTable';

interface GridParamsProps {
  gridParams: any[];
  setGridParameters?: any;
  communication?: PanelCommunication[];
  hideParams?: boolean | undefined;
}

const useStyles = makeStyles({
  button: {
    background: 'linear-gradient(45deg, #3F51B5 30%, #5F6589 90%)',
    '&:hover': {
      background: 'linear-gradient(180deg, #3F51B5 30%, #5F6589 90%)'
    }
  }
});

export interface GridParam {
  label: string;
  dbParamName: string;
  datatype: string;
  value: any;
  list: any[];
  inputName: string;
}

const getGridParameters = (gridParams: any) => {
  const gridParameters: GridParam[] = [];
  if (gridParams) {
    gridParams.forEach((gridParam: any) => {
      gridParameters.push({
        label: gridParam.label,
        dbParamName: gridParam.dbParamName,
        datatype: gridParam.datatype,
        value: gridParam.defaultValue,
        list: gridParam.list_values,
        inputName: gridParam.inputName
      });
    });
  }
  return gridParameters;
};

const GridParams: FunctionComponent<GridParamsProps> = React.memo((props) => {
  const [gridParams, setGridParams] = useState<GridParam[]>(getGridParameters(props.gridParams));

  const onParamChange = (dbParamName: string, value: any) => {
    if (dbParamName === undefined) {
      return;
    }

    gridParams.forEach((gridParam: GridParam) => {
      if (gridParam.dbParamName === dbParamName) {
        gridParam.value = value;
      }
    });
    setGridParams(gridParams.slice());
  };

  if (!gridParams) {
    return <div> Parametry se nacitaji </div>;
  }

  // check for received communication from other panels
  // set parameters from incoming communication
  // refresh data if values in parameters have changed
  useEffect(() => {
    if (props.communication && props.communication.length > 0) {
      console.log('Received communication: ' + JSON.stringify(props.communication));
      let paramChanged = false;
      const newGridParams: GridParam[] = gridParams.splice(0);

      props.communication.forEach((comm: PanelCommunication) => {
        if (comm.data) {
          comm.data.forEach((row: any) => {
            const {key, value} = row;
            newGridParams.forEach((gridParam) => {
              if (gridParam.inputName && gridParam.inputName === key) {
                gridParam.value = value;
                paramChanged = true;
              }
            });
          });
        }
      });

      if (paramChanged) {
        setGridParams(newGridParams);
        props.setGridParameters(newGridParams);
      }
    }
  }, [props.communication]);

  const classes = useStyles();

  const renderParam = (param: GridParam) => {
    switch (param.datatype.toLowerCase()) {
      case DATATYPE_NUMBER:
        return (
          <input
            type="number"
            value={param.value}
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.value)}
            style={InputStyle}
          />
        );
      case DATATYPE_FLOAT:
        return (
          <input
            type="number"
            step="0.01"
            value={param.value}
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.value)}
            style={InputStyle}
          />
        );
      case DATATYPE_DATE:
        return (
          <TextField
            id={'date_' + param.dbParamName}
            type="date"
            value={param.value}
            multiline={false}
            inputProps={{style: InputStyle}}
            style={{margin: 0}}
            size="small"
            margin="normal"
            variant="outlined"
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.value)}
          />
        );
      case DATATYPE_TIME:
        return (
          <input
            type="time"
            value={param.value}
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.value)}
            style={InputStyle}
          />
        );
      case DATATYPE_DATETIME:
        return (
          <input
            type="datetime"
            value={param.value}
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.value)}
            style={InputStyle}
          />
        );
      case DATATYPE_BOOLEAN:
        return (
          <Checkbox
            checked={param.value}
            onChange={(e: any) => onParamChange(param.dbParamName, e.target.checked)}
            icon={<Icon style={IconStyle}>{'check_box_outline_blank'}</Icon>}
            checkedIcon={<Icon style={IconStyle}>{'check_box'}</Icon>}
            style={CheckboxStyle}
          />
        );
      default:
        if (param.list != null && param.list.length > 0) {
          return (
            <select onChange={() => {}} style={SelectStyle}>
              {param.list.map((value: string, key: number) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          );
        } else {
          return <input type="text" defaultValue={''} onChange={() => {}} style={InputStyle} />;
        }
    }
  };

  if (props.hideParams) {
    return null;
  }

  if (gridParams.length === 0) {
    return <>Žádné parametry.</>;
  }

  return (
    <div
      style={{
        display: 'table'
      }}>
      <div
        style={{
          display: 'table',
          boxSizing: 'border-box',
          borderSpacing: 0,
          borderRadius: 4,
          overflow: 'hidden',
          border: '1px solid rgba(0, 0, 0, 0.26)'
        }}>
        <div
          style={{
            padding: '6px 16px',
            border: '0px solid rgba(0, 0, 0, 0.13)',
            borderWidth: '3px 0px',
            backgroundColor: '#eaeaea'
          }}>
          {gridParams.map((param: any, key: any) => {
            return (
              <div
                key={key}
                style={{
                  display: 'table-row',
                  height: 40,
                  verticalAlign: 'middle'
                }}>
                <div
                  style={{
                    display: 'table-cell',
                    width: 100,
                    verticalAlign: 'middle',
                    fontWeight: 'bold',
                    color: '#3d3d3d'
                  }}>
                  {param.label + ':'}
                </div>
                <div style={{display: 'table-cell', verticalAlign: 'middle'}}>{renderParam(param)}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          display: 'table-cell',
          verticalAlign: 'bottom',
          paddingLeft: 16
        }}>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{marginRight: 2}}
          onClick={() => props.setGridParameters(gridParams.slice(0))}
          className={classes.button}>
          Zobrazit
        </Button>
      </div>
    </div>
  );
});

export default GridParams;
