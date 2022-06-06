import {Button, createStyles, InputProps, makeStyles, Theme} from '@material-ui/core';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {GraphDMResults} from 'app/indra/components/graphs/graphDMResults';
import Grid from 'app/indra/components/grids/grid';
import ReportGridVirtualized from 'app/indra/components/grids/old_virtualized/VirtualizedGrid';
import {CreateOrderBT} from 'app/indra/components/layouts/dynamicLayout';
import {BusinessPositionPanel} from 'app/indra/components/layouts/layout3L2R';
import {LayoutCommunication} from 'app/indra/components/layouts/layoutController';
import {PanelXXX1, PanelXXX2, PanelXXX3} from 'app/indra/components/panels/otherPanels';
import React, {FunctionComponent, useEffect} from 'react';

const CreateOrder = React.lazy(() => import('app/indra/components/forms/order/createOrder'));
const ModifyOrder = React.lazy(() => import('app/indra/components/forms/order/modifyOrder'));
const UploadOrder = React.lazy(() => import('app/indra/components/forms/order/uploadOrders'));
const RRDPanel = React.lazy(() => import('app/indra/components/forms/rrd/rrdPanel'));

export const panelStyles = makeStyles({
  def: {
    overflow: 'auto',
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(48, 38, 64, .3)',
    flex: 1,
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column'
  }
});

const useStyles = makeStyles((_theme: Theme) =>
  createStyles({
    panelMove: {
      textAlign: 'left',
      position: 'absolute',
      top: 0,
      left: 0,
      width: 30,
      height: 30,
      cursor: 'all-scroll',
      zIndex: 3,
      display: 'flex',
      alignItems: 'center'
    },
    panelInstance: {
      position: 'relative',
      flex: 1,
      display: 'flex',
      overflow: 'auto'
    }
  })
);

export interface PanelOrderAndType {
  order: number;
  type: string;
  definition: any;
  header: string;
  composition: PanelComposition;
  layoutChanged?: boolean;
}

export interface PanelTypeAndDefinition {
  type: string;
  definition?: any;
}

export interface PanelComposition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface PanelCommunication {
  sourcePanel: number;
  type: string;
  data: any;
}

export interface PanelProp extends InputProps {
  panel: PanelOrderAndType | undefined;
  outputs: LayoutCommunication[];
  communication?: PanelCommunication[];
  setCommunication?: any;
  sendDefaultOutput?: any;
  writeSettings: (type: any, data: any) => void;
  layoutChanged?: boolean;
}

const button = (
  <Button variant="contained" color="primary">
    Primary
  </Button>
);

const list: any[] = [];
for (let index = 0; index < 300; index++) {
  list.push(button);
}

export const sendDefaultOutput = (data: any, panelDef: any, communication: any, setCommunication: any) => {
  if (panelDef && communication) {
    const comm: PanelCommunication = {
      sourcePanel: panelDef.order,
      type: 'DEFAULT',
      data: data
    };
    console.log('-------sendDefaultOutput: ' + JSON.stringify(comm));
    const newArray = communication.slice();
    newArray.push(comm);
    setCommunication(newArray);
  }
};

const PanelVirtualized: FunctionComponent<PanelProp> = React.memo((props) => {
  if (props.panel == null) {
    return <>Grid definition is missing.</>;
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
      <div style={{flex: 0}}>
        <div> PanelVirtualized: {JSON.stringify(props.communication)} </div>
        <p>Lorem ipsum panel.</p>
        <br />

        <div>id: {props.panel.definition.gridId}</div>
        <br />
      </div>

      <div style={{flex: 1}}>
        <ReportGridVirtualized gridId={props.panel.definition.gridId} />
      </div>
    </div>
  );
});

const PanelGrid: FunctionComponent<PanelProp> = React.memo((props) => {
  if (props.panel == null) {
    return <>Grid definition is missing.</>;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box'
      }}>
      <Grid
        gridId={props.panel.definition.gridId}
        {...props}
        sendDefaultOutput={sendDefaultOutput}
        layoutChanged={props.layoutChanged}
      />
    </div>
  );
});

const ResultsDTInGraphPanel: FunctionComponent<PanelProp> = React.memo((props) => {
  return <GraphDMResults {...props} />;
});

export const Panels = {
  PanelXXX1: PanelXXX1,
  PanelXXX2: PanelXXX2,
  PanelXXX3: PanelXXX3,
  PanelVirtualized: PanelVirtualized,
  PanelGrid: PanelGrid,
  CreateOrder: CreateOrder,
  ModifyOrder: ModifyOrder,
  UploadOrder: UploadOrder,
  BusinessPositionPanel: BusinessPositionPanel,
  ResultsDTInGraphPanel: ResultsDTInGraphPanel,
  CreateOrderBT: CreateOrderBT,
  RRDPanel: RRDPanel
};

const Panel: FunctionComponent<PanelProp> = React.memo((props) => {
  const classes = useStyles();

  const [panelInstance, setPanelInstance] = React.useState<React.ReactElement>(<div />);
  const [visible, setVisible] = React.useState(false);

  const {panel, communication, outputs} = props;

  useEffect(() => {
    if (communication) {
      const relatedPanelComm: PanelCommunication[] = [];
      communication.forEach((comm) => {
        outputs.forEach((output) => {
          if (
            panel &&
            outputs &&
            output.from === comm.sourcePanel &&
            output.to === panel.order &&
            output.type === comm.type
          ) {
            relatedPanelComm.push(comm);
          }
        });
      });
      if (relatedPanelComm.length > 0) {
        setPanelInstance(React.cloneElement(panelInstance, {communication: relatedPanelComm}, null));
      }
    }
  }, [communication]);

  useEffect(() => {
    const panel = props.panel;
    let found = false;
    if (!panel || !panel.type) {
      setPanelInstance(<div>Unable to render panel.</div>);
      return;
    }

    for (const [k, val] of Object.entries(Panels)) {
      if (k.localeCompare(panel.type) === 0) {
        setPanelInstance(React.createElement(val, {...props}, null));
        found = true;
      }
    }
    if (!found) {
      setPanelInstance(<div>Unable to find defined panel: {panel.type}.</div>);
    }
  }, [props.panel, props.layoutChanged]);

  const ownClassName = `${'MyDraggableHandleClassName'} ${classes.panelMove}`;
  return (
    <>
      <div
        onMouseOver={() => {
          setVisible(true);
        }}
        onMouseOut={() => {
          setVisible(false);
        }}
        className={ownClassName}>
        {visible && (
          <>
            <ArrowLeftIcon style={{pointerEvents: 'none', maxWidth: 20, padding: 0, margin: 0}} />
            <ArrowRightIcon style={{pointerEvents: 'none', maxWidth: 20, padding: 0, margin: 0}} />
          </>
        )}
      </div>
      <div className={classes.panelInstance}>{panelInstance}</div>
    </>
  );
});

export default Panel;
