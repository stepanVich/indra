import RRD from './rrd';
import {PanelProp} from '../../panels/panelController';
import React, {FunctionComponent} from 'react';


const RRDPanel: FunctionComponent<PanelProp> = React.memo((props) => {
  return <RRD {...props} />
});

export default RRDPanel;
