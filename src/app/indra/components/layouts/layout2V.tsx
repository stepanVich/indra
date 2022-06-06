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

const Layout2V: FunctionComponent<LayoutProps> = React.memo((props) => {
  const panels: Map<number, PanelOrderAndType> = props.panels;
  const classes = panelStyles();

  if (!panels || panels.size !== 2) {
    console.log('Wrong number of panels size!');
    return unableToRender(props.layoutData.layoutId);
  }

  const defaultLayoutComposition = [
    {x: 1, y: 1, w: 20, h: 920, i: '0', minW: 20, maxW: 20, isResizable: true, isDraggable: true, bounded: true, draggableHandle: '.CancelDragHandleClassName'},
    {x: 2, y: 2, w: 20, h: 920, i: '1', minW: 20, maxW: 20, isResizable: true, isDraggable: true, bounded: true, draggableHandle: '.CancelDragHandleClassName'},
    {x: 0, y: 0, w: 20, h: 30, i: 'LayoutName', static: true}, // USED FOR LAYOUT TITLE
  ];

  const [inititalLayout] = useState(createLayoutDefinition(defaultLayoutComposition, null, null));

  return (
    <CustomReactGridLayout onLayoutChange={(data: any) => {props.writeSettings({type: SettingsType.LAYOUT_PANEL_DEF, data: data})}}
      style={{display: 'flex', flex: 1}} cols={20} compactType={'horizontal'} rowHeight={2}
      layout={inititalLayout} margin={[5, 5]}
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
    </CustomReactGridLayout>
 );
});

export default Layout2V;
