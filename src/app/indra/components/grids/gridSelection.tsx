import React from 'react';
import {Checkbox, Icon} from '@material-ui/core';

export const IndeterminateCheckbox = React.forwardRef(({indeterminate, ...rest}: any, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef: any = ref || defaultRef;

  React.useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate;
  }, [resolvedRef, indeterminate]);

  return (
    <div
      key={'IndeterminateCheckbox'}
      className="td"
      style={{
        height: '100%',
        textAlign: 'center',
        padding: 0,
        verticalAlign: 'middle'
      }}>
      <Checkbox
        checked={false}
        ref={resolvedRef}
        {...rest}
        icon={<Icon style={{fontSize: 20}}>{'check_box_outline_blank'}</Icon>}
        checkedIcon={<Icon style={{fontSize: 20}}>{'check_box'}</Icon>}
        style={{padding: 0, verticalAlign: 'baseline', ...rest.style}}
      />
    </div>
  );
});
