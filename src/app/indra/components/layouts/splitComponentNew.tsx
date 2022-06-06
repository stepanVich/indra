import GridLayout from 'react-grid-layout';
import React, { FunctionComponent } from 'react';
import { PanelProp } from 'app/indra/components/panels/panelController';
import { Responsive as ResponsiveGridLayout } from 'react-grid-layout';
// import _ from "lodash";
import RGL, { WidthProvider } from "react-grid-layout";
import './reactGridLayout.css';

const ReactGridLayout = WidthProvider(RGL);

const SplitPaneComponent = React.memo((props) => {

    const defaultProps = {
        className: "layout",
        // items: 20,
        // rowHeight: 30,
        // onLayoutChange: function() {},
        // cols: 12
      };

    //   const generateDOM = () => {
    //     const p = defaultProps;
    //     return _.map(_.range(p.items), function(i: any) {
    //       return (
    //         <div key={i} style={{border: '1px solid'}}>
    //           <span className="text" >{i}</span>
    //         </div>
    //       );
    //     });
    //   }

    // const generateLayout = () => {
    //     const p = defaultProps;
    //     return _.map(new Array(p.items), function(item: any, i: any) {
    //       const y: number = _.result(p, "y") || Math.ceil(Math.random() * 4) + 1;
    //       return {
    //         x: (i * 2) % 12,
    //         y: Math.floor(i / 6) * y,
    //         w: 2,
    //         h: y,
    //         i: i.toString(),
    //         isResizable: true,
    //         isDraggable: false
    //       };
    //     });
    //   }

    //   const layout = generateLayout();

    //   console.log('-------' + JSON.stringify(layout));

      const layouts1 = [{"x":0,"y":0,"w":2,"h":5,"i":"0","isResizable":true,"isDraggable":true, bounded: true},{"x":0,"y":0,"w":2,"h":5,"i":"1","isResizable":true,"isDraggable":true, bounded: true}];

    // const layout = [
    //     {i: 'a', x: 0, y: 0, w: 1, h: 2, static: true},
    //     {i: 'b', x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4},
    //     {i: 'c', x: 4, y: 0, w: 1, h: 2}
    //   ];

return (<ReactGridLayout style={{border: '1px red solid', minHeight: '100%', maxHeight: '100%', overflow: 'auto', display: 'flex', flex: 1, boxSizing: 'border-box'}} cols={2} compactType={'horizontal'} autoSize rowHeight={100}
    layout={layouts1}
    {...props}
  >
      <div key={'0'} style={{border: '1px solid'}}>
              <span className="text" >{'0'}</span>
            </div>
            <div key={'1'} style={{border: '1px solid'}}>
              <span className="text" >{'1'}</span>
            </div>
    {/* {generateDOM()} */}
  </ReactGridLayout>)
});

export default SplitPaneComponent;

