import {
  createLayoutDefinition,
  CustomReactGridLayout,
  LayoutName,
  LayoutProps,
  SettingsType,
  unableToRender
} from 'app/indra/components/layouts/layoutController';
import Panel, {panelStyles} from 'app/indra/components/panels/panelController';
import React, {FunctionComponent, useState} from 'react';
import './reactGridLayout.css';

const Layout3H: FunctionComponent<LayoutProps> = React.memo((props) => {
  const panels = props.panels;
  const classes = panelStyles();

  if (!panels || panels.size !== 3) {
    console.log('Wrong number of panels size!');
    return unableToRender(props.layoutData.layoutId);
  }

  const defaultLayoutComposition = [
    {x: 20, y: 2, w: 7, h: 41, i: '0', isResizable: true, isDraggable: true, bounded: true},
    {x: 30, y: 2, w: 7, h: 41, i: '1', isResizable: true, isDraggable: true, bounded: true},
    {x: 40, y: 2, w: 6, h: 41, i: '2', isResizable: true, isDraggable: true, bounded: true},
    {x: 0, y: 0, w: 20, h: 2, i: 'LayoutName', static: true} // USED FOR LAYOUT TITLE
  ];

  const [inititalLayout] = useState(createLayoutDefinition(defaultLayoutComposition, null, null));

  return (
    <CustomReactGridLayout onLayoutChange={(data: any) => {props.writeSettings({type: SettingsType.LAYOUT_PANEL_DEF, data: data})}}
      style={{display: 'flex', flex: 1}} cols={20} compactType={'horizontal'} rowHeight={25}
      layout={inititalLayout} margin={[5, 5]}
      draggableHandle=".MyDraggableHandleClassName"
      useCSSTransforms>
      <div key={'LayoutName'} className={classes.def}>
        <LayoutName layoutName={props.layoutData.layoutName} />
      </div>
      <div key={'0'} className={classes.def}>
        <Panel panel={panels.get(1)} {...props} />
      </div>
      <div key={'1'} className={classes.def}>
        <Panel panel={panels.get(2)} {...props} />
      </div>
      <div key={'2'} className={classes.def}>
        <Panel panel={panels.get(3)} {...props} />
      </div>
    </CustomReactGridLayout>
 );
});

export default Layout3H;
