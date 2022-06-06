import {
  createLayoutDefinition,
  CustomReactGridLayout,
  LayoutProps,
  SettingsType,
  unableToRender
} from 'app/indra/components/layouts/layoutController';
import Panel, {PanelOrderAndType, panelStyles} from 'app/indra/components/panels/panelController';
import React, {FunctionComponent, useState} from 'react';
import './reactGridLayout.css';

const Layout3L2R: FunctionComponent<LayoutProps> = React.memo((props) => {
  const panels: Map<number, PanelOrderAndType> = props.panels;
  const classes = panelStyles();

  if (!panels || panels.size !== 5) {
    console.log('Wrong number of panels size!');
    return unableToRender(props.layoutData.layoutId);
  }

  const defaultLayoutComposition = [
    {x: 0, y: 0, w: 10, h: 15, i: '0', isResizable: true, isDraggable: true, bounded: true},
    {x: 0, y: 15, w: 10, h: 20, i: '1', isResizable: true, isDraggable: true, bounded: true},
    {x: 0, y: 35, w: 10, h: 10, i: '2', isResizable: true, isDraggable: true, bounded: true},
    {x: 10, y: 0, w: 10, h: 10, i: '3', isResizable: true, isDraggable: true, bounded: true},
    {x: 10, y: 10, w: 10, h: 35, i: '4', isResizable: true, isDraggable: true, bounded: true},
    {x: 10, y: 0, w: 20, h: 2, i: 'LayoutName', static: true} // USED FOR LAYOUT TITLE
  ];

  const [inititalLayout] = useState(createLayoutDefinition(defaultLayoutComposition, null, null));

  return (
    <CustomReactGridLayout
      onLayoutChange={(data: any) => {
        props.writeSettings({type: SettingsType.LAYOUT_PANEL_DEF, data: data});
      }}
      style={{display: 'flex', flex: 1}}
      cols={20}
      compactType={'vertical'}
      rowHeight={25}
      verticalCompact
      layout={inititalLayout}
      margin={[5, 5]}
      draggableHandle=".MyDraggableHandleClassName"
      useCSSTransforms>
      {/* <div key={'LayoutName'} className={classes.def}>
          <LayoutName layoutName={props.layoutName} />
        </div> */}
      <div key={'0'} className={classes.def}>
        <Panel panel={panels.get(1)} {...props} />
      </div>
      <div key={'1'} className={classes.def}>
        <Panel panel={panels.get(2)} {...props} />
      </div>
      <div key={'2'} className={classes.def}>
        <Panel panel={panels.get(3)} {...props} />
      </div>
      <div key={'3'} className={classes.def}>
        <Panel panel={panels.get(4)} {...props} />
      </div>
      <div key={'4'} className={classes.def}>
        <Panel panel={panels.get(5)} {...props} />
      </div>
    </CustomReactGridLayout>
  );
});

import BusinessPosition from '../../resources/images/BusinessPosition.png';

export function BusinessPositionPanel() {
  return <img src={BusinessPosition} style={{pointerEvents: 'none'}} />;
}

export default Layout3L2R;
