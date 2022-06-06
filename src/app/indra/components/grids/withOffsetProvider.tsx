import React, {FunctionComponent, useState, useCallback, useEffect, useLayoutEffect} from 'react';
import {ReactGridLayoutProps, Layout} from 'react-grid-layout';

const withOffsetProvider = (WrappedComponent: any) => {
  const HOC: FunctionComponent<ReactGridLayoutProps> = React.memo((props) => {
    const rowHeight = props.rowHeight ?? 0;
    const marginVertical = props.margin != null ? props.margin[1] : 0;

    const [prevLayout, setPrevLayout] = useState<Layout[] | undefined>(undefined);

    const calculateHeight = useCallback((rowCount: number) => {
      return rowCount * rowHeight + (rowCount - 1) * marginVertical;
    }, []);

    const [children, setChildren] = useState<any>(props.children);
    let key = 0;

    useEffect(() => {
      setChildren(props.children);
    }, [props.children]);

    const recalculateChildren = (children: any, resizedOffsets: number[]) => {
      let newChildren: any = [];
      React.Children.forEach(children, (child: any) => {
        let newProps: any = {};
        if (child.key == null) {
          if (child.props.resizedOffset != null) {
            newProps = {resizedOffset: resizedOffsets[key] ?? 0};
          }
          key++;
        }

        newChildren.push(
          React.cloneElement(child, newProps, recalculateChildren(child.props.children, resizedOffsets))
        );
      });

      return newChildren.length !== 1 ? newChildren : newChildren[0];
    };

    return (
      <WrappedComponent
        {...props}
        onLayoutChange={(newLayout: any) => {
          if (props.onLayoutChange !== undefined) {
            props.onLayoutChange(newLayout);
          }

          let resizedOffsets: number[] = [];
          newLayout.forEach((layout: Layout, key: number) => {
            if (prevLayout !== undefined && prevLayout[key] !== undefined) {
              const layoutRowCount = layout.h;
              const layoutHeight = calculateHeight(layoutRowCount);
              const prevLayoutHeight = calculateHeight(prevLayout[key].h);

              resizedOffsets[key] = layoutHeight - prevLayoutHeight;
            }
          });
          setPrevLayout(newLayout);

          key = 0;
          setChildren(recalculateChildren(props.children, resizedOffsets));
        }}>
        {children}
      </WrappedComponent>
    );
  });

  return HOC;
};

export default withOffsetProvider;
