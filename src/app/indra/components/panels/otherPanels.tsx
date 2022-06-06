import {Button, TextField, withStyles} from '@material-ui/core';
import {PanelProp, sendDefaultOutput} from 'app/indra/components/panels/panelController';
import React, {FunctionComponent} from 'react';
import {useTranslation} from 'react-i18next';

export const PanelXXX1: FunctionComponent<PanelProp> = React.memo((props) => {
  const {t} = useTranslation();
  const [orderId, setOrderId] = React.useState<number | null>();
  const [version, setVersion] = React.useState<number | null>();

  const panelDef = props.panel;

  const sendData = () => {
    let data: any = [];
    data.push({
      key: 'orderId',
      value: orderId
    });
    data.push({
      key: 'version',
      value: version
    });

    sendDefaultOutput(data, panelDef, props.communication, props.setCommunication);
  };

  return (
    <div style={{padding: 5, flex: 1}}>
      <TextField
        id="orderId"
        label="Order ID"
        type="number"
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        style={{margin: 5}}
        onChange={(val) => setOrderId(parseInt(val.target.value))}
      />

      <TextField
        id="version"
        label="Version"
        type="number"
        variant="outlined"
        size="small"
        InputLabelProps={{
          shrink: true
        }}
        style={{margin: 5}}
        onChange={(val) => setVersion(parseInt(val.target.value))}
      />
      <br />
      <Button variant="outlined" color="primary" size="small" style={{margin: 5}} onClick={sendData}>
        {t('indra:otherPanels.button.send')}
      </Button>
    </div>
  );
});

export const PanelXXX2: FunctionComponent<PanelProp> = React.memo((props) => {
  return <div> Panel2: {JSON.stringify(props.panel)}</div>;
});

const styles = {
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px'
  }
};

function HigherOrderComponent(props: any) {
  const {classes} = props;
  return <Button className={classes.root}>Higher-order component</Button>;
}

export const HigherOrderComponentWithStyles = withStyles(styles)(HigherOrderComponent);

export const PanelXXX3: FunctionComponent<PanelProp> = React.memo((props) => {
  const [date, setDate] = React.useState<any>('2017-05-24');

  return (
    <div style={{padding: 5}}>
      <div> Panel3: {JSON.stringify(props.communication)} </div>
      <TextField
        id="date"
        label="Birthday"
        type="date"
        defaultValue={date}
        InputLabelProps={{
          shrink: true
        }}
        onChange={(val) => setDate(val.target.value)}
      />
    </div>
  );
});
